
import { LitElement, html } from '../../lit-element/lit-element.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCEmbeddableElementMixin } from './ccc-embeddable-element-mixin.js';

class CCCElement extends mix(LitElement).with(CCCEmbeddableElementMixin) {

  /***************
  *  Properties  *
  ***************/

  static get properties () {
    return {
      embedded: {
        type:  Boolean
      }
    };
  }

  static get tagName()  {
    throw "Subclass of CCCElement expected to define static get tagName().";
  }
  static get nodeName() { return this.tagName; }

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /********************
  *  CSS Style Links  *
  ********************/

  static cssInfo( embedded ) {
    let node_name = this.nodeName;
    if ( ! this._cssInfo ) {
      this._cssInfo = [];
      let this_class = this;
      do {
        if ( this_class.cssHref( embedded ) ) {
          this._cssInfo.unshift({ tag: this_class.tagName, href: this_class.cssHref( embedded )});
        }
      } while ( (this_class = Object.getPrototypeOf(this_class.prototype).constructor) &&
                this_class != CCCElement );
    }
    return this._cssInfo;
  }

  static cssHref( embedded ) {
    if ( ! this.hasOwnProperty('_cssHref') ) {
      this._cssHref = [
        '/compiled_css',
        this.tagName,
        this.tagName + (embedded?'.embedded':'.host')+ '.css'
      ].join('/')
    }
    return this._cssHref;
  }

  get cssInfo () {
    return this.constructor.cssInfo( this.embedded );
  }

  get cssHref () {
    return this.constructor.cssHref( this.embedded );
  }

  /*********
  *  Slot  *
  *********/

  get defaultSlot() {
    if ( ! this._defaultSlot )
      this._defaultSlot = this.shadowRoot.querySelector('slot.default');
    return this._defaultSlot;
  }

  get assignedNodes() {
    if ( this.defaultSlot )
      return this.defaultSlot.assignedNodes();
    else
      return [];
  }

  /************
  *  General  *
  ************/

  static get isNumbered() { return false; }

  get isNumbered() {
    return this.constructor.isNumbered;
  }

  get number() {
    if ( this.isNumbered ) {
      if ( this._number == undefined ) {
        this._number = 0;
        let this_element = this;
        do { this._number += this_element.isNumbered ? 1 : 0; }
        while (this_element = this_element.previousElementSibling);
      }
      return this._number;
    }
    else return undefined;
  }

  /*************
  *  Template  *
  *************/

  templatedSlot() {
    if ( ! this._templatedSlot )
      this._templatedSlot = html`<div class="embedded-elements default"></div><slot class="default" @slotchange="${this.slotDidChange}"></slot>`;
    return this._templatedSlot;
  }

  templatedDefaultStylesheets() {
    if ( ! this._templatedDefaultStylesheets )
      this._templatedDefaultStylesheets = html`<link rel="stylesheet" class="default" href="/assets/css/default.css"></link>`;
    return this._templatedDefaultStylesheets;
  }

  templatedElementStylesheets() {
    if ( ! this._templatedElementStylesheets )
      this._templatedElementStylesheets = html`
${this.cssInfo.map( this_css_info => html`
  <link rel="stylesheet" id="${this_css_info.tag}" href="${this_css_info.href}"></link>
`)}`;
    return this._templatedElementStylesheets;
  }

  templatedCSSLinks() {
    if ( ! this._templatedCSSLinks )
      this._templatedCSSLinks = this.embedded ?
html``                                        :
html`${this.templatedDefaultStylesheets()}
${this.templatedElementStylesheets()}`;
    return this._templatedCSSLinks;
  }

  render() {
    return this.templatedCSSLinks();
  }

}

export { CCCElement,
         LitElement, html,
         Mixin, mix }
