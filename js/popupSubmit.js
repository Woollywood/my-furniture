document.addEventListener('DOMContentLoaded', (event) => {
	const buttons = document.querySelectorAll('.popup-submit');
	buttons.forEach((button) =>
		button.addEventListener('click', (ev) => {
			ev.preventDefault();

			const target = ev.target;
			const popupContentWrapper = target.closest('.popup__content-inner');
			const contentWidth = popupContentWrapper.offsetWidth;
			const contentHeight = popupContentWrapper.offsetHeight;

			popupContentWrapper.style.display = 'flex';
			popupContentWrapper.style.width = contentWidth + 'px';
			popupContentWrapper.style.height = contentHeight + 'px';
			popupContentWrapper.innerHTML = `
				<div class="popup__thanks-wrapper">
					<h2 class="popup__thanks section-title">Спасибо. Ваша заявка принята</h2>
				</div>
			`;
		})
	);
});
