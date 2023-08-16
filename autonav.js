function autonav() {
    const root = document.createElement('ul');
    var parent = root;
    var levelPrevious = 1;
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        const levelCurrent = parseInt(h.tagName.substring(1));
        //const id = 'nav-' + levelCurrent + '-' + h.textContent.toLowerCase();
        const id = h.textContent;
        h.setAttribute('id', id);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = h.textContent;
        a.setAttribute('href', '#' + id);
        li.appendChild(a);
        if (levelCurrent > levelPrevious) {
            const ul = document.createElement('ul');
            parent.lastChild.appendChild(ul);
            parent = ul;
        } else if (levelCurrent < levelPrevious) {
            parent = parent.parentNode.parentNode;
        }
        parent.appendChild(li);
        levelPrevious = levelCurrent;
    });
    const nav = document.getElementsByTagName('nav')[0];
    if (nav !== undefined) {
        nav.appendChild(root);
    }
}

document.addEventListener('DOMContentLoaded', autonav);
