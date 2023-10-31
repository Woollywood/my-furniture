const workSliders = document.querySelectorAll('.section-9__slider');
workSliders.forEach((slider) => {
	new Splide(slider, {
		type: 'slide',
		perPage: 1,
		gap: 46,
		classes: {
			arrows: 'splide__arrows slider__controlls',
			arrow: 'splide__arrow slider__arrow',
			prev: 'splide__arrow--prev slider__arrow-prev',
			next: 'splide__arrow--next slider__arrow-next',
		},
	}).mount();
	getImageHeight();
	window.addEventListener('resize', getImageHeight);

	function getImageHeight() {
		const images = slider.querySelectorAll('.works-slide__image');
		slider.style.cssText += `--image-height: ${Math.max(
			...Array.from(images).map((image) => image.offsetHeight)
		)}px`;
	}
});
