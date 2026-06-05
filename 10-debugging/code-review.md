## Code Review Exercise

### Issue #1: JavaScript – Loading Spinner Breaks on Second Fetch

**The issue:** In `index.js`, the `finally` block hides the loading spinner using:

```js
loading.setAttribute("class", "display-none");
```

This **replaces** the element's entire `class` attribute, removing the `loading-container` class entirely. So the next time `fetchCatFacts()` is called (e.g., when the user clicks "Load New Cat Facts"), `document.querySelector('.loading-container')` returns `null` — the element can no longer be found. This causes a `TypeError` crash, and the button stops working after the first fetch.

**Why this is an issue:** `setAttribute('class', 'display-none')` overwrites all existing classes on the element. It replaces `loading-container` with `display-none`, so any future selector targeting `.loading-container` finds nothing. The correct approach is to _add_ or _remove_ a class without touching the others, using `classList`.

**Initial code (`index.js`):**

```js
// In the finally block:
const loading = document.querySelector(".loading-container");
loading.setAttribute("class", "display-none");
```

**Updated code (`index.js`):**

```js
// In createLoadingContainer — reset visibility each time:
const createLoadingContainer = function () {
  const loadingContainer = document.querySelector(".loading-container");
  loadingContainer.classList.remove("display-none"); // show the container again
  loadingContainer.replaceChildren(); // clear any old loader gif

  const loader = document.createElement("img");
  loader.src = "../../images/loader.gif";
  loader.alt = "loader gif while the data loads";
  loader.width = 60;
  loader.height = 60;
  loadingContainer.append(loader);
};

// In the finally block — use classList instead of setAttribute:
const loading = document.querySelector(".loading-container");
loading.classList.add("display-none");
```

---

### Issue #2: HTML Semantics – Form Buttons Are Outside the `<form>` Element

**The issue:** In `index.html`, the Submit and Reset buttons are placed in a separate `<div>` **after** the closing `</form>` tag:

```html
</form>   <!-- form ends here -->

<div class="form space-evenly-distributed-row-container form-buttons-container">
  <input class="form-button" type="submit" value="submit" />
  <input class="form-button" type="reset" value="reset" />
</div>
```

Because they are outside the form, clicking "submit" does not submit any form data, and clicking "reset" does not clear any of the form fields. The buttons appear to work visually but have no effect.

**Why this is an issue:** `<input type="submit">` and `<input type="reset">` only act on a form when they are _descendants_ of that form element (or associated via the `form` attribute). Placing them outside the `<form>` breaks their built-in behavior entirely, which is a functional bug that would prevent users from submitting their information.

**Initial code (`index.html`):**

```html
      <textarea
        class="form-textarea form-element-container"
        name="message"
        id="message"
        cols="30"
        rows="10"
      ></textarea>
    </form>
    <div
      class="form space-evenly-distributed-row-container form-buttons-container"
    >
      <input class="form-button" type="submit" value="submit" />
      <input class="form-button" type="reset" value="reset" />
    </div>
```

**Updated code (`index.html`):**

```html
      <textarea
        class="form-textarea form-element-container"
        name="message"
        id="message"
        cols="30"
        rows="10"
      ></textarea>
      <div
        class="form space-evenly-distributed-row-container form-buttons-container"
      >
        <input class="form-button" type="submit" value="submit" />
        <input class="form-button" type="reset" value="reset" />
      </div>
    </form>
```

---

### Issue #3: Accessibility – Close Popup Buttons Missing `aria-label`

**The issue:** Two of the three close popup buttons (in the Origin and Acceptance popup sections) contain only a Font Awesome icon with no visible text, no `aria-label`, and no `title` attribute. Screen readers announce these as "button" with no description, giving users no idea what the button does.

**Why this is an issue:** A button should always have an accessible name. When a button contains only a visual icon (no text), `aria-label` and `title` must be added so assistive technologies can describe its purpose. Only the Popularity popup's close button had these attributes — the other two did not.

**Initial code (`index.html`):**

```html
<button class="close-popup-button">
  <i class="fa-solid fa-xmark"></i>
</button>
```

**Updated code (`index.html`):**

```html
<button
  class="close-popup-button"
  aria-label="close popup window"
  title="close popup window"
>
  <i class="fa-solid fa-xmark"></i>
</button>
```

---

### Issue #4: Accessibility – `<span>` Used Instead of `<label>` for Form Inputs

**The issue:** The visible text labels for the Name, Username, Email, and Phone Number inputs are marked up as `<span class="form-label">` elements rather than proper `<label>` elements with a `for` attribute matching the input's `id`. Although `aria-label` attributes were added to the inputs as a workaround, the visible text on screen is not programmatically linked to its input field.

**Why this is an issue:** Using `<label for="id">` is the standard semantic HTML way to associate a label with a form control. It enables clicking the label to focus the input, and ensures screen readers announce the correct label when the input is focused. A `<span>` has no such semantic relationship. Visible labels should always be real `<label>` elements.

**Initial code (`index.html`):**

```html
<p class="label-input-group form-element-container">
  <span class="form-label">Name</span>
  <input
    aria-label="name"
    class="form-input-box"
    type="text"
    id="name"
    name="name"
  />
</p>
```

**Updated code (`index.html`):**

```html
<p class="label-input-group form-element-container">
  <label class="form-label" for="name">Name</label>
  <input
    class="form-input-box"
    type="text"
    id="name"
    name="name"
  />
</p>
```

---

### Issue #5: Semantics – No `<main>` Landmark Region

**The issue:** The page has a `<header>` and a `<footer>`, but all the primary content between them is wrapped only in generic `<div>` elements — there is no `<main>` landmark element.

**Why this is an issue:** Landmark elements (`<header>`, `<main>`, `<nav>`, `<footer>`) are essential for screen reader users to navigate a page efficiently. The `<main>` element marks the primary content of the document. Without it, keyboard and screen reader users cannot skip directly to the main content, which is a significant accessibility barrier.

**Initial code (`index.html`):**

```html
</header>

<div class="dark-background-container section-below-navbar">
  ...
</div>
...
<footer class="footer">...</footer>
```

**Updated code (`index.html`):**

```html
</header>

<main>
  <div class="dark-background-container section-below-navbar">
    ...
  </div>
  ...
</main>

<footer class="footer">...</footer>
```

---

### Issue #6: Semantics – Checkbox Group Missing `<fieldset>` and `<legend>`

**The issue:** The group of breed checkboxes ("What breeds would you like to learn?") uses a `<div>` and a `<p class="form-label">` as its container and group label. It is not wrapped in a `<fieldset>` with a `<legend>`.

**Why this is an issue:** When multiple related checkboxes share a common question or label, they should be grouped inside a `<fieldset>` element with a `<legend>` that describes the group. Without this, screen readers reading each checkbox in isolation have no context about what the group of choices refers to. This is standard semantic HTML for grouping related form controls.

**Initial code (`index.html`):**

```html
<div class="form-fieldset form-element-container">
  <p class="form-label">What breeds would you like to learn?</p>
  <div>
    <input type="checkbox" id="siamese" name="breed1" value="siamese" />
    <label for="siamese">Siamese Cat</label>
  </div>
  ...
</div>
```

**Updated code (`index.html`):**

```html
<fieldset class="form-fieldset form-element-container">
  <legend class="form-label">What breeds would you like to learn?</legend>
  <div>
    <input type="checkbox" id="siamese" name="breed1" value="siamese" />
    <label for="siamese">Siamese Cat</label>
  </div>
  ...
</fieldset>
```

---

### Issue #7: Semantics – `<a>` Tags Used as Buttons Without an `href`

**The issue:** The "More Info" cards and the "Load New Cat Facts" element are marked up as `<a>` (anchor) elements, but they have no `href` attribute. They function as interactive buttons triggered by JavaScript click listeners.

**Why this is an issue:** An `<a>` element without `href` is not a link — it is not keyboard focusable by default (Tab key skips it) and is not announced correctly by screen readers. Interactive elements that trigger actions (rather than navigate) should be `<button>` elements. Using `<a>` without `href` for clickable UI controls is both a semantic HTML error and an accessibility barrier.

**Initial code (`index.html`):**

```html
<a class="more-info-button">More Info</a>
...
<a class="reload-cat-facts">Load New Cat Facts</a>
```

**Updated code (`index.html`):**

```html
<button class="more-info-button">More Info</button>
...
<button class="reload-cat-facts">Load New Cat Facts</button>
```
