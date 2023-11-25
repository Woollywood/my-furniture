document.addEventListener('DOMContentLoaded', (event) => {
	const fileInputs = document.querySelectorAll('.file-loader');
	fileInputs.forEach((fileInput) => {
		fileInput.addEventListener('change', (ev) => {
			uploadFile(fileInput, fileInput.files[0]);
		});
	});

	function uploadFile(input, file) {
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			console.log('Неверный тип загружаемого файла');
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			console.log('Размер загружаемого файла превышает допустимый');
			return;
		}

		const reader = new FileReader();

		reader.onload = function (e) {
			const popup = input.closest('.popup');
			if (popup.querySelector('.popup__files-wrapper')) {
				const imageListWrapper = popup.querySelector('.popup__files-wrapper');
				appendFile(e, imageListWrapper);
			} else {
				const fieldWrapper = input.closest('.popup__textarea-bottom');
				const imageListWrapper = document.createElement('div');
				imageListWrapper.classList.add('popup__files-wrapper');
				appendFile(e, imageListWrapper);
				fieldWrapper.after(imageListWrapper);
			}
		};

		reader.onerror = function (e) {
			console.log('Ошибка загрузки файла');
		};

		reader.readAsDataURL(file);
	}

	function appendFile(event, wrapper) {
		const file = document.createElement('div');
		file.classList.add('popup__file-image');
		file.innerHTML = `<img src="${event.target.result}" alt="Файл" />`;
		wrapper.append(file);
	}
});
