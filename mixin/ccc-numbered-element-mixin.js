
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCNumberedElementMixin = Mixin( (superclass) => class extends superclass {

  static get isNumbered() { return false; }

  /************
  *  Methods  *
  ************/

  get isNumbered() {
    return this.constructor.isNumbered;
  }

  static get unnumberedValue() {
    return 'unnumbered';
  }

  get unnumberedValue() {
    return this.constructor.unnumberedValue;
  }

  calculateNumber( number_variable_name = '_number',
                   increment_condition  = ( accumulator, this_element ) =>
                                          { return this_element.isNumbered; } ) {
    if ( this.isNumbered ) {
      if ( this[number_variable_name] === undefined ) {
        let this_element = this;
        while ((this_element = this_element.previousElementSibling) && ! increment_condition( this[number_variable_name], this_element ) );
        this[number_variable_name] = (this_element === null) ? 1 : this_element[number_variable_name] + 1;
      }
      return this[number_variable_name];
    }
    else return this.unnumberedValue;
  }

  get number() {
    return this.calculateNumber();
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

export { CCCNumberedElementMixin,
         LitElement, html, render,
         Mixin, mix }
