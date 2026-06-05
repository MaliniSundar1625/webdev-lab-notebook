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
