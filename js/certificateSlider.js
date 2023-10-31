const certificateSlider = new Splide('#certificate-slider', {
	type: 'slide',
	perPage: 4,
	gap: 32,
	breakpoints: {
		479.98: {
			perPage: 1,
		},
		559.98: {
			perPage: 2,
		},
		991.98: {
			perPage: 3,
			gap: 16,
		},
	},
});

certificateSlider.mount();