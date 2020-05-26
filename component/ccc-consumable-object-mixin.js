
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from './ccc-element.js';

let CCCConsumableObjectMixin = Mixin( (superclass) => class extends superclass {

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /*******************
  *  Event Handlers  *
  *******************/

  wasAssigned( event ) {

  }

}

export { CCCElement,
         LitElement, html, render,
         Mixin, mix }
