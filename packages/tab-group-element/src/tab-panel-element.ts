export default class TabPanelElement extends HTMLElement {
  connectedCallback() {
    for (const panel of Array.from(this.querySelectorAll('[role="tabpanel"]'))) {
      panel.setAttribute('tabindex', '0');
    }
  }
}

declare global {
  interface Window {
    TabPanelElement: typeof TabPanelElement;
  }
  interface HTMLElementTagNameMap {
    'tab-panel': TabPanelElement;
  }
}

if (!window.customElements.get('tab-panel')) {
  window.TabPanelElement = TabPanelElement;
  window.customElements.define('tab-panel', TabPanelElement);
}
