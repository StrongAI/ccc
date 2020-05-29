
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_IS_REFLECTING_TO_RELAY = 1 << 5;

let CCCRelayControllerMixin = Mixin( (superclass) => class extends superclass {

  /*****************
  *  Constructors  *
  *****************/

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /******************************
  *  Lit-Element RequestUpdate  *
  ******************************/

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
        if ( options.reflect === true &&
         ! ( this._updateState & STATE_IS_REFLECTING_TO_PROPERTY) ) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }
          this._reflectingProperties.set(name, options);
        }

        if ( this.isConnected && options.relay !== undefined )
          this._relayUpdate( name, options.relay );
      } else {
        if ( (options.relay !== undefined) && options.relay.always )
          this._relayUpdate( name, options.relay );
        else
          this._clearContinuedState();
        // Abort the request if the property should not be considered changed.
        shouldRequestUpdate = false;
      }
    }
    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._updatePromise = this._enqueueUpdate();
    }

  }

  /******************
  *  Relay Methods  *
  ******************/

  _instanceRelayState( relay_state ) {
    let instance_relay_state = relay_state.get( this );
    if ( instance_relay_state === undefined ) {
      instance_relay_state = new Map();
      relay_state.set( this, instance_relay_state );
    }
    return instance_relay_state;
  }

  _continueRelayState( relay_state, target ) {
    if ( target.__relayState === undefined )
      target.__relayState = relay_state;
    else
      target.__relayState = new Map([ ...target.__relayState, ...relay_state ]);
  }

  get _continuedOrNewState() {
    let state = this.__relayState;
    if ( state === undefined )
      state = new Map();
    else
      this._clearContinuedState();
    return state;
  }

  _clearContinuedState() {
    delete this.__relayState;
  }

  _relayUpdate( name, relay_options, relay_state = this._continuedOrNewState, instance_relay_state = this._instanceRelayState( relay_state ) ) {
    if ( instance_relay_state.get( name ) === undefined ) {
      this._relayUpdateInternal( name, relay_options, relay_state, instance_relay_state )
    }
  }

  _relayUpdateInternal( name, relay_options, relay_state = this._continuedOrNewState, instance_relay_state = this._instanceRelayState( relay_state ) ) {
    instance_relay_state.set( name, true );
    if ( relay_options.target !== undefined ) {
      let target = relay_options.target(this);
      if ( target ) {
        if ( relay_options.name !== false ) {
          let name_in_target = ( relay_options.name === undefined) ?
                                 name                              :
                                 relay_options.name;
          let value = relay_options.transform             ?
                      relay_options.transform(this[name]) :
                      this[name];
          if ( target instanceof NodeList       ||
               target instanceof HTMLCollection ||
               Array.isArray( target ) )
            this._relayUpdateToArrayTarget( name, relay_options, target, name_in_target, value, relay_state );
          else
            this._relayUpdateToObjectTarget( name, relay_options, target, name_in_target, value, relay_state );
        }
        // if ( relay_options.chain !== undefined ) {
        //   target._relayUpdate( name, relay_options.chain, relay_state );
        // }
      }
    }
  }

  _relayUpdateToArrayTarget( name, relay_options, target, name_in_target, value, relay_state ) {
    for ( let index = 0 ; index < target.length ; ++index ) {
      let this_element = target[index];
      this._relayUpdateToObjectTarget( name, relay_options, this_element, name_in_target, value, relay_state );
    }
  }

  _relayUpdateToObjectTarget( name, relay_options, target, name_in_target, value, relay_state, instance_relay_state = relay_state.get( target ) ) {
    if ( (instance_relay_state === undefined) || (instance_relay_state.get( name_in_target ) === undefined) ) {
      this._continueRelayState( relay_state, target );
      target[ name_in_target ] = value;
    }
  }

  /***********
  *  Events  *
  ***********/

  /*

  */

  /*************
  *  Template  *
  *************/

});

export { CCCRelayControllerMixin,
         LitElement, html, render,
         Mixin, mix }
