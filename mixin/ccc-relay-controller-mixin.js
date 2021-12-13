
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;

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

  /*
      It would be nice to use this implementation, but we have to figure out why it loops.
      Probably STATE guards?
      Initial attempt resulted in cycle.
  */

  // requestUpdate( name, oldValue, options = this.constructor.getPropertyOptions(name) ) {
  //   let update_promise = super.requestUpdate( name, oldValue, options );
  //   let relay_promise = update_promise.then( (did_update) => {
  //     if ( this.isConnected ) {
  //       if ( did_update ) {
  //         if (options.relay !== undefined )
  //           this._relayUpdate( name, options.relay );
  //       }
  //       // else {
  //       //   if ( (options.relay !== undefined) && options.relay.always )
  //       //     this._relayUpdate( name, options.relay );
  //       //   else
  //       //     this._clearContinuedState();
  //       // }
  //     }
  //   });
  //   update_promise.relayPromise = relay_promise;
  //   return update_promise;
  // }

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
          this._relayUpdateStart( name, options.relay );
      } else {
        if ( (options.relay !== undefined) && options.relay.always )
          this._relayUpdateStart( name, options.relay );
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

  _relayUpdateStart( name, relay_options ) {
    if ( relay_options.target === undefined )
      throw "Cannot relay without a distinct target.";
    let target = relay_options.target(this);
    this._relayUpdate( name, target, relay_options );

  }

  _relayUpdate( name, target, relay_options, relay_state = this._continuedOrNewState, instance_relay_state = this._instanceRelayState( relay_state ) ) {
    if ( target ) {
      let instance_relay_targets = instance_relay_state.get( name );
      let should_relay = false;
      if ( instance_relay_targets === undefined ) {
        instance_relay_targets = new Map;
        instance_relay_state.set( name, instance_relay_targets );
      }
      if ( instance_relay_targets.get( target ) === undefined ) {
        instance_relay_targets.set( target, true );
        this._relayUpdateInternal( name, target, relay_options, relay_state, instance_relay_state );
      }
    }
  }

  _relayUpdateInternal( name, target, relay_options, relay_state = this._continuedOrNewState, instance_relay_state = this._instanceRelayState( relay_state ) ) {
    if ( relay_options.name !== false ) {
      let name_in_target = ( relay_options.name === undefined) ?
                             name                              :
                             relay_options.name;
      let meets_condition = (relay_options.condition === undefined) || relay_options.condition( this[name], this, target );
      if ( ! meets_condition )
        return;
      let value = relay_options.transform             ?
                  relay_options.transform(this[name], this) :
                  this[name];
      if ( target instanceof NodeList       ||
           target instanceof HTMLCollection ||
           Array.isArray( target ) )
        this._relayUpdateToArrayTarget( name, relay_options, target, name_in_target, value, relay_state );
      else
        this._relayUpdateToObjectTarget( name, relay_options, target, name_in_target, value, relay_state );
    }
    if ( relay_options.then !== undefined ) {
      let next_target = relay_options.then.target(this);


      // if ( relay_options.then.name === undefined && target === this )
      //   throw "Chain was provided without a distinct name or target, which will never run due to cycle guard.";

      this._relayUpdate( relay_options.then.name, next_target, relay_options.then, relay_state );
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
