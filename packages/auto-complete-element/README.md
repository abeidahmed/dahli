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

#### Multiple selections

You can set the `multiple` attribute on the `<auto-complete>` to allow selections on multiple options.

```html
<auto-complete for="list" multiple>
  <input type="text">
  <ul id="list">
    <li role="option">Option 1</li>
    <li role="option">Option 2</li>
    <li role="option">Option 3</li>
  </ul>
</auto-complete>
```

### Filtering options

The default filtering logic is substring.

The `data-autocomplete-value` can be used to customize the search term.

```html
<li role="option" data-autocomplete-value="Battlestar">Option<li>
```

#### Blankslate

`data-empty` attribute is added to the list container when search results is empty. You can use CSS to show/hide
the blankslate like this:

```html
<auto-complete for="list">
  <input type="text">
  <ul id="list" class="container">
    <li role="option">Option 1</li>
    <li class="blankslate">No results found!</li>
  </ul>
</auto-complete>
```

```css
.blankslate {
  display: none;
}

.container[data-empty] .blankslate {
  display: block;
}
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

## License
Distributed under the MIT license.
