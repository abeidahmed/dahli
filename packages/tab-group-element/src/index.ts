import { ACTIVE_PANEL_ID_ATTR } from './constants';

export default class TabGroupElement extends HTMLElement {
  static get observedAttributes() {
    return [ACTIVE_PANEL_ID_ATTR];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === ACTIVE_PANEL_ID_ATTR) {
      this.selectPanel(newValue);
    }
  }

  selectPanel(panelId: string) {
    for (const panel of this.panels) {
      if (panel.id === panelId) {
        panel.hidden = false;
        this.dispatchEvent(new CustomEvent('tab-group:changed', { detail: { relatedTarget: panel }, bubbles: true }));
      } else {
        panel.hidden = true;
      }
    }
  }

  get panels() {
    return Array.from(this.querySelectorAll<HTMLElement>('[role="tabpanel"]')).filter(
      // Keep nested tab group state as it is
      (panel) => panel.closest('tab-group') === this
    );
  }
}

declare global {
  interface Window {
    TabGroupElement: typeof TabGroupElement;
  }
  interface HTMLElementTagNameMap {
    'tab-group': TabGroupElement;
  }
}

if (!window.customElements.get('tab-group')) {
  window.TabGroupElement = TabGroupElement;
  window.customElements.define('tab-group', TabGroupElement);
}
