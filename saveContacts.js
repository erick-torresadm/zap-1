class ContactSaver {
    constructor() {
        this.contacts = new Map();
        this.initialized = false;
        this.API_URL = 'https://script.google.com/macros/s/AKfycbx5pA6zZk2d5IvPRba_awMZ6kj2kZ2OcXJNH43xikSfsHxuhwhFKhA53rEAbgtBcqM/exec';
    }

    async verifyKey(key) {
        try {
            const response = await fetch(`${this.API_URL}?key=${key}`);
            const data = await response.json();
            return data.valid;
        } catch (error) {
            console.error('Erro ao verificar chave:', error);
            return false;
        }
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
            right: `${10 + ((150 + 15) * (position - 1))}px`,
            width: '150px',
            top: '7px',
            zIndex: '999',
            cursor: 'pointer'
        });

        button.innerHTML = text;
        button.addEventListener('click', callback);
        document.body.appendChild(button);
    }

    generateCSV(nameBase) {
        const headers = ['Name', 'Mobile Phone'];
        const rows = Array.from(this.contacts.entries()).map(
            ([phone, _], index) => [`${nameBase}${index + 1}`, phone]
        );
        
        return [headers, ...rows]
            .map(row => row.join(';'))
            .join('\n');
    }

    downloadCSV(content, filename = 'contacts.csv') {
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
            if (/^\+?\d[\d\s\-\(\)]+$/.test(phone)) {
                const formattedPhone = phone.trim().replace(/\s+/g, ' ');
                this.contacts.set(formattedPhone, true);
                element.style.backgroundColor = '#90EE90';
            } else {
                element.style.backgroundColor = 'inherit';
            }
        });
    }

    async init(key) {
        if (this.initialized) return;
        
        const isKeyValid = await this.verifyKey(key);
        if (!isKeyValid) {
            alert('Chave inválida!');
            return;
        }

        this.createButton('Salvar Contatos', async () => {
            const nameBase = prompt('Com qual nome deseja salvar os contatos?');
            if (nameBase) {
                const csv = this.generateCSV(nameBase);
                this.downloadCSV(csv, `contacts_${new Date().toISOString().slice(0,10)}.csv`);
            }
        }, 1);

        this.scanContacts();
        
        const paneSize = document.querySelector('#pane-side');
        if (paneSize) {
            paneSize.addEventListener('scroll', () => this.scanContacts());
        }

        this.initialized = true;
    }
}

// A inicialização será feita através do popup.js