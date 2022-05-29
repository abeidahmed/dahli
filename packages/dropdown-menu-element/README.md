# Dropdown Menu Element

A dropdown-menu built with the `<details>` tag.

## Installation

```bash
npm install @dahli/dropdown-menu-element
```

## Usage

```js
import @dahli/dropdown-menu-element
```

### Markup

```html
<details>
  <summary>Toggle menu</summary>
  <dropdown-menu>
    <a href="/blog" role="menuitem">Blog</a>
    <a href="/about" role="menuitem">About</a>
    <a href="/dashboard" role="menuitem">Dashboard</a>
  </dropdown-menu>
</details>
```

### Keeping the menu opened initially

If you want to keep the menu opened initially, then add `open` attribute to the `<details>`.

### With `autofocus` attribute

You can also change which `menuitem` gets focused initially when opening the menu, by:

```html
<details>
  <summary>Toggle menu</summary>
  <dropdown-menu>
    <a href="/blog" role="menuitem">Blog</a>
    <a href="/dashboard" role="menuitem" autofocus>Dashboard</a>
  </dropdown-menu>
</details>
```

## Events

`dropdown-menu:selected` event is fired from the `<dropdown-menu>` when a `menuitem` is selected. If you want to find
out which `menuitem` was selected, then:

```js
const menu = document.querySelector('dropdown-menu');
menu.addEventListener('dropdown-menu:selected', (event) => {
  const item = event.detail.relatedTarget;
  console.log(item);
});
```

## License
Distributed under the MIT license.
