import type AutoCompleteElement from './index';
import Combobox from './combobox';

export default class Autocomplete {
  element: AutoCompleteElement;
  input: HTMLInputElement;
  list: HTMLElement;
  combobox: Combobox;
  listObserver: MutationObserver;

  constructor(element: AutoCompleteElement, input: HTMLInputElement, list: HTMLElement) {
    this.element = element;
    this.input = input;
    this.list = list;

    this.list.hidden = true;
    this.combobox = new Combobox(this.input, this.list);

    this.input.setAttribute('spellcheck', 'false');
    this.input.setAttribute('autocomplete', 'off');

    this.onFocus = this.onFocus.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onInput = this.onInput.bind(this);

    this.input.addEventListener('focus', this.onFocus);
    this.input.addEventListener('keydown', this.onKeydown);
    this.input.addEventListener('input', this.onInput);
    this.list.addEventListener('combobox:commit', this.onCommit);

    this.listObserver = new MutationObserver(this.onListToggle.bind(this));
    this.listObserver.observe(this.list, { attributes: true, attributeFilter: ['hidden'] });
    useOutsideInteraction(this.closeOnOutsideInteraction.bind(this));
  }

  destroy() {
    this.input.removeEventListener('focus', this.onFocus);
    this.input.removeEventListener('keydown', this.onKeydown);
    this.input.removeEventListener('input', this.onInput);
    this.list.removeEventListener('combobox:commit', this.onCommit);

    this.listObserver.disconnect();
  }

  onListToggle() {
    if (this.list.hidden) {
      this.combobox.stop();
      syncSelection(this);
    } else {
      this.combobox.start();
    }
  }

  onFocus() {
    if (!this.list.hidden) return;

    this.list.hidden = false;
    this.combobox.options.forEach(filterOptions('', { matching: 'data-autocomplete-value' }));
    activateFirstOption(this);
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        if (!this.list.hidden) {
          this.list.hidden = true;
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 'ArrowDown':
        if (event.altKey && this.list.hidden) {
          this.list.hidden = false;
          this.combobox.options.forEach(filterOptions('', { matching: 'data-autocomplete-value' }));
          activateFirstOption(this);
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 'ArrowUp':
        if (event.altKey && !this.list.hidden) {
          this.list.hidden = true;
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      default:
        break;
    }
  }

  onInput() {
    if (this.list.hidden) {
      this.list.hidden = false;
    }

    const query = this.input.value.trim();
    this.combobox.options.forEach(filterOptions(query, { matching: 'data-autocomplete-value' }));
    this.combobox.setActive(this.combobox.visibleOptions[0]);
  }

  onCommit(event: Event) {
    const option = event.target;
    if (!(option instanceof HTMLElement)) return;

    const value = (option.getAttribute('data-autocomplete-value') || option.textContent) as string;
    this.input.value = value;
    this.list.hidden = true;

    this.list.dispatchEvent(
      new CustomEvent('auto-complete:selected', {
        detail: { relatedTarget: option },
        bubbles: true,
      })
    );
  }

  closeOnOutsideInteraction(event: Event) {
    if (this.list.hidden) return;
    if (this.element.contains(event.target as HTMLElement)) return;

    this.list.hidden = true;
  }
}

function activateFirstOption(autocomplete: Autocomplete) {
  const { combobox } = autocomplete;
  const selectedOption = combobox.options.filter(selected)[0];
  const firstOption = selectedOption || combobox.visibleOptions[0];
  combobox.setActive(firstOption);
}

function filterOptions(query: string, { matching }: { matching: string }) {
  return (target: HTMLElement) => {
    if (query) {
      const value = target.getAttribute(matching) || target.textContent;
      const match = value?.toLowerCase().includes(query.toLowerCase());
      target.hidden = !match;
    } else {
      target.hidden = false;
    }
  };
}

function syncSelection(autocomplete: Autocomplete) {
  const { combobox, input } = autocomplete;
  const selectedOption = combobox.options.filter(selected)[0];
  if (selectedOption) {
    input.value = (selectedOption.getAttribute('data-autocomplete-value') || selectedOption.textContent) as string;
  }
}

function selected(option: HTMLElement) {
  return option.getAttribute('aria-selected') === 'true';
}

function useOutsideInteraction(callback: (event: Event) => void, options = false) {
  document.addEventListener('pointerdown', callback, options);
  window.addEventListener('focusin', callback, options);

  return () => {
    document.removeEventListener('pointerdown', callback, options);
    window.removeEventListener('focusin', callback, options);
  };
}
