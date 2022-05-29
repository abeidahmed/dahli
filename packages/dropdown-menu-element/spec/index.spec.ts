import { expect, fixture, html } from '@open-wc/testing';
import '../src';
import type DropdownMenuElement from '../src';

describe('DropdownMenuElement', () => {
  describe('attributes', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let summary: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      summary = el.querySelector('summary');
    });

    it('has default attributes', () => {
      expect(el).not.to.have.attribute('open');
      expect(menu).to.have.attribute('role', 'menu');
      expect(menu).to.have.attribute('tabindex', '-1');
      expect(menu).to.have.attribute('aria-labelledby', summary.id);

      expect(summary).to.have.attribute('role', 'button');
      expect(summary).to.have.attribute('aria-haspopup', 'menu');
      expect(summary).to.have.attribute('aria-expanded', 'false');
      expect(summary).to.have.attribute('aria-controls', menu.id);
    });
  });

  describe('opening the menu', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let summary: HTMLElement;
    let items: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      summary = el.querySelector('summary');
      items = menu.querySelectorAll('[role="menuitem"]');
    });

    it('opens and does not focus on the item on click', () => {
      summary.focus();
      summary.click();

      expect(el).to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);
    });

    it('opens and focuses on the first item on Enter key', () => {
      summary.focus();
      expect(document.activeElement).to.equal(summary);

      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);
      expect(el).to.have.attribute('open');
    });

    it('opens and focuses on the first item on Space key', () => {
      summary.focus();
      expect(document.activeElement).to.equal(summary);

      summary.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);
      expect(el).to.have.attribute('open');
    });

    it('opens and focuses on the first item on ArrowDown key', () => {
      summary.focus();
      expect(document.activeElement).to.equal(summary);

      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);
      expect(el).to.have.attribute('open');
    });

    it('opens and focuses on the first item on ArrowUp key', () => {
      summary.focus();
      expect(document.activeElement).to.equal(summary);

      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).to.equal(items[items.length - 1]);
      expect(el).to.have.attribute('open');
    });
  });

  describe('navigating through items', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let summary: HTMLElement;
    let items: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
            <button type="button" role="menuitem">Taxi</button>
            <button type="button" role="menuitem" aria-disabled="true">GGWP</button>
            <button type="button" role="menuitem" disabled>GGWP</button>
            <button type="button" role="menuitem">Another player</button>
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      summary = el.querySelector('summary');
      items = menu.querySelectorAll('[role="menuitem"]');
    });

    it('navigates through the items on ArrowDown', () => {
      el.open = true;
      summary.focus();

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).to.equal(items[1]);

      // Skips 2nd and 3rd item
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).to.equal(items[4]);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);
    });

    it('navigates through the items on ArrowUp', () => {
      el.open = true;
      summary.focus();

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).to.equal(items[4]);

      // Skips 2nd and 3rd item
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).to.equal(items[1]);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).to.equal(items[0]);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).to.equal(items[4]);
    });
  });

  describe('closing the menu', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let summary: HTMLElement;
    let items: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      summary = el.querySelector('summary');
      items = menu.querySelectorAll('[role="menuitem"]');
    });

    it('closes on interaction with the menuitem', () => {
      el.open = true;
      items[0].click();
      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);

      el.open = true;
      items[0].focus();
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);

      el.open = true;
      items[0].focus();
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);
    });

    it('closes when click outside', () => {
      el.open = true;
      document.body.dispatchEvent(new CustomEvent('pointerdown', { bubbles: true }));

      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);
    });

    it('closes when focused outside', () => {
      el.open = true;
      const button = document.createElement('button');
      document.body.append(button);

      button.focus();
      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);
    });

    it('closes on Escape key', () => {
      el.open = true;
      items[0].focus();
      expect(document.activeElement).to.equal(items[0]);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(el).not.to.have.attribute('open');
      expect(document.activeElement).to.equal(summary);
    });
  });

  describe('[autofocus] element', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let summary: HTMLElement;
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
            <input type="text" autofocus />
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      summary = el.querySelector('summary');
      input = menu.querySelector('input');
    });

    it('autofocuses on mouse click', () => {
      summary.click();
      summary.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      el.dispatchEvent(new CustomEvent('toggle'));

      expect(document.activeElement).to.equal(input);
    });

    it('autofocuses on Enter key', () => {
      summary.focus();
      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(document.activeElement).to.equal(input);
      expect(el).to.have.attribute('open');
    });

    it('autofocuses on Space key', () => {
      summary.focus();
      summary.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(document.activeElement).to.equal(input);
      expect(el).to.have.attribute('open');
    });

    it('autofocuses on ArrowDown key', () => {
      summary.focus();
      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(document.activeElement).to.equal(input);
      expect(el).to.have.attribute('open');
    });

    it('autofocuses on ArrowUp key', () => {
      summary.focus();
      summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(document.activeElement).to.equal(input);
      expect(el).to.have.attribute('open');
    });
  });

  describe('selecting an item', () => {
    let el: HTMLDetailsElement;
    let menu: DropdownMenuElement;
    let items: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <details>
          <summary>Details menu</summary>
          <dropdown-menu>
            <button type="button" role="menuitem">Player</button>
            <button type="button" role="menuitem" aria-disabled="true">Taxi</button>
          </dropdown-menu>
        </details>
      `);

      menu = el.querySelector('dropdown-menu');
      items = menu.querySelectorAll('[role="menuitem"]');
    });

    it('fires dropdown-menu:selected event', () => {
      let counter = 0;
      menu.addEventListener('dropdown-menu:selected', () => counter++);

      el.open = true;
      items[0].click();
      expect(counter).to.equal(1);

      el.open = true;
      items[0].focus();
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(counter).to.equal(2);

      el.open = true;
      items[0].focus();
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(counter).to.equal(3);
    });

    it('does not fire the event on disabled items', () => {
      let counter = 0;
      menu.addEventListener('dropdown-menu:selected', () => counter++);

      el.open = true;
      items[1].click();
      expect(counter).to.equal(0);

      el.open = true;
      items[1].focus();
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(counter).to.equal(0);

      el.open = true;
      items[1].focus();
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(counter).to.equal(0);
    });
  });
});
