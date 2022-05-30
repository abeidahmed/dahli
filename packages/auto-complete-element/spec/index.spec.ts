import { expect, fixture, html } from '@open-wc/testing';
import '../src';
import type AutoCompleteElement from '../src';

describe('AutoCompleteElement', () => {
  describe('default behavior and attributes', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list">
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option" data-autocomplete-value="Orange">Taxi</li>
            <li role="option" hidden>Uno</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
      options = list.querySelectorAll('[role="option"]');
    });

    it('sets the default attributes', () => {
      expect(input).to.have.attribute('spellcheck', 'false');
      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('opens the menu on focus', () => {
      expect(list).to.have.attribute('hidden');
      input.focus();

      expect(list).not.to.have.attribute('hidden');
    });

    it('resets the options on focus', () => {
      input.focus();

      options.forEach((option) => {
        expect(option).not.to.have.attribute('hidden');
      });
    });

    it('closes the menu on outside interaction', () => {
      input.focus();
      expect(list).not.to.have.attribute('hidden');

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      expect(list).to.have.attribute('hidden');
    });
  });

  describe('with no previous aria-selected option', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list">
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option">Taxi</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
      options = list.querySelectorAll('[role="option"]');
    });

    it('activates the first option', () => {
      input.focus();

      expect(options[0]).to.have.attribute('data-tracking');
    });
  });

  describe('with previous aria-selected option', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list">
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option" aria-selected="true">Taxi</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
      options = list.querySelectorAll('[role="option"]');
    });

    it('activates the selected option', () => {
      input.focus();

      expect(options[1]).to.have.attribute('data-tracking');
    });
  });

  describe('keyboard interactions', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list">
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option">Taxi</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
    });

    it('closes the menu on Escape key', () => {
      input.focus();
      expect(list).not.to.have.attribute('hidden');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(list).to.have.attribute('hidden');
    });

    it('closes the menu on alt+ArrowUp', () => {
      input.focus();
      expect(list).not.to.have.attribute('hidden');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true, bubbles: true }));
      expect(list).to.have.attribute('hidden');
    });

    it('opens the menu on alt+ArrowDown', () => {
      expect(list).to.have.attribute('hidden');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }));

      expect(list).not.to.have.attribute('hidden');
    });
  });

  describe('selecting an option', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list">
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option" data-autocomplete-value="Orange">Taxi</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
      options = list.querySelectorAll('[role="option"]');
    });

    it('sets the input value to the textContent', () => {
      input.focus();

      options[0].dispatchEvent(new CustomEvent('combobox:commit', { bubbles: true }));
      expect(input.value).to.equal(options[0].textContent);
      expect(list).to.have.attribute('hidden');
    });

    it('sets the input value to the data-autocomplete-value', () => {
      input.focus();

      options[1].dispatchEvent(new CustomEvent('combobox:commit', { bubbles: true }));
      expect(input.value).to.equal(options[1].getAttribute('data-autocomplete-value'));
      expect(list).to.have.attribute('hidden');
    });

    it('dispatches an event with option as the related target', () => {
      let relatedTarget: HTMLElement | null = null;
      document.addEventListener('auto-complete:selected', (event: CustomEvent) => {
        relatedTarget = event.detail.relatedTarget;
      });

      input.focus();
      options[1].dispatchEvent(new CustomEvent('combobox:commit', { bubbles: true }));
      expect(relatedTarget).to.equal(options[1]);
    });
  });

  describe('multiple selections', () => {
    let el: AutoCompleteElement;
    let input: HTMLInputElement;
    let list: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`
        <auto-complete for="list" multiple>
          <input type="text" />
          <ul id="list">
            <li role="option">Player</li>
            <li role="option" data-autocomplete-value="Orange">Taxi</li>
          </ul>
        </auto-complete>
      `);

      input = el.querySelector('input');
      list = el.querySelector('ul');
      options = list.querySelectorAll('[role="option"]');
    });

    it('does not close the list and does not update the input value', () => {
      input.focus();

      options[0].dispatchEvent(new CustomEvent('combobox:commit', { bubbles: true }));
      expect(input.value).to.equal(''); // does not update the input value
      expect(list).not.to.have.attribute('hidden'); // does not hide the input
    });
  });
});
