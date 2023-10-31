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

feedbackSlider.mount();