
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCCSSElementMixin = Mixin( (superclass) => class extends superclass {

  /************
  *  Methods  *
  ************/

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
          this._cssInfo.unshift({
            tag: this_class.tagName,
            link: this_class.templatedElementStylesheet( this_class.tagName, embedded )
          });
        }
      } while ( (this_class = Object.getPrototypeOf(this_class.prototype).constructor) &&
                this_class != this.cssTerminatingClass );
    }
    return this._cssInfo;
  }

  static cssHref( embedded ) {
    if ( ! this.hasOwnProperty('_cssHref') ) {
      this._cssHref = this.elementCSSPath( this.tagName, embedded );
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
  *  CSS Path  *
  *************/

  static cssPath( link_css_id ) {
    return '/compiled_css/' + link_css_id + '.css';
  }

  static elementCSSPath( tag, embedded = false ) {
    return '/compiled_css/' + tag + '/' + tag + '.' + (embedded?'embedded':'host') + '.css';
  }

  /*************
  *  Template  *
  *************/

  static templatedStylesheet( link_css_id="default", link_href=this.cssPath(link_css_id) ) {
    return html`<link rel="stylesheet" id="${link_css_id}" href="${link_href}"></link>`;
  }

  static templatedElementStylesheet( tag, embedded = false, link_href=this.elementCSSPath(tag, embedded) ) {
    return this.templatedStylesheet( tag, link_href );
  }

  templatedDefaultStylesheets() {
    if ( ! this._templatedDefaultStylesheets )
      this._templatedDefaultStylesheets = this.constructor.templatedStylesheet('default');
    return this._templatedDefaultStylesheets;
  }

  templatedElementStylesheets() {
    if ( ! this._templatedElementStylesheets )
      this._templatedElementStylesheets = html`
${this.cssInfo.map( this_css_info => this_css_info.link )}`;
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
