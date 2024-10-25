function newButton(text, callback, position) {
    var a = document.createElement('button');
    a.innerHTML = text;
    a.style.backgroundColor = '#44c767';
    a.style.backgroundImage = 'linear-gradient(#44c767, #64e787)';
    a.style.borderRadius = '28px';
    a.style.border = '1px solid #18ab29';
    a.style.display = 'inline-block';
    a.style.color = '#ffffff';
    a.style.fontSize = '17px';
    a.style.padding = '11px 31px';
    a.style.position = 'fixed';
    a.style.right = `${10 + ((150 + 15) * (position - 1))}px`;
    a.style.width = '150px';
    a.style.top = '7px';
    a.style.zIndex = '999';
    document.body.appendChild(a);
    a.addEventListener('click', callback);
}

function getContent(nameBase) {
    let content = 'Name;Mobile Phone\n'; // Cabeçalhos das colunas
    let counter = 1;
    
    for (let phone in window.sContacts) {
        content += `${nameBase}${counter};${phone}\n`; // Adiciona o nome base fornecido e incrementa o número
        counter++;
    }
    
    return content;
}

function init() {
    newButton('Salvar Contatos', () => {
        let nameBase = prompt('Com qual nome deseja salvar os contatos?'); // Pede ao usuário o nome base
        if (nameBase) {
            download(getContent(nameBase)); // Passa o nome base para a função getContent
        }
    }, 1);
    getNumbers();
    document.querySelector('#pane-side').addEventListener('scroll', getNumbers);
}

function download(content) {
    var data = 'data:application/octet-stream,' + encodeURIComponent(content);
    var a = document.createElement('a');
    a.href = data;
    a.download = 'contacts.csv';
    a.click();
}

function getNumbers() {
    if (window.sContacts === undefined) window.sContacts = {};
    document.querySelectorAll('span[title]').forEach(element => {
        let phone = element.innerText || element.getAttribute('title');
        if (/^\+?\d[\d\s\-\(\)]+$/.test(phone)) {
            phone = phone.trim().replace(/\s+/g, ' ');
            window.sContacts[phone] = phone;
            element.style.backgroundColor = '#00ff00';
        } else {
            element.style.backgroundColor = 'inherit';
        }
    });
}

init();
