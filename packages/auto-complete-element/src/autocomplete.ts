import type AutoCompleteElement from './index';
import Combobox from './combobox';
import useOutsideInteraction from '@dahli/utils/src/use-outside-interaction';
import { debounce } from '@dahli/utils/src/delay';
import { nextTick } from '@dahli/utils/src/timing';

const AUTOCOMPLETE_VALUE_ATTR = 'data-autocomplete-value';
const DATA_EMPTY_ATTR = 'data-empty';

export default class Autocomplete {
  element: AutoCompleteElement;
  input: HTMLInputElement;
  list: HTMLElement;
  isMultiple: boolean;
  combobox: Combobox;
  listObserver: MutationObserver;

  constructor(element: AutoCompleteElement, input: HTMLInputElement, list: HTMLElement) {
    this.element = element;
    this.input = input;
    this.list = list;

    this.list.hidden = true;
    this.isMultiple = this.element.hasAttribute('multiple');
    this.combobox = new Combobox(this.input, this.list, { isMultiple: this.isMultiple });

    this.input.setAttribute('spellcheck', 'false');
    this.input.setAttribute('autocomplete', 'off');

    this.onFocus = this.onFocus.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onInput = debounce(this.onInput.bind(this), 300);

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
      this.list.removeAttribute(DATA_EMPTY_ATTR);
      syncSelection(this);
    } else {
      this.combobox.start();
    }
  }

  onFocus() {
    if (!this.list.hidden) return;

    this.list.hidden = false;
    this.combobox.options.forEach(filterOptions('', { matching: AUTOCOMPLETE_VALUE_ATTR }));
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
          this.combobox.options.forEach(filterOptions('', { matching: AUTOCOMPLETE_VALUE_ATTR }));
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
    this.combobox.options.forEach(filterOptions(query, { matching: AUTOCOMPLETE_VALUE_ATTR }));
    this.combobox.setActive(this.combobox.visibleOptions[0]);
    this.list.toggleAttribute(DATA_EMPTY_ATTR, this.combobox.visibleOptions.length === 0);
  }

  onCommit(event: Event) {
    const option = event.target;
    if (!(option instanceof HTMLElement)) return;

    const value = (option.getAttribute(AUTOCOMPLETE_VALUE_ATTR) || option.textContent) as string;
    if (!this.isMultiple) {
      this.inputValue = value;
      this.list.hidden = true;
    }

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
    if (this.list.contains(event.target as HTMLElement)) return;

    this.list.hidden = true;
  }

  set inputValue(value: string) {
    this.input.value = value;
    this.input.dispatchEvent(new Event('change'));
  }
}

async function activateFirstOption(autocomplete: Autocomplete) {
  const { combobox } = autocomplete;
  const selectedOption = combobox.options.filter(selected)[0];
  const firstOption = selectedOption || combobox.visibleOptions[0];
  await nextTick(); // `aria-activedescendant` on input field isn't always set, so we need to wait for the next tick
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
  const { combobox, isMultiple } = autocomplete;
  const selectedOption = combobox.options.filter(selected)[0];

  if (isMultiple || !selectedOption) {
    autocomplete.inputValue = '';
  } else {
    autocomplete.inputValue = (selectedOption.getAttribute(AUTOCOMPLETE_VALUE_ATTR) ||
      selectedOption.textContent) as string;
  }
}

function selected(option: HTMLElement) {
  return option.getAttribute('aria-selected') === 'true';
}
