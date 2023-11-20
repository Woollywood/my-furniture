const popupList = new Map();
popupInit();

function popupInit() {
	const popupLinkList = document.querySelectorAll('[data-popup]');
	popupLinkList.forEach((popupLink) => {
		const popup = document.querySelector(popupLink.dataset.popup);
		popupList.set(popupLink, popup);

		popupLink.addEventListener('click', (event) => {
			event.preventDefault();
			popupToggle(popup);
		});
	});

	const popupSet = new Set();
	popupList.forEach((key, value) => {
		popupSet.add(key);
	});

	popupSet.forEach((popup) => {
		const popupClose = popup.querySelector('[data-close]');
		popupClose.addEventListener('click', (event) => {
			popupToggle(popup);
		});
	});
}

function popupToggle(popup) {
	document.documentElement.classList.toggle('popup-show');
	bodyLockToggle();
	popup.classList.toggle('show');
}
