
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

import Cookies from "https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.mjs";

/*
  A router routes between distinct states.
*/

class CCCRouter extends CCCElement {

  static get tagName() { return 'ccc-router'; }

  static get cssTerminatingClass() {
    return CCCRouter;
  }

  static get sessionName() {
    return 'CCC-Session';
  }

  /*****************
  *  Constructors  *
  *****************/

  constructor() {
    super();
    window.router = this;
    this.session;
    this.args;
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

  get session() {
    if ( this._session === undefined ) {
      let cookies = Cookies.get();
      let session_json = Cookies.get( this.constructor.sessionName );
      if ( session_json ) {
        this._session = JSON.parse( session_json );
        let properties = Object.getOwnPropertyNames( this._session );
        for ( let this_property of properties )
          this[ this_property ] = this._session[ this_property ];
      }
    }
    return this._session;
  }

  get url() {
    if ( ! this._url )
      this._url = new URL(window.location);
    return this._url;
  }

  get args() {
    if ( ! this._args )
      this._args = this.url.searchParams;
    return this._args;
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

}

export { CCCRouter,
         Cookies,
         CCCElement,
         LitElement, html, render,
         Mixin, mix }
