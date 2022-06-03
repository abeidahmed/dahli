import { brandedId } from '@dahli/utils/src/random-id';
import { ACTIVE_PANEL_ID_ATTR } from './constants';
import { move, MoveIndex } from '@dahli/utils/src/dom';

export default class TabListElement extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'tablist');

    // Force at least one active tab
    if (this.tabs.filter(active).length === 0) {
      this.tabs[0].setAttribute('aria-selected', 'true');
    }

    for (const tab of this.tabs) {
      if (!tab.id) tab.id = brandedId();
      const panelId = getPanelIdFromTab(tab);
      if (panelId) {
        const panel = document.getElementById(panelId);
        panel?.setAttribute('aria-labelledby', tab.id);
      }

      if (active(tab)) {
        tab.setAttribute('tabindex', '0');
        this.tabGroup?.setAttribute(ACTIVE_PANEL_ID_ATTR, panelId || '');
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    }

    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeydown);
  }

  onClick(event: Event) {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;

    const tab = target.closest('[role="tab"]');
    if (!(tab instanceof HTMLElement)) return;

    this.selectTab(tab);
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        {
          event.preventDefault();
          const tab = this.move(1);
          if (tab) this.selectTab(tab);
        }
        break;
      case 'ArrowLeft':
        {
          event.preventDefault();
          const tab = this.move(-1);
          if (tab) this.selectTab(tab);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.selectTab(this.tabs[0]);
        break;
      case 'End':
        event.preventDefault();
        this.selectTab(this.tabs[this.tabs.length - 1]);
        break;
      default:
        break;
    }
  }

  move(index: MoveIndex) {
    if (!this.activeTab) return;

    return move(this.tabs, this.activeTab, index);
  }

  selectTab(activeTab: HTMLElement) {
    if (!this.tabGroup) return;

    for (const tab of this.tabs) {
      if (tab === activeTab) {
        const controlledPanelId = getPanelIdFromTab(tab);
        if (!controlledPanelId) return;

        const panel = document.getElementById(controlledPanelId);
        const changeEvent = this.tabGroup.dispatchEvent(
          new CustomEvent('tab-group:change', { detail: { relatedTarget: panel }, bubbles: true, cancelable: true })
        );

        if (!changeEvent) return;

        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        tab.focus();
        this.tabGroup.setAttribute(ACTIVE_PANEL_ID_ATTR, controlledPanelId || '');
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    }
  }

  get tabs() {
    return Array.from(this.querySelectorAll<HTMLElement>('[role="tab"]')).filter(selectable);
  }

  get activeTab() {
    return this.tabs.find(active);
  }

  get tabGroup() {
    return this.closest('tab-group');
  }
}

function active(tab: HTMLElement) {
  return tab.getAttribute('aria-selected') === 'true';
}

function selectable(tab: HTMLElement) {
  return !tab.hidden && !tab.hasAttribute('disabled');
}

function getPanelIdFromTab(tab: HTMLElement) {
  return tab.getAttribute('aria-controls');
}

declare global {
  interface Window {
    TabListElement: typeof TabListElement;
  }
  interface HTMLElementTagNameMap {
    'tab-list': TabListElement;
  }
}

if (!window.customElements.get('tab-list')) {
  window.TabListElement = TabListElement;
  window.customElements.define('tab-list', TabListElement);
}
