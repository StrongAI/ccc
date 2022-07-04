
import { LitElement, html } from '/node_modules/lit-element/lit-element.js';
import { render } from '/node_modules/lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

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
