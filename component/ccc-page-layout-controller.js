
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

class CCCLayoutPageController extends CCCElement {

  static get tagName() { return 'ccc-page-layout-controller'; }

  static get cssTerminatingClass() {
    return CCCLayoutPageController;
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


  /****************
  *  Slot Events  *
  ****************/

  dispatchHeaderAddedEvent() {

  }

  dispatchHeaderRemovedEvent() {

  }

  dispatchFooterAddedEvent() {

  }

  dispatchFooterRemovedEvent() {

  }

  /*****************
  *  State Events  *
  *****************/

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
    return this.templatedSlot('pre-navigation-footer', undefined);
  }

  templatedNavigationElements() {
    return this.templatedSlot('navigation', undefined);
  }

  templatedNavigation() {
    return html`<div class="navigation">${this.templatedNavigationElements()}</div>`;
  }

  get templatedPostNavigationFooter() {
    return this.templatedSlot('post-navigation-footer', undefined);
  }

  get templatedPageFooter() {
    return this.templatedSlot('page-footer');
  }

  render() {
    return html`
${this.templatedHeader}
${this.templatedPageContent}
${this.templatedPageFooter}
`;
  }

}

export { CCCLayoutPageController,
         LitElement, html, render,
         Mixin, mix }
