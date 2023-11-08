const feedbackSlider = new Splide('#feedback-slider', {
	type: 'slide',
	perPage: 3,
	gap: 32,
	classes: {
		arrows: 'splide__arrows slider__controlls',
		arrow: 'splide__arrow slider__arrow',
		prev: 'splide__arrow--prev slider__arrow-prev',
		next: 'splide__arrow--next slider__arrow-next',
	},
	breakpoints: {
		559.98: {
			perPage: 1,
		},
		1099.98: {
			perPage: 2,
		},
	},
});

feedbackSlider.on('mounted', () => {
	const slider = document.querySelector('#feedback-slider')
	const arrowPrev = slider.querySelector('.slider__arrow-prev');
	const arrowNext = slider.querySelector('.slider__arrow-next');

	const arrowPrevReal = document.querySelector('.section-10__slider-controlls--real .slider__arrow-prev');
	const arrowNextReal = document.querySelector('.section-10__slider-controlls--real .slider__arrow-next');
	arrowPrevReal.addEventListener('click', e => arrowPrev.click())
	arrowNextReal.addEventListener('click', e => arrowNext.click())
})

feedbackSlider.mount();