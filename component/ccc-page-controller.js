
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from './ccc-element.js';

class CCCPageController extends CCCElement {

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /*************
  *  Template  *
  *************/

  get templatedPageHeader() {
    return this.templatedSlot('page-header');
  }

  get templatedPageNumber() {
    return html`<div class="page-number"><h3>${this.pageNumber} of ${this.totalPages}</h3></div>`;
  }

  get templatedPageContent() {
    return this.templatedSlot('page-content');
  }

  get templatedPageFooter() {
    return this.templatedSlot('page-footer');
  }

  render() {
    return html`
${this.templatedPageHeader}
${this.templatedPageNumber}
${this.templatedPageContent}
${this.templatedPageFooter}
`;
  }

}

export { CCCElement,
         LitElement, html, render,
         Mixin, mix }
