const stockSlider = new Splide('#stock-slider', {
	type: 'slide',
	perPage: 3,
	gap: 32,
	breakpoints: {
		767.98: {
			perPage: 1,
			gap: 20,
		},
		1240: {
			gap: 16,
		},
	},
});

stockSlider.mount();