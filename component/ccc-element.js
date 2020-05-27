
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCEmbeddableElementMixin } from '../mixin/ccc-embeddable-element-mixin.js';
import { CCCNumberedElementMixin } from '../mixin/ccc-numbered-element-mixin.js';
import { CCCCSSElementMixin } from '../mixin/ccc-css-element-mixin.js';

class CCCElement extends mix(LitElement).with(CCCCSSElementMixin, CCCEmbeddableElementMixin, CCCNumberedElementMixin) {

  /***************
  *  Properties  *
  ***************/

  static get tagName()  {
    throw this.name + ": Subclass of CCCElement expected to define static get tagName().";
  }
  static get nodeName() { return this.tagName; }

  static get cssTerminatingClass() {
    return CCCElement;
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


  /*********
  *  Slot  *
  *********/

  get defaultSlot() {
    if ( ! this._defaultSlot )
      this._defaultSlot = this.shadowRoot.querySelector('slot.default');
    return this._defaultSlot;
  }

  /************
  *  General  *
  ************/

}

export { CCCElement,
         CCCEmbeddableElementMixin, CCCNumberedElementMixin, CCCCSSElementMixin,
         LitElement, html, render,
         Mixin, mix }
