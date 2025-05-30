
function autoheader() {
	const pages = [
		['Start', 'index.html'],
		['Einleitung', 'Einleitung.html'],
		['Regeln', 'Regeln.html'],
		['Zusammenfassung Regeln', 'Regeln-Zusammenfassung.html'],
		['Abenteuer', 'Abenteuer.html'],
		['Zufall', 'Zufall.html'],
		['Inspiration', 'Inspiration.html'],
		['Projekt', 'Projekt.html'],
		['Fertigkeiten', 'Fertigkeiten.html'],
		['Gspänli Bogen', 'Gspänli.html'],
	];

	const header = document.getElementsByTagName('header')[0];
	if (header === undefined) {
		return;
	}

	const divLeft = document.createElement('div');
	const a = document.createElement('a');
	a.href = 'index.html';
	const img = document.createElement('img');
	img.src = 'Logo.svg';
	img.width = 100;
	img.height = 70;
	img.alt = 'Logo';
	a.appendChild(img);
	divLeft.appendChild(a);

	header.appendChild(divLeft);

	const divRight = document.createElement('div');

	pages.forEach(page => {
		const a = document.createElement('a');
		a.href = page[1];
		a.textContent = page[0];
		divRight.appendChild(a);
	});

	header.appendChild(divRight);
}

document.addEventListener('DOMContentLoaded', autoheader);
