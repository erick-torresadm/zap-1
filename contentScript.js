// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "validateKey") {
        validateAndInitialize(request.key);
    }
});

// Função para validar a chave e inicializar o ContactSaver
async function validateAndInitialize(key) {
    try {
        const API_URL = 'https://script.google.com/macros/s/AKfycbx5pA6zZk2d5IvPRba_awMZ6kj2kZ2OcXJNH43xikSfsHxuhwhFKhA53rEAbgtBcqM/exec';
        
        // Faz a requisição para validar a chave
        const response = await fetch(`${API_URL}?key=${key}`);
        const data = await response.json();
        
        if (data.valid) {
            // Se a chave for válida, inicializa o ContactSaver
            initializeContactSaver();
        } else {
            alert('Chave inválida ou já utilizada!');
        }
    } catch (error) {
        console.error('Erro ao validar chave:', error);
        alert('Erro ao validar chave. Por favor, tente novamente.');
    }
}

// Função para inicializar o ContactSaver
function initializeContactSaver() {
    // Cria e adiciona o script do ContactSaver
    const script = document.createElement('script');
    const code = `
        class ContactSaver {
            constructor() {
                this.contacts = new Map();
                this.initialized = false;
                this.init();
            }

            createButton(text, callback, position) {
                const button = document.createElement('button');
                Object.assign(button.style, {
                    backgroundColor: '#44c767',
                    backgroundImage: 'linear-gradient(#44c767, #64e787)',
                    borderRadius: '28px',
                    border: '1px solid #18ab29',
                    display: 'inline-block',
                    color: '#ffffff',
                    fontSize: '17px',
                    padding: '11px 31px',
                    position: 'fixed',
                    right: '10px',
                    width: '150px',
                    top: '7px',
                    zIndex: '999999',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                });

                button.innerHTML = text;
                button.addEventListener('click', callback);
                button.addEventListener('mouseover', () => {
                    button.style.transform = 'scale(1.05)';
                });
                button.addEventListener('mouseout', () => {
                    button.style.transform = 'scale(1)';
                });

                document.body.appendChild(button);
            }

            generateCSV(nameBase) {
                const headers = ['Name', 'Mobile Phone'];
                const rows = Array.from(this.contacts.entries()).map(
                    ([phone, _], index) => [\`\${nameBase}\${index + 1}\`, phone]
                );
                
                return [headers, ...rows]
                    .map(row => row.join(';'))
                    .join('\\n');
            }

            downloadCSV(content) {
                const filename = \`contacts_\${new Date().toISOString().slice(0,10)}.csv\`;
                const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            scanContacts() {
                document.querySelectorAll('span[title]').forEach(element => {
                    const phone = element.innerText || element.getAttribute('title');
                    const phonePattern = /^\\+?\\d[\\d\\s\\-\\(\\)]+$/;

                    if (phonePattern.test(phone)) {
                        const formattedPhone = phone.trim().replace(/\\s+/g, ' ');
                        this.contacts.set(formattedPhone, true);
                        element.style.backgroundColor = '#90EE90';
                        element.style.transition = 'background-color 0.3s';
                    } else {
                        element.style.backgroundColor = 'inherit';
                    }
                });
            }

            init() {
                if (this.initialized) return;
                
                this.createButton('Salvar Contatos', async () => {
                    const nameBase = prompt('Com qual nome deseja salvar os contatos?');
                    if (nameBase) {
                        const csv = this.generateCSV(nameBase);
                        this.downloadCSV(csv);
                    }
                });

                this.scanContacts();
                
                const paneSize = document.querySelector('#pane-side');
                if (paneSize) {
                    paneSize.addEventListener('scroll', () => this.scanContacts());
                }

                this.initialized = true;
            }
        }

        // Inicializa o ContactSaver
        new ContactSaver();
    `;

    script.textContent = code;
    document.body.appendChild(script);
}

// Verifica se está na página do WhatsApp Web
if (window.location.hostname === 'web.whatsapp.com') {
    console.log('WhatsApp Contact Saver: Script carregado');
}