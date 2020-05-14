
import { CCCElement, html } from '../node_modules/ccc/ccc.js';

class CCCTestElement extends CCCElement {

  static get tagName() { return 'ccc-test-element'; }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() { return html`${this.templatedSlot()}`; }


}

customElements.define(CCCTestElement.tagName, CCCTestElement);

export { CCCTestElement };
