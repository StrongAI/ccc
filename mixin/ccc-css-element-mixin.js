
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCCSSElementMixin = Mixin( (superclass) => class extends superclass {

  static get properties () {
    return {
      renderSlot: {
        type:  Boolean
      }
    };
  }
  /************
  *  Methods  *
  ************/

  constructor() {
    super();
    this.renderSlot = true;
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
                this_class != this.cssTerminatingClass );
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

  /***********
  *  Events  *
  ***********/

  /*

  */

  /*************
  *  Template  *
  *************/

  templatedDefaultStylesheets() {
    if ( ! this._templatedDefaultStylesheets )
      this._templatedDefaultStylesheets = html`<link rel="stylesheet" class="default" href="/compiled_css/default.css"></link>`;
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

});

export { CCCCSSElementMixin,
         LitElement, html, render,
         Mixin, mix }
