const feedbacksSlider = new Splide('#rate-popup-slider', {
	type: 'slide',
	perPage: 5,
	gap: 24,
	classes: {
		arrows: 'splide__arrows slider__controlls',
		arrow: 'splide__arrow slider__arrow',
		prev: 'splide__arrow--prev slider__arrow-prev',
		next: 'splide__arrow--next slider__arrow-next',
	},
	breakpoints: {
		767.98: {
			perPage: 4,
			gap: 4,
		},
		1440: {
			gap: 16,
		},
	},
});

feedbacksSlider.on('mounted', () => {
	feedbacksSlider.Components.Slides.forEach((slideObject) => {
		const slide = slideObject.slide;
		slide.setAttribute('data-slide-index', slideObject.index);
		slide.addEventListener('click', (e) => gallerySlider.Components.Controller.go(slideObject.index));
	});

	if (!feedbacksSlider.Components.Slides.isEnough()) {
		for (const arrow of Object.values(feedbacksSlider.Components.Arrows.arrows)) {
			arrow.style.display = 'none';
		}
	}
});

feedbacksSlider.mount();
