document.addEventListener('DOMContentLoaded', (event) => {
	console.log('intro start');
	
	const intro = document.querySelector('.intro');
	bodyLockToggle();
	scrollTo(0, 0);

	const logo = document.querySelector('.intro__logo');
	const spinnerText = document.querySelector('.intro__logo-mask');
	spinnerText.classList.add('animation');
	spinnerText.addEventListener('animationend', loaded);

	function loaded(event) {
		console.log('animation end');

		const realLogo = document.querySelector('.header__logo');
		const logoBox = realLogo.getBoundingClientRect();

		gsap.to([logo, spinnerText], {
			left: logoBox.left,
			top: logoBox.top,
			duration: 0.6,
			scale: 1,

			onComplete: () => {
				console.log('complete');

				document.body.classList.remove('loading');
				intro.remove();
				bodyLockToggle();

				gsapAnimationInit();
			},
		});
	}
});
