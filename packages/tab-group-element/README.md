# Tab Group Element

An accessible tabs element.

## Installation

```bash
npm install @dahli/tab-group-element
```

## Usage

```js
import '@dahli/tab-group-element'
```

### Markup

```html
<tab-group>
  <tab-list>
    <button type="button" role="tab" aria-controls="panel-1" aria-selected="true">Tab 1</button>
    <button type="button" role="tab" aria-controls="panel-2">Tab 2</button>
  </tab-list>

  <tab-panel>
    <div id="panel-1" role="tabpanel">
      Panel 1
    </div>

    <div id="panel-2" role="tabpanel" hidden>
      Panel 2
    </div>
  </tab-panel>
</tab-group>
```

#### Nested tabs

```html
<tab-group>
  <tab-list>
    <button type="button" role="tab" aria-controls="panel-1" aria-selected="true">Tab 1</button>
    <button type="button" role="tab" aria-controls="panel-2">Tab 2</button>
  </tab-list>

  <tab-panel>
    <div id="panel-1" role="tabpanel">
      <tab-group>
        <tab-list>
          <button type="button" role="tab" aria-controls="nested-panel-1" aria-selected="true">Nested Tab 1</button>
          <button type="button" role="tab" aria-controls="nested-panel-2">Nested Tab 2</button>
        </tab-list>

        <tab-panel>
          <div id="nested-panel-1" role="tabpanel">
            Nested Panel 1
          </div>

          <div id="nested-panel-2" role="tabpanel" hidden>
            Nested Panel 2
          </div>
        </tab-panel>
      </tab-group>
    </div>

    <div id="panel-2" role="tabpanel" hidden>
      Panel 2
    </div>
  </tab-panel>
</tab-group>
```

### Attribute

- `data-active-panel-id` is added to the `<tab-group>` element.

### Events

- `tab-group:change` (bubbles, cancelable): is fired on the `<tab-group>` element with `event.detail.relatedTarget`
being the active tab panel that will be selected if the `event` isn't cancelled.

- `tab-group:changed` (bubbles): is fired on the `<tab-group>` element with `event.detail.relatedTarget` being the
active tab panel after selection.

## License
Distributed under the MIT license.
