const DURATION = 800;

const mainSlider = new Splide('#main-slider', {
	type: 'slide',
	speed: DURATION,
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

const mainSliderList = document.querySelector('.main-slider__list');
const mainSliderPeople = document.querySelector('.main-slider__people-bg');

const sliderMovingObserver = new MutationObserver((e) => {
	const style = mainSliderList.style.transform;
	const styleValue = Number.parseFloat(style.slice(style.indexOf('(') + 1, -1));
	mainSliderPeople.style.left = `calc(50% + ${-styleValue}px)`;
});

mainSlider.on('move', () => {
	mainSliderPeople.style.cssText = 'transition: left 0.3s linear;';
});

mainSlider.on('moved', () => {
	mainSliderPeople.style.cssText = '';
});

sliderMovingObserver.observe(mainSliderList, {
	childList: true,
	attributes: true,
	attributeFilter: ['style'],
});

mainSlider.mount();
