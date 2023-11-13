const mainSliderBackground = new Splide('#main-slider-background', {
	type: 'loop',
	speed: 800,
	perPage: 1,
	autoplay: true,
	interval: 3000,
	classes: {
		arrows: 'splide__arrows main-slider__controlls',
		arrow: 'splide__arrow main-slider__arrow',
		prev: 'splide__arrow--prev main-slider__arrow-prev',
		next: 'splide__arrow--next main-slider__arrow-next',
	},
});

const mainSliderForeground = new Splide('#main-slider-foreground', {
	type: 'fade',
	speed: 800,
	perPage: 1,
});

mainSliderForeground.mount();
mainSliderBackground.mount().sync(mainSliderForeground);
