import { brandedId } from '@dahli/utils/src/random-id';
import type DropdownMenuElement from './index';
import useOutsideInteraction from '@dahli/utils/src/use-outside-interaction';
import { move, MoveIndex } from '@dahli/utils/src/dom';

export default class DropdownMenu {
  details: HTMLDetailsElement;
  summary: HTMLElement;
  menu: DropdownMenuElement;
  openedWithMouse = false;

  constructor(details: HTMLDetailsElement, summary: HTMLElement, menu: DropdownMenuElement) {
    this.details = details;
    this.summary = summary;
    this.menu = menu;

    if (!this.menu.hasAttribute('role')) this.menu.setAttribute('role', 'menu');
    if (!this.menu.id) this.menu.id = brandedId();
    this.menu.setAttribute('tabindex', '-1');

    if (!this.summary.hasAttribute('role')) this.summary.setAttribute('role', 'button');
    this.summary.setAttribute('aria-haspopup', 'menu');
    this.summary.setAttribute('aria-expanded', this.details.hasAttribute('open').toString());
    this.summary.setAttribute('aria-controls', this.menu.id);
    if (!this.summary.id) this.summary.id = brandedId();

    this.menu.setAttribute('aria-labelledby', this.summary.id);

    this.onToggle = this.onToggle.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.commitItem = this.commitItem.bind(this);

    this.details.addEventListener('toggle', this.onToggle);
    this.details.addEventListener('keydown', this.onKeydown);
    this.details.addEventListener('mousedown', this.onMousedown);
    this.details.addEventListener('click', this.commitItem);

    useOutsideInteraction(this.closeOnOutsideInteraction.bind(this));
  }

  destroy() {
    this.details.removeEventListener('toggle', this.onToggle);
    this.details.removeEventListener('keydown', this.onKeydown);
    this.details.removeEventListener('mousedown', this.onMousedown);
    this.details.removeEventListener('click', this.commitItem);
  }

  onToggle() {
    if (this.details.hasAttribute('open')) {
      this.summary.setAttribute('aria-expanded', 'true');

      if (this.openedWithMouse) {
        autofocus(this.details);
      }
    } else {
      this.summary.setAttribute('aria-expanded', 'false');
    }
  }

  onKeydown(event: KeyboardEvent) {
    this.openedWithMouse = false;

    const focused = document.activeElement;
    const isSummaryActive = event.target instanceof HTMLElement && event.target.tagName === 'SUMMARY';
    const isItemActive =
      focused instanceof HTMLElement && isMenuItem(focused) && focused.closest('details') === this.details;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (isSummaryActive && !this.details.hasAttribute('open')) {
          event.preventDefault();
          this.details.setAttribute('open', '');
          findFirstFocusableItem(this.details).focus();
        } else if (isItemActive) {
          event.preventDefault();
          event.stopPropagation();
          focused.click();
        }
        break;
      case 'Escape':
        {
          if (!this.details.hasAttribute('open')) break;
          event.preventDefault();
          event.stopPropagation();
          close(this.details);
        }
        break;
      case 'ArrowDown':
        {
          event.preventDefault();
          if (isSummaryActive && !this.details.hasAttribute('open')) {
            this.details.setAttribute('open', '');
            if (autofocus(this.details)) break;
          }

          const target = this.move(1);
          target?.focus();
        }
        break;
      case 'ArrowUp':
        {
          event.preventDefault();
          if (isSummaryActive && !this.details.hasAttribute('open')) {
            this.details.setAttribute('open', '');
            if (autofocus(this.details)) break;

            const items = focusableItems(this.details);
            const lastItem = items[items.length - 1];
            lastItem?.focus();
          } else {
            const target = this.move(-1);
            target?.focus();
          }
        }
        break;
      default:
        break;
    }
  }

  onMousedown() {
    this.openedWithMouse = true;
  }

  commitItem(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const item = target.closest<HTMLElement>('[role="menuitem"]');
    if (item) commit(item, this.details);
  }

  closeOnOutsideInteraction(event: Event) {
    if (!this.details.hasAttribute('open')) return;

    if (this.details.contains(event.target as HTMLElement)) return;
    close(this.details);
  }

  move(index: MoveIndex) {
    const items = focusableItems(this.details);
    const activeItem = document.activeElement;
    if (!(activeItem instanceof HTMLElement)) return;

    return move(items, activeItem, index);
  }
}

function commit(item: HTMLElement, details: HTMLDetailsElement) {
  if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;
  const menu = item.closest('dropdown-menu');
  if (!menu) return;

  close(details);
  menu.dispatchEvent(new CustomEvent('dropdown-menu:selected', { detail: { relatedTarget: item } }));
}

function autofocus(details: HTMLDetailsElement): boolean {
  if (!details.hasAttribute('open')) return false;
  const item = itemWithAutofocus(details);
  if (!(item instanceof HTMLElement)) return false;

  item.focus();
  return true;
}

function close(details: HTMLDetailsElement) {
  if (!details.hasAttribute('open')) return;
  details.removeAttribute('open');
  const summary = details.querySelector('summary');

  if (summary) {
    summary.setAttribute('aria-expanded', 'false');
    summary.focus();
  }
}

function findFirstFocusableItem(details: HTMLDetailsElement) {
  return itemWithAutofocus(details) || focusableItems(details)[0];
}

function focusableItems(details: HTMLDetailsElement) {
  return Array.from(
    details.querySelectorAll<HTMLElement>('[role="menuitem"]:not([hidden]):not([disabled]):not([aria-disabled="true"])')
  );
}

function itemWithAutofocus(details: HTMLDetailsElement) {
  return details.querySelector<HTMLElement>('dropdown-menu [autofocus]');
}

function isMenuItem(item: HTMLElement) {
  const role = item.getAttribute('role');
  return role === 'menuitem';
}
