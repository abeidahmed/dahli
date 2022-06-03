import { expect, fixture, html } from '@open-wc/testing';
import '../src';
import '../src/tab-list-element';
import '../src/tab-panel-element';
import type TabGroupElement from '../src';
import type TabListElement from '../src/tab-list-element';
import type TabPanelElement from '../src/tab-panel-element';

describe('TabGroupElement', () => {
  let el: TabGroupElement;
  let tabList: TabListElement;
  let tabs: NodeListOf<HTMLButtonElement>;
  let panel: TabPanelElement;
  let tabPanels: NodeListOf<HTMLElement>;

  function assertTabSelection(activeTab: HTMLElement, activePanel: HTMLElement) {
    const restTabs = [...tabs].filter((tab) => tab !== activeTab);
    const restPanels = [...tabPanels].filter((panel) => panel !== activePanel);

    expect(activeTab).to.have.attribute('aria-selected', 'true');
    expect(activeTab).to.have.attribute('tabindex', '0');
    restTabs.forEach((tab) => {
      expect(tab).to.have.attribute('aria-selected', 'false');
      expect(tab).to.have.attribute('tabindex', '-1');
    });

    expect(activePanel).not.to.have.attribute('hidden');
    restPanels.forEach((panel) => {
      expect(panel).to.have.attribute('hidden');
    });
  }

  beforeEach(async () => {
    el = await fixture(html`
      <tab-group>
        <tab-list>
          <button type="button" role="tab" aria-controls="panel-1" aria-selected="true">Tab 1</button>
          <button type="button" role="tab" aria-controls="panel-2">Tab 2</button>
          <button type="button" role="tab" aria-controls="panel-3">Tab 3</button>
        </tab-list>

        <tab-panel>
          <div role="tabpanel" id="panel-1">Panel 1</div>
          <div role="tabpanel" id="panel-2" hidden>Panel 2</div>
          <div role="tabpanel" id="panel-3" hidden>Panel 3</div>
        </tab-panel>
      </tab-group>
    `);

    tabList = el.querySelector('tab-list');
    tabs = tabList.querySelectorAll('[role="tab"]');
    panel = el.querySelector('tab-panel');
    tabPanels = panel.querySelectorAll('[role="tabpanel"]');
  });

  it('has the default attributes', () => {
    expect(tabList).to.have.attribute('role', 'tablist');
    expect(tabs[0]).to.have.attribute('tabindex', '0');
    expect(tabs[1]).to.have.attribute('tabindex', '-1');
    expect(tabs[1]).to.have.attribute('aria-selected', 'false');
    expect(tabPanels[0]).to.have.attribute('tabindex', '0');
    expect(tabPanels[1]).to.have.attribute('tabindex', '0');
    expect(tabPanels[0]).to.have.attribute('aria-labelledby', tabs[0].id);
    expect(tabPanels[1]).to.have.attribute('aria-labelledby', tabs[1].id);
  });

  it('selects a tab with mouse click', () => {
    tabs[1].click();

    assertTabSelection(tabs[1], tabPanels[1]);
  });

  it('cycles through the tabs with ArrowRight key', () => {
    tabs[0].focus();

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[1]);
    assertTabSelection(tabs[1], tabPanels[1]);

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[2]);
    assertTabSelection(tabs[2], tabPanels[2]);

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[0]);
    assertTabSelection(tabs[0], tabPanels[0]);
  });

  it('cycles through the tabs with ArrowLeft key', () => {
    tabs[0].focus();

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[2]);
    assertTabSelection(tabs[2], tabPanels[2]);

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[1]);
    assertTabSelection(tabs[1], tabPanels[1]);

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[0]);
    assertTabSelection(tabs[0], tabPanels[0]);
  });

  it('activates the last tab with the End key', () => {
    tabs[0].focus();

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[tabs.length - 1]);
    assertTabSelection(tabs[tabs.length - 1], tabPanels[tabs.length - 1]);
  });

  it('activates the first tab with the End key', () => {
    tabs[2].click();

    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).to.equal(tabs[0]);
    assertTabSelection(tabs[0], tabPanels[0]);
  });

  it('fires tab-group:change event before tab change', () => {
    let activeTab: HTMLElement | null = null;
    el.addEventListener('tab-group:change', (event: CustomEvent) => {
      event.preventDefault();
      activeTab = event.detail.relatedTarget as HTMLElement;
    });

    tabs[2].click();
    expect(activeTab).to.equal(tabPanels[2]);
    // event is prevented
    expect(tabPanels[2]).to.have.attribute('hidden');
  });

  it('fires tab-group:changed event on tab change', () => {
    let activeTab: HTMLElement | null = null;
    el.addEventListener('tab-group:changed', (event: CustomEvent) => {
      activeTab = event.detail.relatedTarget as HTMLElement;
    });

    tabs[2].click();
    expect(activeTab).to.equal(tabPanels[2]);
  });
});
