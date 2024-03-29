function autonav() {
	const root = document.createElement('ul');
	var parent = root;
	var levelPrevious = 1;
	const nav = document.getElementsByTagName('nav')[0];
	if (nav === undefined) {
		return;
	}
	document.querySelectorAll('h2, h3, h4, h5, h6').forEach(h => {
		const levelCurrent = parseInt(h.tagName.substring(1)) - 1;
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
			const levelDifference = levelPrevious - levelCurrent;
			for (let i = 0; i < levelDifference; i += 1) {
				parent = parent.parentNode.parentNode;
			}
		}
		parent.appendChild(li);
		levelPrevious = levelCurrent;
	});
	nav.appendChild(root);
}

document.addEventListener('DOMContentLoaded', autonav);
