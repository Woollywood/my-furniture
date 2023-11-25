document.addEventListener('DOMContentLoaded', (windowEvent) => {
	let phoneInputs = document.querySelectorAll('.tel');

	if (phoneInputs.length) {
		let maskOptions = {
			mask: '+7 000 000 00 00',
			lazy: true,
		};

		phoneInputs.forEach((input) => {
			let mask = new IMask(input, maskOptions);
		});
	}
});
