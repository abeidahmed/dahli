# Auto Complete Element

Single and multi auto-complete component.

## Installation

```bash
npm install @dahli/auto-complete-element
```

## Usage

```js
import '@dahli/auto-complete-element'
```

### Markup

```html
<auto-complete for="list">
  <input type="text">
  <ul id="list">
    <li role="option">Option 1</li>
    <li role="option">Option 2</li>
    <li role="option">Option 3</li>
  </ul>
</auto-complete>
```

The `data-autocomplete-value` can be used to customize the search term.

```html
<li role="option" data-autocomplete-value="another option">Option<li>
```

### Events
`auto-complete:selected` is fired after an option is selected. You can find which option was selected
by:

```js
const autocomplete = document.querySelector('auto-complete');

autocomplete.addEventListener('auto-complete:selected', (event) => {
  const option = event.detail.relatedTarget;
  console.log(option);
});
```

### Todo
- [ ] Support multi-select

## License
Distributed under the MIT license.
