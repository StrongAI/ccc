
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

class CCCPageController extends CCCElement {

  static get tagName() { return 'ccc-page-controller'; }

  static get cssTerminatingClass() {
    return CCCPageController;
  }

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /************
  *  Methods  *
  ************/

    firstNumberedPage( number_variable_name = '_number',
                       increment_condition  = ( accumulator, this_element ) =>
                                              { return this_element.isNumbered; } ) {
      let this_element = this;
      while ( ! increment_condition( this[number_variable_name], this_element ) && (this_element = this_element.nextElementSibling) );
      return this_element;
    }

    lastNumberedPage( number_variable_name = '_number',
                      increment_condition  = ( accumulator, this_element ) =>
                                             { return this_element.isNumbered; } ) {
      let this_element = this;
      while ( ! increment_condition( this[number_variable_name], this_element ) && (this_element = this_element.previousElementSibling) );
      return this_element;
    }

  /***********
  *  Events  *
  ***********/

  /*

    * will_change_page
    * did_change_page
    * will_change_to_next_page
    * did_change_to_next_page
    * will_change_to_previous_page
    * did_change_to_previous_page

  */

  /*************
  *  Template  *
  *************/

  get templatedHeader() {
    return this.templatedSlot('page-header');
  }

  get templatedPageContent() {
    return this.templatedSlot('default', undefined);
  }

  get templatedPreNavigationFooter() {
    return this.templatedSlot('default', undefined);
  }

  templatedNavigationElements() {
    return html``;
  }

  templatedNavigation() {
    return html`<div class="navigation">${this.templatedNavigationElements()}</div>`;
  }

  get templatedPostNavigationFooter() {
    return this.templatedSlot('page-footer');
  }

  render() {
    return html`
${this.templatedHeader}
${this.templatedPageContent}
${this.templatedPreNavigationFooter}
${this.templatedNavigation()}
${this.templatedPostNavigationFooter}
`;
  }

}

export { CCCPageController,
         LitElement, html, render,
         Mixin, mix }
