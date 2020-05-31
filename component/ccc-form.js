
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

import { CCCPageController } from './ccc-page-controller.js';

class CCCForm extends CCCPageController {

  static get properties () {
    return {
      fadeOut:              { type: Boolean, attribute: 'fade-out', reflect: true },
      fadeIn:               { type: Boolean, attribute: 'fade-in', reflect: true },
      prompt:               { type: String },
      action:               { type: String },
      method:               { type: String },
      enctype:              { type: String }
    };
  };
  static get tagName() { return 'ccc-form'; }
  static get default() {
    return {
      method:  'post',
      enctype: 'application/x-www-form-urlencoded'
    };
  }

  static get cssTerminatingClass() {
    return CCCForm;
  }

  /*****************
  *  Constructors  *
  *****************/

  constructor() {
    super();
    this.method = this.constructor.default.method;
    this.enctype = this.constructor.default.enctype;
  }

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /************
  *  Methods  *
  ************/

  get form() {
    if ( ! this._form )
      this._form = this.unshadowRoot.querySelector('form.survey.page');
    return this._form;
  }

  get container() {
    if ( ! this._container )
      this._container = this.unshadowRoot.querySelector('div.container');
    return this._container;
  }

  submit() {
    this.form.submit();
  }

  /****************
  *  Slot Events  *
  ****************/

  /*****************
  *  State Events  *
  *****************/

  /*************
  *  Template  *
  *************/

  templatedPrompt() {
    return html`<p>${this.prompt}</p>`;
  }

  templatedSubmitButton() {
    return html`<input type="submit" name="submit-button" class="navigation-button submit" value="Submit" @click="${this.submit}">`;
  }

  templatedNavigationElements() {
    return html`
${this.templatedSubmitButton()}
    `;
  }

  templatedInputs() {
    return html``;
  }

  templatedNavigation() {
    return html`
<div class="navigation">
  ${this.templatedNavigationElements()}
</div>
    `;
  }

  get templatedFieldset() {
    return html`
<fieldset>
${super.render()}
${this.templatedInputs()}
</fieldset>
    `;
  }

  get templatedPageDiv() {
    return html`
<div class="page">${this.templatedFieldset}</div>
    `;
  }

  templatedContainer() {
    return html`
<div class="container">${this.templatedPageDiv}</div>
    `;
  }

  render() {
    return html`
${this.templatedCSSLinks()}
<form name="survey" class="survey page" accept-charset="UTF-8" enctype="${this.enctype}" action="${this.action}" method="${this.method}">
${this.templatedContainer()}
</form>
    `;
  }

}

export { CCCForm,
         CCCPageController,
         CCCElement,
         LitElement, html, render,
         Mixin, mix }
