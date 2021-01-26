'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const getTemplate = (data = [], placeholder) => {
    const text = placeholder ?? 'Выберите что-то!';

    const items = data.map((item) => {
      return `
      <li class="select__item" data-type="item" data-id="${item.id}">${item.value}</li>
      `;
    });

    return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
      <span data-type="value">${text}</span>
      <i class="fas fa-chevron-down" data-type="arrow"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>`;
  };

  class Select {
    constructor(selector, options) {
      this.$el = document.querySelector(selector);
      this.options = options;

      this.selectedId = null;

      this.render();
      this.setup();
    }

    render() {
      const { placeholder, data } = this.options;
      this.$el.classList.add('select');
      this.$el.innerHTML = getTemplate(data, placeholder);
    }

    setup() {
      this.clickHandler = this.clickHandler.bind(this);
      this.$el.addEventListener('click', this.clickHandler);

      this.$arrow = this.$el.querySelector('[data-type="arrow"]');
      this.$value = this.$el.querySelector('[data-type="value"]');
    }

    clickHandler(e) {
      if (
        e.target.dataset.type === 'input' ||
        e.target.dataset.type === 'arrow' ||
        e.target.dataset.type === 'value'
      ) {
        this.toggle();
      } else if (e.target.dataset.type === 'item') {
        const id = e.target.dataset.id;
        this.select(id);
      } else if (e.target.dataset.type === 'backdrop') {
        this.close();
      }
    }

    get isOpen() {
      return this.$el.classList.contains('select-open');
    }

    get current() {
      return this.options.data.find((item) => item.id === this.selectedId);
    }

    select(id) {
      this.selectedId = id;
      this.$value.textContent = this.current.value;

      this.$el.querySelectorAll(`[data-type="item"]`).forEach((item) => {
        item.classList.remove('select__item-selected');
      });

      this.$el.querySelector(`[data-id="${id}"]`).classList.add('select__item-selected');

      this.options.onSelect ? this.options.onSelect(this.current) : null;

      this.close();
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.$el.classList.add('select-open');

      this.$arrow.classList.remove('fa-chevron-down');
      this.$arrow.classList.add('fa-chevron-up');
    }

    close() {
      this.$el.classList.remove('select-open');

      this.$arrow.classList.add('fa-chevron-down');
      this.$arrow.classList.remove('fa-chevron-up');
    }
  }

  const select = new Select('#select', {
    placeholder: 'Выберите,пожалуйста,элемент!',
    data: [
      { id: '1', value: 'React' },
      { id: '2', value: 'Angular' },
      { id: '3', value: 'Vue' },
      { id: '4', value: 'React Native' },
      { id: '5', value: 'Next' },
      { id: '6', value: 'Nest' },
    ],
    onSelect(item) {
      console.log(`Selected item: ${item.id}.${item.value}`);
    },
  });
});
