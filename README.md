Ember Mock Store
==============================================================================

Provides helper to emulate the store for client side testing.

This is useful for testing components that make use of EmberData, without altering other data

Installation
------------------------------------------------------------------------------

```
ember install ember-mock-store
```


Usage
------------------------------------------------------------------------------

From your test:

```javascript
import MockStore from './tests/helpers/mock-store';

moduleForComponent('Component', {
    beforeEach() {

        // Stub the actual Ember Store, with the fake Store
        this.set('store', MockStore.create());

    }
});
```
Ember Data can now be used normally


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-mock-store`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
