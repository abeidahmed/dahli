// import Combobox from './combobox';
import Autocomplete from './autocomplete';

export default class AutoCompleteElement extends HTMLElement {
  // input: HTMLInputElement | null = null;
  // list: HTMLElement | null = null;
  // combobox: Combobox | null = null;
  // isInteractingWithList = false;
  // listObserver: MutationObserver;

  autocomplete: Autocomplete | null = null;

  // constructor() {
  //   super();
  //   this.listObserver = new MutationObserver(this.onListToggle.bind(this));
  // }

  connectedCallback() {
    const input = this.querySelector('input');
    const id = this.getAttribute('for');
    if (!id) return;

    const list = document.getElementById(id);
    if (!(input instanceof HTMLElement) || !list) return;

    this.autocomplete = new Autocomplete(input, list);
    // this.list.hidden = true;
    // this.combobox = new Combobox(this.input, this.list);

    // this.input.setAttribute('spellcheck', 'false');
    // this.input.setAttribute('autocomplete', 'off');
    //
    // this.onFocus = this.onFocus.bind(this);
    // this.onBlur = this.onBlur.bind(this);
    // this.onKeydown = this.onKeydown.bind(this);
    // this.onListMouseDown = this.onListMouseDown.bind(this);
    // this.onCommit = this.onCommit.bind(this);
    // this.onInput = this.onInput.bind(this);
    //
    // this.input.addEventListener('focus', this.onFocus);
    // this.input.addEventListener('blur', this.onBlur);
    // this.input.addEventListener('keydown', this.onKeydown);
    // this.input.addEventListener('input', this.onInput);
    // this.list.addEventListener('mousedown', this.onListMouseDown);
    // this.list.addEventListener('combobox:commit', this.onCommit);
    //
    // this.listObserver.observe(this.list, { attributes: true, attributeFilter: ['hidden'] });
  }

  disconnectedCallback() {
    this.autocomplete?.destroy();
    //   this.input?.removeEventListener('focus', this.onFocus);
    //   this.input?.removeEventListener('blur', this.onBlur);
    //   this.input?.removeEventListener('keydown', this.onKeydown);
    //   this.input?.removeEventListener('input', this.onInput);
    //   this.list?.removeEventListener('mousedown', this.onListMouseDown);
    //   this.list?.removeEventListener('combobox:commit', this.onCommit);
    //
    //   this.listObserver.disconnect();
  }

  // onListToggle() {
  //   if (!this.list) return;
  //
  //   if (this.list.hidden) {
  //     this.combobox?.stop();
  //   } else {
  //     this.combobox?.start();
  //   }
  // }
  //
  // onFocus() {
  //   if (!this.list) return;
  //   if (!this.list.hidden) return;
  //
  //   this.list.hidden = false;
  //   this.combobox?.options.forEach(filterOptions('', { matching: 'data-autocomplete-value' }));
  //   activateFirstOption(this);
  // }
  //
  // onBlur() {
  //   if (this.isInteractingWithList) {
  //     this.isInteractingWithList = false;
  //     return;
  //   }
  //
  //   if (!this.list) return;
  //   if (this.list.hidden) return;
  //
  //   this.list.hidden = true;
  //   syncSelection(this);
  // }
  //
  // onKeydown(event: KeyboardEvent) {
  //   switch (event.key) {
  //     case 'Escape':
  //       if (!this.list) break;
  //
  //       if (!this.list.hidden) {
  //         this.list.hidden = true;
  //         syncSelection(this);
  //         event.preventDefault();
  //         event.stopPropagation();
  //       }
  //       break;
  //     case 'ArrowDown':
  //       if (!this.list) break;
  //
  //       if (event.altKey && this.list.hidden) {
  //         this.list.hidden = false;
  //         this.combobox?.options.forEach(filterOptions('', { matching: 'data-autocomplete-value' }));
  //         activateFirstOption(this);
  //         event.preventDefault();
  //         event.stopPropagation();
  //       }
  //       break;
  //     case 'ArrowUp':
  //       if (!this.list) break;
  //
  //       if (event.altKey && !this.list.hidden) {
  //         this.list.hidden = true;
  //         syncSelection(this);
  //         event.preventDefault();
  //         event.stopPropagation();
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }
  //
  // onInput() {
  //   if (!this.input) return;
  //   if (!this.combobox) return;
  //   if (!this.list) return;
  //
  //   if (this.list.hidden) {
  //     this.list.hidden = false;
  //     this.combobox.start();
  //   }
  //   const query = this.input.value.trim();
  //   this.combobox.options.forEach(filterOptions(query, { matching: 'data-autocomplete-value' }));
  //   this.combobox.setActive(this.combobox.visibleOptions[0]);
  // }
  //
  // onListMouseDown() {
  //   this.isInteractingWithList = true;
  // }
  //
  // onCommit(event: Event) {
  //   const option = event.target;
  //   if (!(option instanceof HTMLElement)) return;
  //
  //   const value = (option.getAttribute('data-autocomplete-value') || option.textContent) as string;
  //   if (this.input) this.input.value = value;
  //   if (this.list) this.list.hidden = true;
  //
  //   this.list?.dispatchEvent(new CustomEvent('auto-complete:selected', { detail: { relatedTarget: option } }));
  // }
}

// function activateFirstOption(autocomplete: AutoCompleteElement) {
//   const combobox = autocomplete.combobox;
//   if (!combobox) return;
//
//   const selectedOption = combobox.options.filter(selected)[0];
//   const firstOption = selectedOption || combobox.visibleOptions[0];
//   combobox.setActive(firstOption);
// }
//
// function filterOptions(query: string, { matching }: { matching: string }) {
//   return (target: HTMLElement) => {
//     if (query) {
//       const value = target.getAttribute(matching) || target.textContent;
//       const match = value?.toLowerCase().includes(query.toLowerCase());
//       target.hidden = !match;
//     } else {
//       target.hidden = false;
//     }
//   };
// }
//
// function syncSelection(autocomplete: AutoCompleteElement) {
//   const input = autocomplete.input;
//   if (!input) return;
//
//   const combobox = autocomplete.combobox;
//   if (!combobox) return;
//
//   const selectedOption = combobox.options.filter(selected)[0];
//   if (selectedOption) {
//     input.value = (selectedOption.getAttribute('data-autocomplete-value') || selectedOption.textContent) as string;
//   }
// }
//
// function selected(option: HTMLElement) {
//   return option.getAttribute('aria-selected') === 'true';
// }

declare global {
  interface Window {
    AutoCompleteElement: typeof AutoCompleteElement;
  }
  interface HTMLElementTagNameMap {
    'auto-complete': AutoCompleteElement;
  }
}

if (!window.customElements.get('auto-complete')) {
  window.AutoCompleteElement = AutoCompleteElement;
  window.customElements.define('auto-complete', AutoCompleteElement);
}
