document.addEventListener('DOMContentLoaded', (event) => {
	const intro = document.querySelector('.intro');
	bodyLockToggle();
	scrollTo(0, 0);

	const logo = document.querySelector('.intro__logo');
	const spinnerText = document.querySelector('.intro__logo-mask');
	spinnerText.addEventListener('animationend', loaded);

	function loaded(event) {
		const realLogo = document.querySelector('.header__logo');
		const logoBox = realLogo.getBoundingClientRect();

		gsap.to([logo, spinnerText], {
			left: logoBox.left,
			top: logoBox.top,
			duration: 0.6,
			scale: 1,

			onComplete: () => {
				document.body.classList.remove('loading');
				intro.remove();
				bodyLockToggle();
			}
		});
	}
});
