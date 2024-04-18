# explicit

Turn title attributes into tooltips to make them accessible on hover and focus.

## Usage

### CDN

You can setup explicit in the blink of an eye by using a CDN like unpkg:

```html
<link rel="stylesheet" href="https://unpkg.com/@empreinte-digitale/explicit@latest/dist/explicit.css" />
<script src="https://unpkg.com/@empreinte-digitale/explicit@latest/dist/explicit.js"></script>
```

By default, explicit will run on `<body />` and all of its descendents.
If you need to set it up on another element, mark it with this attribute:

```html
<div data-explicit-container>
  <!-- some elements with title attributes -->
</div>
```

You can also configure a duration after which a tooltip will close when losing focus.
This delay allows the user to jump from an element to its tooltip if there is some space between them.

```html
<div data-explicit-container data-explicit-delay="500">
  <!-- some elements with title attributes -->
</div>
```

You may want to avoid showing tooltips on specific elements.
This can be done with the `data-explicit-ignore` attribute:

```html
<a href="…" title="…" data-explicit-ignore></a>
```

Note that this can also be used to discard all elements inside a tag:

```html
<a href="…" title="Tooltip will be shown"></a>
<div data-explicit-ignore>
  <a href="…" title="Tooltip will not be shown"></a>
</div>
```

### NPM

Just install the module and use it from your code:

```sh
npm i @empreinte-digitale/explicit
```

```js
import {setup} from '@empreinte-digitale/explicit';

setup({
  // options
});
```

See [here for available options](https://github.com/empreinte-digitale/explicit/blob/main/src/setup.ts#L3)
and [here for defaults](https://github.com/empreinte-digitale/explicit/blob/main/src/setup.ts#L13).

`setup()` returns two functions for you to control tooltips programmatically:

```js
const {show, hide} = setup();

// shows a tooltip on the given element
show(document.querySelector('[title]'))

// hides any open tooltip
hide();
```
