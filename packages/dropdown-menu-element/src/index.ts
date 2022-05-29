import DropdownMenu from './dropdown-menu';

export default class DropdownMenuElement extends HTMLElement {
  dropdownMenu: DropdownMenu | null = null;

  connectedCallback() {
    const details = this.closest('details');
    if (!details) return;

    const summary = details.querySelector('summary');
    if (!summary) return;

    this.dropdownMenu = new DropdownMenu(details, summary, this);
  }

  disconnectedCallback() {
    this.dropdownMenu?.destroy();
  }
}

declare global {
  interface Window {
    DropdownMenuElement: typeof DropdownMenuElement;
  }
  interface HTMLElementTagNameMap {
    'dropdown-menu': DropdownMenuElement;
  }
}

if (!window.customElements.get('dropdown-menu')) {
  window.DropdownMenuElement = DropdownMenuElement;
  window.customElements.define('dropdown-menu', DropdownMenuElement);
}
