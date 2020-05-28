
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCEmbeddableElementMixin } from '../mixin/ccc-embeddable-element-mixin.js';
import { CCCNumberedElementMixin } from '../mixin/ccc-numbered-element-mixin.js';
import { CCCCSSElementMixin } from '../mixin/ccc-css-element-mixin.js';

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_IS_REFLECTING_TO_RELAY = 1 << 5;

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
    super.connectedCallback();
    let connected_event = new CustomEvent( 'connected' );
    this.dispatchEvent( connected_event );

    // for each property, post requested update
    // also consider management for each direction
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  requestUpdateInternal( name, oldValue, options ) {
    let shouldRequestUpdate = true;
    // If we have a property key, perform property update steps.
    if (name !== undefined) {
      const ctor = this.constructor;
      options = options || ctor.getPropertyOptions(name);
      if (ctor._valueHasChanged( this[name], oldValue, options.hasChanged)) {
        if (!this._changedProperties.has(name)) {
          this._changedProperties.set(name, oldValue);
        }
        // Add to reflecting properties set.
        // Note, it's important that every change has a chance to add the
        // property to `_reflectingProperties`. This ensures setting
        // attribute + property reflects correctly.
        if (options.reflect === true &&
            !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }
          this._reflectingProperties.set(name, options);
        }

        this.relayUpdate( name, oldValue, options );
      } else {
        // Abort the request if the property should not be considered changed.
        shouldRequestUpdate = false;
      }
    }
    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._updatePromise = this._enqueueUpdate();
    }

  }

  get _relayState() {
    if ( this.__relayState === undefined ) {
      this.__relayState = new Map();
    }
    return this.__relayState;
  }

  relayUpdate( name, oldValue, options ) {
    if ( options.relay !== undefined ) {
      if ( options.relay.target !== undefined && (this._relayState.get( name ) === undefined) ) {
        this._relayState.set( name, true );
        /* If name is false, don't relay to target property. */
        if ( options.relay.target )
          this.relayUpdateToTarget( name, oldValue, options )
        this._relayState.delete( name );
      }
    }
  }

  relayUpdateToTarget( name, oldValue, options ) {
    let target = options.relay.target(this);
    if ( target ) {
      if ( name !== false ) {
        let name_in_target = (options.relay.name === undefined) ?
                             name                               :
                             options.relay.name;
        if ( target instanceof NodeList       ||
             target instanceof HTMLCollection ||
             Array.isArray( target ) )
          this.relayUpdateToTargetArray( name, oldValue, options, target, name_in_target );
        else
          this.relayUpdateToTargetObject( name, oldValue, options, target, name_in_target );
      }
      if ( options.relay.reverse !== undefined )
        this.relayUpdateToReverse( name, oldValue, options, target );
    }
  }

  relayUpdateToTargetArray( name, oldValue, options, target, name_in_target ) {
    for ( let index = 0 ; index < target.length ; ++index ) {
      let this_element = target[index];
      this.relayUpdateToTargetObject( name, oldValue, options, this_element, name_in_target );
    }
  }

  relayUpdateToTargetObject( name, oldValue, options, target, name_in_target ) {
    target[ name_in_target ] = this[ name ];
  }

  relayUpdateToReverse( name, oldValue, options, target ) {
    let reverse = options.relay.reverse(target);
    let value = options.relay.transform             ?
                options.relay.transform(this[name]) :
                this[name];
    for ( let index = 0 ; index < reverse.length ; ++index ) {
      let this_element = reverse[index];
      if ( this_element._relayState.get( name ) === undefined ) {
        this_element._relayState.set( name, true );
        this_element[ name ] = value;
        this_element._relayState.delete( name );
      }
    }
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
