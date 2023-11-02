const flsModules = {};

function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message);
		}
	}, 0);
}

let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach((formRequiredItem) => {
				if (
					(formRequiredItem.offsetParent !== null || formRequiredItem.tagName === 'SELECT') &&
					!formRequiredItem.disabled
				) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === 'email') {
			formRequiredItem.value = formRequiredItem.value.replace(' ', '');
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.type === 'checkbox' && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		formRequiredItem.parentElement.classList.add('_form-error');
		let inputError = formRequiredItem.parentElement.querySelector('.form__error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML(
				'beforeend',
				`<div class="form__error">${formRequiredItem.dataset.error}</div>`
			);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		if (formRequiredItem.parentElement.querySelector('.form__error')) {
			formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
		}
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (flsModules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						flsModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	},
};

let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие
			document.dispatchEvent(
				new CustomEvent('slideUpDone', {
					detail: {
						target: target,
					},
				})
			);
		}, duration);
	}
};

let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие
			document.dispatchEvent(
				new CustomEvent('slideDownDone', {
					detail: {
						target: target,
					},
				})
			);
		}, duration);
	}
};

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};

class SelectConstructor {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
			speed: 150,
		};
		this.config = Object.assign(defaultConfig, props);
		// CSS класи модуля
		this.selectClasses = {
			classSelect: 'select', // Главный блок
			classSelectBody: 'select__body', // Тело селекта
			classSelectTitle: 'select__title', // Заголовок
			classSelectValue: 'select__value', // Значение в заголовке
			classSelectLabel: 'select__label', // Лэйбел
			classSelectInput: 'select__input', // Поле ввода
			classSelectText: 'select__text', // Оболочка текстовых данных
			classSelectLink: 'select__link', // Ссылка в элементе
			classSelectOptions: 'select__options', // Выпадающий список
			classSelectOptionsScroll: 'select__scroll', // Оболочка при скроле
			classSelectOption: 'select__option', // Пункт
			classSelectContent: 'select__content', // Оболочка контента в заголовке
			classSelectIcon: 'select__icon', // Иконка
			classSelectRow: 'select__row', // Ряд
			classSelectData: 'select__asset', // Дополнительные данные
			classSelectDisabled: '_select-disabled', // Запрещено
			classSelectTag: '_select-tag', // Класс тега
			classSelectOpen: '_select-open', // Список открыт
			classSelectActive: '_select-active', // Список выбран
			classSelectFocus: '_select-focus', // Список в фокусе
			classSelectMultiple: '_select-multiple', // Мультипл
			classSelectCheckBox: '_select-checkbox', // Стиль чекбоксу
			classSelectOptionSelected: '_select-selected', // Выбранный пункт
			classSelectPseudoLabel: '_select-pseudo-label', // Псевдолейбл
		};
		this._this = this;
		// Запуск инициализации
		if (this.config.init) {
			// Получение всех select на странице
			const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
			if (selectItems.length) {
				this.selectsInit(selectItems);
				this.setLogging(`Проснулся, построил селекты: (${selectItems.length})`);
			} else {
				this.setLogging('Сплю, не вижу ни одного селекта');
			}
		}
	}
	// Конструктор CSS класса
	getSelectClass(className) {
		return `.${className}`;
	}
	// Геттер элементов псевдоселлекта
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector('select'),
			selectElement: selectItem.querySelector(this.getSelectClass(className)),
		};
	}
	// Функция инициализации всех селлектов
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			this.selectInit(originalSelect, index + 1);
		});
		// Обработчики событий...
		// ...при клике
		document.addEventListener(
			'click',
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при нажатии клавиши
		document.addEventListener(
			'keydown',
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при фокусе
		document.addEventListener(
			'focusin',
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при потере фокуса
		document.addEventListener(
			'focusout',
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
	}
	// Функция инициализации конкретного селекта
	selectInit(originalSelect, index) {
		const _this = this;
		// Создаем оболочку
		let selectItem = document.createElement('div');
		selectItem.classList.add(this.selectClasses.classSelect);
		// Выводим оболочку перед оригинальным селектом
		originalSelect.parentNode.insertBefore(selectItem, originalSelect);
		// Помещаем оригинальный селект в оболочку
		selectItem.appendChild(originalSelect);
		// Скрываем оригинальный селект
		originalSelect.hidden = true;
		// Присваиваем уникальный ID
		index ? (originalSelect.dataset.id = index) : null;

		// Работа с плейсхолдером
		if (this.getSelectPlaceholder(originalSelect)) {
			// Запоминаем плейсхолдер
			originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
			// Если включен режим label
			if (this.getSelectPlaceholder(originalSelect).label.show) {
				const selectItemTitle = this.getSelectElement(
					selectItem,
					this.selectClasses.classSelectTitle
				).selectElement;
				selectItemTitle.insertAdjacentHTML(
					'afterbegin',
					`<span class="${this.selectClasses.classSelectLabel}">${
						this.getSelectPlaceholder(originalSelect).label.text
							? this.getSelectPlaceholder(originalSelect).label.text
							: this.getSelectPlaceholder(originalSelect).value
					}</span>`
				);
			}
		}
		// Конструктор основных элементов
		selectItem.insertAdjacentHTML(
			'beforeend',
			`<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`
		);
		// Запускаем конструктор псевдоселлекта
		this.selectBuild(originalSelect);

		// Запоминаем скорость
		originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
		this.config.speed = +originalSelect.dataset.speed;

		// Событие при смене оригинального select
		originalSelect.addEventListener('change', function (e) {
			_this.selectChange(e);
		});
	}
	// Конструктор псевдоселекту
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		// Добавляем ID селектора
		selectItem.dataset.id = originalSelect.dataset.id;
		// Получаем класс оригинального селлекта, создаем модификатор и добавляем его.
		originalSelect.dataset.classModif
			? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`)
			: null;
		// Если множественный выбор, добавляем класс
		originalSelect.multiple
			? selectItem.classList.add(this.selectClasses.classSelectMultiple)
			: selectItem.classList.remove(this.selectClasses.classSelectMultiple);
		// Cтилизация элементов под checkbox (только для multiple)
		originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple
			? selectItem.classList.add(this.selectClasses.classSelectCheckBox)
			: selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
		// Сеттер значение заголовка селлекта
		this.setSelectTitleValue(selectItem, originalSelect);
		// Сеттер списков (options)
		this.setOptions(selectItem, originalSelect);
		// Если включена опция поиска data-search, запускаем обработчик
		originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
		// Если указана настройка data-open, открываем селект
		originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;
		// Обработчик disabled
		this.selectDisabled(selectItem, originalSelect);
	}
	// Функция реакций на события
	selectsActions(e) {
		const targetElement = e.target;
		const targetType = e.type;
		if (
			targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) ||
			targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))
		) {
			const selectItem = targetElement.closest('.select')
				? targetElement.closest('.select')
				: document.querySelector(
						`.${this.selectClasses.classSelect}[data-id="${
							targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset
								.selectId
						}"]`
				  );
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			if (targetType === 'click') {
				if (!originalSelect.disabled) {
					if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
						// Обработка клика по тегу
						const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
						const optionItem = document.querySelector(
							`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`
						);
						this.optionAction(selectItem, originalSelect, optionItem);
					} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
						// Обработка клика на заглавие селекта
						this.selectAction(selectItem);
					} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
						// Обработка клика на элемент селектора
						const optionItem = targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectOption)
						);
						this.optionAction(selectItem, originalSelect, optionItem);
					}
				}
			} else if (targetType === 'focusin' || targetType === 'focusout') {
				if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
					targetType === 'focusin'
						? selectItem.classList.add(this.selectClasses.classSelectFocus)
						: selectItem.classList.remove(this.selectClasses.classSelectFocus);
				}
			} else if (targetType === 'keydown' && e.code === 'Escape') {
				this.selectsСlose();
			}
		} else {
			this.selectsСlose();
		}
	}
	// Функция закрытия всех селекторов
	selectsСlose(selectOneGroup) {
		const selectsGroup = selectOneGroup ? selectOneGroup : document;
		const selectActiveItems = selectsGroup.querySelectorAll(
			`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(
				this.selectClasses.classSelectOpen
			)}`
		);
		if (selectActiveItems.length) {
			selectActiveItems.forEach((selectActiveItem) => {
				this.selectСlose(selectActiveItem);
			});
		}
	}
	// Функция закрытия конкретного селекта
	selectСlose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		if (!selectOptions.classList.contains('_slide')) {
			selectItem.classList.remove(this.selectClasses.classSelectOpen);
			_slideUp(selectOptions, originalSelect.dataset.speed);
			setTimeout(() => {
				selectItem.style.zIndex = '';
			}, originalSelect.dataset.speed);
		}
	}
	// Функция открытия/закрытия конкретного селекта
	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

		// Определяем, где отобразить выпадающий список
		this.setOptionsPosition(selectItem);

		// Если селективы размещены в элементе с атрибутом дата data-one-select
		// закрываем все открытые селекты
		if (originalSelect.closest('[data-one-select]')) {
			const selectOneGroup = originalSelect.closest('[data-one-select]');
			this.selectsСlose(selectOneGroup);
		}

		setTimeout(() => {
			if (!selectOptions.classList.contains('_slide')) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				_slideToggle(selectOptions, originalSelect.dataset.speed);

				if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
					selectItem.style.zIndex = selectOpenzIndex;
				} else {
					setTimeout(() => {
						selectItem.style.zIndex = '';
					}, originalSelect.dataset.speed);
				}
			}
		}, 0);
	}
	// Сеттер значение заголовка селлекта
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
		const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML('afterbegin', this.getSelectTitleValue(selectItem, originalSelect));
		originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
	}
	// Конструктор значение заголовка
	getSelectTitleValue(selectItem, originalSelect) {
		// Получаем выбранные текстовые значения
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		// Обработка значений мультивыбора
		// Если режим тегов включен (указана настройка data-tags)
		if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect)
				.elements.map(
					(option) =>
						`<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${
							option.value
						}" class="_select-tag">${this.getSelectElementContent(option)}</span>`
				)
				.join('');
			// Если вывод тегов во внешний блок
			if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
				document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
			}
		}
		// Значение или плейсхолдер
		selectTitleValue = selectTitleValue.length
			? selectTitleValue
			: originalSelect.dataset.placeholder
			? originalSelect.dataset.placeholder
			: '';
		// Если включен режим pseudo
		let pseudoAttribute = '';
		let pseudoAttributeClass = '';
		if (originalSelect.hasAttribute('data-pseudo-label')) {
			pseudoAttribute = originalSelect.dataset.pseudoLabel
				? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"`
				: ` data-pseudo-label="Заповніть атрибут"`;
			pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
		}
		// Если есть значение, добавляем класс
		this.getSelectedOptionsData(originalSelect).values.length
			? selectItem.classList.add(this.selectClasses.classSelectActive)
			: selectItem.classList.remove(this.selectClasses.classSelectActive);
		// Возвращаем поле ввода для поиска или текст
		if (originalSelect.hasAttribute('data-search')) {
			// Выводим поле ввода для поиска
			return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
		} else {
			// Если выбран элемент со своим классом
			const customClass =
				this.getSelectedOptionsData(originalSelect).elements.length &&
				this.getSelectedOptionsData(originalSelect).elements[0].dataset.class
					? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}`
					: '';
			// Выводим текстовое значение
			return `
				<button type="button" class="${this.selectClasses.classSelectTitle}">
					<span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}">
						<span class="${this.selectClasses.classSelectContent}${customClass}">
							${selectTitleValue}
						</span>
						<span class="${this.selectClasses.classSelectIcon}">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="6" viewBox="0 0 14 6" fill="none">
								<path d="M13 1L6.99999 5L1 1"/>
							</svg>
						</span>
					</span>
				</button>`;
		}
	}
	// Конструктор данных для значения заголовка
	getSelectElementContent(selectOption) {
		// Если для элемента указан вывод картинки или текста, перестраиваем конструкцию
		const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
		const selectOptionDataHTML =
			selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		return selectOptionContentHTML;
	}
	// Получение данных плейсхолдера
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find((option) => !option.value);
		if (selectPlaceholder) {
			return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute('data-show'),
				label: {
					show: selectPlaceholder.hasAttribute('data-label'),
					text: selectPlaceholder.dataset.label,
				},
			};
		}
	}
	// Получение данных из выбранных элементов
	getSelectedOptionsData(originalSelect, type) {
		//Получаем все выбранные объекты из select
		let selectedOptions = [];
		if (originalSelect.multiple) {
			// Если мультивыбор
			// Забираем плейсхолдер, получаем остальные избранные элементы
			selectedOptions = Array.from(originalSelect.options)
				.filter((option) => option.value)
				.filter((option) => option.selected);
		} else {
			// Если единичный выбор
			selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
		}
		return {
			elements: selectedOptions.map((option) => option),
			values: selectedOptions.filter((option) => option.value).map((option) => option.value),
			html: selectedOptions.map((option) => this.getSelectElementContent(option)),
		};
	}
	// Конструктор элементов списка
	getOptions(originalSelect) {
		// Настройка скролла элементов
		let selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
		// Получаем элементы списка
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			// Если указана настройка data-show, показываем плейсхолдер в списке
			if (
				(this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) ||
				originalSelect.multiple
			) {
				selectOptions = selectOptions.filter((option) => option.value);
			}
			// Строим и выводим основную конструкцию
			selectOptionsHTML += `<div ${selectOptionsScroll} class="${this.selectClasses.classSelectOptionsScroll}">`;
			selectOptions.forEach((selectOption) => {
				// Получаем конструкцию конкретного элемента списка
				selectOptionsHTML += this.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
	}
	// Конструктор конкретного элемента списка
	getOption(selectOption, originalSelect) {
		// Если элемент выбран и включен режим мультивыбора, добавляем класс
		const selectOptionSelected =
			selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : '';
		// Если элемент выбран и нет настройки data-show-selected, скрываем элемент
		const selectOptionHide =
			selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple
				? `hidden`
				: ``;
		// Если для элемента указанный класс добавляем
		const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
		// Если указан режим ссылки
		const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
		const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';
		// Строим и возвращаем конструкцию элемента
		let selectOptionHTML = ``;
		selectOptionHTML += selectOptionLink
			? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">`
			: `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}
	// Сеттер списков (options)
	setOptions(selectItem, originalSelect) {
		// Получаем объект тела псевдоселлекта
		const selectItemOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		// Запускаем конструктор элементов списка (options) и добавляем в тело псевдоселектора
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}
	// Определяем, где отобразить выпадающий список
	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectItemScroll = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptionsScroll
		).selectElement;
		const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
		const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin
			? +originalSelect.dataset.optionsMargin
			: 10;

		if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight
				? selectItemScroll.offsetHeight
				: parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
			const selectOptionsHeight =
				selectOptions.offsetHeight > selectItemScrollHeight
					? selectOptions.offsetHeight
					: selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;

			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
			const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add('select_show-top');
					selectItemScroll.style.maxHeight =
						selectItemPos < selectOptionsHeight
							? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px`
							: customMaxHeightValue;
				} else {
					selectItem.classList.remove('select_show-top');
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else {
			setTimeout(() => {
				selectItem.classList.remove('select_show-top');
				selectItemScroll.style.maxHeight = customMaxHeightValue;
			}, +originalSelect.dataset.speed);
		}
	}
	// Обработчик клика на пункт списка
	optionAction(selectItem, originalSelect, optionItem) {
		const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
		if (!selectOptions.classList.contains('_slide')) {
			if (originalSelect.multiple) {
				// Если мультивыбор
				// Выделяем классом элемент
				optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
				// Очищаем выбранные элементы
				const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
				originalSelectSelectedItems.forEach((originalSelectSelectedItem) => {
					originalSelectSelectedItem.removeAttribute('selected');
				});
				// Выбираем элементы
				const selectSelectedItems = selectItem.querySelectorAll(
					this.getSelectClass(this.selectClasses.classSelectOptionSelected)
				);
				selectSelectedItems.forEach((selectSelectedItems) => {
					originalSelect
						.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`)
						.setAttribute('selected', 'selected');
				});
			} else {
				// Если единичный выбор
				// Если не указана настройка data-show-selected, скрываем выбранный элемент
				if (!originalSelect.hasAttribute('data-show-selected')) {
					setTimeout(() => {
						// Сначала все показать
						if (
							selectItem.querySelector(
								`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`
							)
						) {
							selectItem.querySelector(
								`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`
							).hidden = false;
						}
						// Скрываем избранное
						optionItem.hidden = true;
					}, this.config.speed);
				}
				originalSelect.value = optionItem.hasAttribute('data-value')
					? optionItem.dataset.value
					: optionItem.textContent;
				this.selectAction(selectItem);
			}
			//Обновляем заголовок селекта
			this.setSelectTitleValue(selectItem, originalSelect);
			// Вызываем реакцию на смену селлекта
			this.setSelectChange(originalSelect);
		}
	}
	// Реакция на изменение оригинального select
	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}
	// Обработчик смены в селекторе
	setSelectChange(originalSelect) {
		// Мгновенная валидация селлекта
		if (originalSelect.hasAttribute('data-validate')) {
			formValidate.validateInput(originalSelect);
		}
		// При смене селлекта присылаем форму
		if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
			let tempButton = document.createElement('button');
			tempButton.type = 'submit';
			originalSelect.closest('form').append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		// Вызов коллбек функции
		this.selectCallback(selectItem, originalSelect);
	}
	// Обработчик disabled
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
		}
	}
	// Обработчик поиска по элементам списка
	searchActions(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
		const _this = this;
		selectInput.addEventListener('input', function () {
			selectOptionsItems.forEach((selectOptionsItem) => {
				if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
					selectOptionsItem.hidden = false;
				} else {
					selectOptionsItem.hidden = true;
				}
			});
			// Если список закрыт открываем
			selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
		});
	}
	// Коллбек функция
	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(
			new CustomEvent('selectCallback', {
				detail: {
					select: originalSelect,
				},
			})
		);
	}
	// Логинг в консоль
	setLogging(message) {
		this.config.logging ? FLS(`[select]: ${message} `) : null;
	}
}

// Запускаем и добавляем в объект модулей
flsModules.select = new SelectConstructor({});

class DynamicAdapt {
	constructor(type) {
		this.type = type;
	}
	init() {
		// массив объектов
		this.оbjects = [];
		this.daClassname = '_dynamic_adapt_';
		// массив DOM-элементов
		this.nodes = [...document.querySelectorAll('[data-da]')];

		// наполнение объектами
		this.nodes.forEach((node) => {
			const data = node.dataset.da.trim();
			const dataArray = data.split(',');
			const оbject = {};
			оbject.element = node;
			оbject.parent = node.parentNode;
			оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
			оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
			оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.оbjects.push(оbject);
		});

		this.arraySort(this.оbjects);

		// массив уникальных медиа-запросов
		this.mediaQueries = this.оbjects
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index);

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(',');
			const matchMedia = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
			matchMedia.addEventListener('change', () => {
				this.mediaHandler(matchMedia, оbjectsFilter);
			});
			this.mediaHandler(matchMedia, оbjectsFilter);
		});
	}
	// Основная функция
	mediaHandler(matchMedia, оbjects) {
		if (matchMedia.matches) {
			оbjects.forEach((оbject) => {
				// оbject.index = this.indexInParent(оbject.parent, оbject.element);
				this.moveTo(оbject.place, оbject.element, оbject.destination);
			});
		} else {
			оbjects.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index);
				}
			});
		}
	}
	// Функция перемещения
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === 'last' || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === 'first') {
			destination.prepend(element);
			return;
		}
		destination.children[place].before(element);
	}
	// Функция возврата
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element);
		} else {
			parent.append(element);
		}
	}
	// Функция получения индекса внутри родительского элемента
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}
	// Функция сортировки массива по breakpoint и place
	// за зростанням для this.type = min
	// за спаданням для this.type = max
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1;
					}
					return 0;
				}
				return a.breakpoint - b.breakpoint;
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1;
					}
					return 0;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
}
const da = new DynamicAdapt('max');
da.init();

const accordions = document.querySelectorAll('[data-accordion-container]');
const OPEN_DURATION = 600;
accordions.forEach((accordion) => {
	new Accordion(accordion, {
		duration: OPEN_DURATION,
		showMultiple: true,
		onlyChildNodes: false,
		elementClass: 'accordion',
		triggerClass: 'accordion__trigger',
		panelClass: 'accordion__panel',
		activeClass: 'open',
	});
});

let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
};
let bodyUnlock = (delay = 500) => {
	let body = document.querySelector('body');
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll('[data-lp]');
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove('lock');
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};
let bodyLock = (delay = 500) => {
	let body = document.querySelector('body');
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll('[data-lp]');
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add('lock');

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа-запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(',')[0];
		}
	});
	// Инициализация объектов с медиа-запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach((item) => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(',');
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach((breakpoint) => {
				const paramsArray = breakpoint.split(',');
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с необходимыми условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia,
				});
			});
			return mdQueriesArray;
		}
	}
}

function getHash() {
	if (location.hash) {
		return location.hash.replace('#', '');
	}
}

function menuOpen() {
	bodyLock();
	document.documentElement.classList.add('menu-open');
}

function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove('menu-open');
}

function menuInit() {
	if (document.querySelector('[data-menu-button]')) {
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('[data-menu-button]')) {
				window.innerWidth <= 559.98 ? bodyLockToggle() : null;
				document.documentElement.classList.toggle('menu-open');
			}
		});
	}
}

function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener('click', setTabsAction);
			initTabs(tabsBlock);
		});

		// Получение слойлеров с медиа-запросами
		let mdQueriesArray = dataMediaQueries(tabs, 'tabs');
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener('change', function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
	}
	// Установка позиций заголовков
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
			tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(
				(item) => item.closest('[data-tabs]') === tabsMediaItem
			);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('_tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('_tab-spoller');
				}
			});
		});
	}
	// Работа с контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter((item) => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			tabsContent = Array.from(tabsContent).filter((item) => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]');
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
				tabActiveTitle.length
					? (tabActiveTitle = Array.from(tabActiveTitle).filter(
							(item) => item.closest('[data-tabs]') === tabsBlock
					  ))
					: null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}

tabs();
menuInit();

let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = '';
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = 'header.header';
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains('_header-scroll')) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add('_header-scroll');
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove('_header-scroll');
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else {
				headerItemHeight = headerElement.offsetHeight;
			}
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: 'easeOutQuad',
		};
		// Закрываем меню, если оно открыто
		document.documentElement.classList.contains('menu-open') ? menuClose() : null;

		if (typeof SmoothScroll !== 'undefined') {
			// Прокрутка с использованием дополнения
			new SmoothScroll().animateScroll(targetBlockElement, '', options);
		} else {
			// Прокрутка стандартными средствами
			let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
			targetBlockElementPosition = headerItemHeight
				? targetBlockElementPosition - headerItemHeight
				: targetBlockElementPosition;
			targetBlockElementPosition = offsetTop
				? targetBlockElementPosition - offsetTop
				: targetBlockElementPosition;
			window.scrollTo({
				top: targetBlockElementPosition,
				behavior: 'smooth',
			});
		}
		FLS(`[gotoBlock]: Юху...Едем до ${targetBlock}`);
	} else {
		FLS(`[gotoBlock]: Ой... Нет такого блока на странице: ${targetBlock}`);
	}
};

function pageNavigation() {
	// data-goto – указать ID блока
	// data-goto-header -учитывать header
	// data-goto-top – недокрутить на указанный размер
	// data-goto-speed – скорость (только если используется дополнительный плагин)
	// Работаем при нажатии на пункт
	document.addEventListener('click', pageNavigationAction);
	// Если подключен scrollWatcher, то подсвечиваем текущий пункт меню
	document.addEventListener('watcherCallback', pageNavigationAction);
	// Основная функция
	function pageNavigationAction(e) {
		if (e.type === 'click') {
			const targetElement = e.target;
			if (targetElement.closest('[data-goto]')) {
				const gotoLink = targetElement.closest('[data-goto]');
				const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
				const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
				const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
				const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
				if (flsModules.fullpage) {
					const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest('[data-fp-section]');
					const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
					if (fullpageSectionId !== null) {
						flsModules.fullpage.switchingSection(fullpageSectionId);
						document.documentElement.classList.contains('menu-open') ? menuClose() : null;
					}
				} else {
					gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				}
				e.preventDefault();
			}
		} else if (e.type === 'watcherCallback' && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			// Обработка пунктов навигации, если указано значение navigator, подсвечиваем текущий пункт меню
			if (targetElement.dataset.watch === 'navigator') {
				const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
					navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
				} else if (targetElement.classList.length) {
					for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
				}
				if (entry.isIntersecting) {
					// Видим объект
					// navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
					navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
				} else {
					// Не видим объект
					navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
				}
			}
		}
	}
	// Прокрутка по хэшу
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) {
			goToHash = `#${getHash()}`;
		} else if (document.querySelector(`.${getHash()}`)) {
			goToHash = `.${getHash()}`;
		}
		goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
	}
}

pageNavigation();

const menuButton = document.querySelector('.menu__button');
menuButton?.addEventListener('click', (e) => {
	menuButton.classList.toggle('open');
	menuButton.parentNode.classList.toggle('open');
});

const menuCloseBtn = document.querySelector('.menu__close');
menuCloseBtn?.addEventListener('click', (e) => {
	document.querySelector('.header__menu').classList.remove('open');
	menuButton.classList.remove('open');
});

getHeaderHeight();
window.addEventListener('resize', getHeaderHeight);

function getHeaderHeight() {
	const header = document.querySelector('.header');
	document.documentElement.style.cssText += `--header-height: ${header.offsetHeight}px`;
}

function gsapAnimationInit() {
	mainBlock();
	section2();
	section3();
	section5();
	section6();
	section7();
	section8();
	section9();
	section10();
	section12();
	section13();

	function mainBlock() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const people = document.querySelector('.main-slider__people-bg');
			const subTitleList = document.querySelectorAll('.main-slider__slide-subtitle');
			const titleList = document.querySelectorAll('.main-slider__slide-title');

			const timeline = gsap.timeline();

			timeline
				.from(people, {
					yPercent: 20,
					duration: 0.6,
					ease: 'power4.out',
				})
				.from([subTitleList, titleList], {
					y: -400,
					duration: 0.8,
					opacity: 0,
					ease: 'power4.out',
				});
		});
	}

	function section2() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const content = document.querySelector('.section-2__content');
			gsap.from(content, {
				x: 160,
				opacity: 0,
				scrollTrigger: {
					trigger: content,
					start: 'top 60%',
				},
			});
		});
	}

	function section3() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const slider = document.querySelector('.section-3__slider');
			const slides = document.querySelectorAll('.section-3__slide');
			gsap.from(slides, {
				opacity: 0,
				x: -260,
				stagger: 0.1,
				scrollTrigger: {
					trigger: slider,
					start: 'top 60%',
				},
			});
		});
	}

	function section5() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const content = document.querySelector('.section-5__content');
			gsap.from(content, {
				x: -160,
				opacity: 0,
				scrollTrigger: {
					trigger: content,
					start: 'top 60%',
				},
			});
		});
	}

	function section6() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const card = document.querySelector('.section-6__inner-form');
			gsap.from(card, {
				y: 260,
				opacity: 0,
				scrollTrigger: {
					trigger: card,
					start: 'top 60%',
				},
			});
		});
	}

	function section7() {
		const mm = gsap.matchMedia();
		const section = document.querySelector('.section-7');
		const textWrapper = section.querySelector('.section-7__text-wrapper');
		const icons = section.querySelectorAll('.section-7__item-icon');
		mm.add('(min-width: 767.98px)', () => {
			gsap.set(icons, {
				opacity: 0,
			});

			gsap.from(textWrapper, {
				x: -160,
				opacity: 0,
				scrollTrigger: {
					trigger: section,
					start: 'top 60%',
				},

				onComplete: () => {
					gsap.fromTo(
						icons,
						{
							stagger: 0.1,
							opacity: 0,
							scale: 2.2,
							webkitFilter: 'blur(2px)',
						},
						{
							stagger: 0.1,
							opacity: 1,
							scale: 1,
							webkitFilter: 'blur(0px)',
						}
					);
				},
			});
		});
		mm.add('(max-width: 767.98px)', () => {
			gsap.set(icons, {
				opacity: 1,
				scale: 1,
				webkitFilter: 'blur(0px)',
			});
		});
	}

	function section8() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const slider = document.querySelector('.section-8__slider');
			const slides = slider.querySelectorAll('.section-8__slide');
			gsap.from(slides, {
				opacity: 0,
				y: 160,
				stagger: 0.1,
				scrollTrigger: {
					trigger: slider,
					start: 'top 60%',
				},
			});
		});
	}

	function section9() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const sectionContent = document.querySelector('.section-9__content');
			const image = document.querySelector('.works-slide__image');

			ScrollTrigger.create({
				trigger: sectionContent,
				start: 'top 60%',
				animation: gsap.fromTo(
					image,
					{
						opacity: 0,
						scale: 2.2,
						webkitFilter: 'blur(2px)',
						duration: 0.4,
						ease: 'power4.out',
					},
					{
						opacity: 1,
						scale: 1,
						webkitFilter: 'blur(0px)',
					}
				),
			});
		});
	}

	function section10() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const slider = document.querySelector('.section-10__slider');
			const slides = slider.querySelectorAll('.section-10__slide');
			gsap.from(slides, {
				opacity: 0,
				y: 160,
				scrollTrigger: {
					trigger: slider,
					start: 'top 60%',
				},
			});
		});
	}

	function section12() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const slider = document.querySelector('.section-12__slider');
			const slides = slider.querySelectorAll('.section-12__slide');
			gsap.from(slides, {
				opacity: 0,
				x: 260,
				stagger: 0.1,
				scrollTrigger: {
					trigger: slider,
					start: 'top 60%',
				},
			});
		});
	}

	function section13() {
		const mm = gsap.matchMedia();
		mm.add('(min-width: 767.98px)', () => {
			const content = document.querySelector('.section-13__left');
			gsap.from(content, {
				opacity: 0,
				x: -160,
				scrollTrigger: {
					trigger: content,
					start: 'top 60%',
				},
			});
		});
	}
}

tabsNavigationHeightObserver();
window.addEventListener('resize', tabsNavigationHeightObserver);

function tabsNavigationHeightObserver() {
	const nav = document.querySelector('[data-height-observe]');
	const form = document.querySelector('[data-tabs-form]');
	const height = nav.offsetHeight;
	form.style.cssText = `--navigation-height: ${height}px`;
}
