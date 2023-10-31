const schemeSlider = new Splide('#scheme-slider', {
	type: 'slide',
	perPage: 4,
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
		1023: {
			perPage: 2,
		},
		1439.98: {
			perPage: 3,
			gap: 16,
		},
	},
});

schemeSlider.mount();