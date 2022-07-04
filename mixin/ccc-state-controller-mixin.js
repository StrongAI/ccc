
import { LitElement, html } from '/node_modules/lit-element/lit-element.js';
import { render } from '/node_modules/lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCStateControllerMixin = Mixin( (superclass) => class extends mix(superclass) {

  /*
      StateController is a Finite State Machine
      Each State:
      * is reflected to an attribute
      * has a corresponding EventHandler
  */

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /***********
  *  Events  *
  ***********/

  /*

  */

  /*************
  *  Template  *
  *************/

});

export { CCCStateControllerMixin,
         LitElement, html, render,
         Mixin, mix }
