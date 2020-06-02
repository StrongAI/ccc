
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCEmbeddableElementMixin } from '../mixin/ccc-embeddable-element-mixin.js';
import { CCCNumberedElementMixin } from '../mixin/ccc-numbered-element-mixin.js';
import { CCCCSSElementMixin } from '../mixin/ccc-css-element-mixin.js';
import { CCCRelayControllerMixin } from '../mixin/ccc-relay-controller-mixin.js';

class CCCElement extends mix(LitElement).with( CCCCSSElementMixin,
                                               CCCEmbeddableElementMixin,
                                               CCCNumberedElementMixin,
                                               CCCRelayControllerMixin) {

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

  static get properties () {
    return {
      label:         { type: String, reflect: true },
      identifier:    { type: String, reflect: true }
    };
  };

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback();
    let connected_event = new CustomEvent( 'connected' );
    this.dispatchEvent( connected_event );
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
