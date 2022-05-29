import { brandedId } from '@dahli/utils/src/random-id';

const ctrlBindings = !!navigator.userAgent.match(/Macintosh/);

export default class Combobox {
  input: HTMLInputElement;
  list: HTMLElement;
  // Combobox does not use an actual hover/focus because it is not possible to focus input and options elements at the
  // same time. So for the options, it uses `data-tracking` to mimic mouse hover. But `data-tracking` is also activated
  // when ArrowDown and ArrowUp key is pressed. This distinction will help us know how the tracking is done.
  isMouseMoving = false;

  constructor(input: HTMLInputElement, list: HTMLElement) {
    this.input = input;
    this.list = list;

    if (!this.list.id) this.list.id = brandedId();

    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-haspopup', 'listbox');
    this.input.setAttribute('aria-controls', this.list.id);
    this.input.setAttribute('aria-autocomplete', 'list');
    this.list.setAttribute('role', 'listbox');

    this.onKeydown = this.onKeydown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onListMouseOver = this.onListMouseOver.bind(this);
    this.onListMouseMove = this.onListMouseMove.bind(this);
  }

  start() {
    this.isMouseMoving = false;
    this.input.setAttribute('aria-expanded', 'true');
    this.setInitialAttributesOnOptions();

    this.input.addEventListener('keydown', this.onKeydown);
    this.list.addEventListener('click', this.onClick);
    this.list.addEventListener('mouseover', this.onListMouseOver);
    this.list.addEventListener('mousemove', this.onListMouseMove);
  }

  stop() {
    this.isMouseMoving = false;
    this.clearActiveOption();
    this.input.setAttribute('aria-expanded', 'false');

    this.input.removeEventListener('keydown', this.onKeydown);
    this.list.removeEventListener('click', this.onClick);
    this.list.removeEventListener('mouseover', this.onListMouseOver);
    this.list.removeEventListener('mousemove', this.onListMouseMove);
  }

  onKeydown(event: KeyboardEvent) {
    this.isMouseMoving = false;

    if (event.shiftKey || event.metaKey || event.altKey) return;
    if (!ctrlBindings && event.ctrlKey) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (commit(this.list)) {
          event.preventDefault();
        }
        break;
      case 'Escape':
        this.clearActiveOption();
        break;
      case 'ArrowDown':
        this.move(1);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.move(-1);
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  onClick(event: Event) {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;

    const option = target.closest<HTMLElement>('[role="option"]');
    if (!(option instanceof HTMLElement)) return;
    if (!enabled(option)) return;

    this.selectOption(option);
    option.dispatchEvent(new CustomEvent('combobox:commit', { bubbles: true }));
  }

  onListMouseOver(event: Event) {
    if (!this.isMouseMoving) {
      event.preventDefault();
      return;
    }

    const option = getClosestOptionFrom(event.target as HTMLElement);
    if (!option) return;

    this.setActive(option);
  }

  onListMouseMove(event: Event) {
    if (this.isMouseMoving) return;

    this.isMouseMoving = true;
    const option = getClosestOptionFrom(event.target as HTMLElement);
    if (!option) return;

    this.setActive(option);
  }

  move(index: 1 | -1) {
    let focusIndex = this.visibleOptions.indexOf(this.activeOption);

    if (focusIndex === this.visibleOptions.length - 1 && index === 1) {
      focusIndex = -1;
    }

    let indexOfItem = index === 1 ? 0 : this.visibleOptions.length - 1;
    if (this.activeOption && focusIndex >= 0) {
      const newIndex = focusIndex + index;
      if (newIndex >= 0 && newIndex < this.visibleOptions.length) {
        indexOfItem = newIndex;
      }
    }

    this.setActive(this.visibleOptions[indexOfItem]);
  }

  selectOption(option: HTMLElement) {
    for (const el of this.options.filter(enabled)) {
      el.setAttribute('aria-selected', (el === option).toString());
    }
  }

  setActive(option: HTMLElement | undefined) {
    if (!option) {
      this.clearActiveOption();
      return;
    }

    // We want hidden options here because the end-user might toggle the `hidden` attribute to filter the options
    for (const el of this.options) {
      if (el === option) {
        this.input.setAttribute('aria-activedescendant', el.id);
        el.setAttribute('data-tracking', '');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.removeAttribute('data-tracking');
      }
    }
  }

  clearActiveOption() {
    this.input.removeAttribute('aria-activedescendant');
    for (const option of this.list.querySelectorAll<HTMLElement>('[data-tracking]')) {
      option.removeAttribute('data-tracking');
    }
  }

  setInitialAttributesOnOptions() {
    for (const option of this.options) {
      option.setAttribute('tabindex', '-1');
      if (enabled(option) && !option.hasAttribute('aria-selected')) {
        option.setAttribute('aria-selected', 'false');
      }

      if (!option.id) option.id = brandedId();
    }
  }

  get activeOption() {
    return Array.from(this.list.querySelectorAll<HTMLElement>('[data-tracking]'))[0];
  }

  get visibleOptions() {
    return this.options.filter(visible);
  }

  get options() {
    return Array.from(this.list.querySelectorAll<HTMLElement>('[role="option"]'));
  }
}

function commit(list: HTMLElement) {
  const activeOption = list.querySelector('[data-tracking]');
  if (!(activeOption instanceof HTMLElement)) return false;
  if (!enabled(activeOption)) return false;

  activeOption.click();
  return true;
}

function getClosestOptionFrom(target: HTMLElement) {
  if (!(target instanceof HTMLElement)) return false;

  const option = target.closest<HTMLElement>('[role="option"]');
  if (!(option instanceof HTMLElement)) return false;

  return option;
}

function visible(option: HTMLElement) {
  return (
    !option.hidden &&
    !(option instanceof HTMLInputElement && option.type === 'hidden') &&
    (option.offsetWidth > 0 || option.offsetHeight > 0)
  );
}

function enabled(option: HTMLElement) {
  return !option.hasAttribute('disabled') && option.getAttribute('aria-disabled') !== 'true';
}
