
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCNodeConsumerMixin } from './ccc-node-consumer-mixin.js';
import { CCCSlotControllerMixin } from './ccc-slot-controller-mixin.js';

let CCCEmbeddableElementMixin = Mixin( (superclass) => class extends mix(superclass).with(CCCNodeConsumerMixin, CCCSlotControllerMixin) {

  /***************
  *  Properties  *
  ***************/

  static get properties () {
    return {
      embedded: {
        type:  Boolean
      },
      unshadowed: {
        type:  Boolean
      },
      unshadowParentElement: {
        type:  Object
      }
    };
  }

  /*****************
  *  Constructors  *
  *****************/

  constructor() {
    super();
    this.embedded = false;
    this.unshadowed = false;
  }

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /*************
  *  Unshadow  *
  *************/

  get unshadowRoot() {
    if ( this.unshadowed )
      return this;
    else
      return this.shadowRoot;
  }

  get unshadowParentElement() {
    if ( ! this._unshadowParentElement ) {
      if ( (this.parentElement !== null) )
        this._unshadowParentElement = this.parentElement;
    }
    return this._unshadowParentElement;
  }

  set unshadowParentElement( parent_element ) {
    this._unshadowParentElement = parent_element;
  }

  shouldConsume( node ) {
    return ( this.consume || this.embedded || node.embedded ) && ! node._hasBeenUnshadowed;
  }

  migrateNewConsumableNode( slot, index, node ) {
    node.unshadowParentElement;
    super.migrateNewConsumableNode( slot, index, node );
  }

  migrateNewConsumableNodes( slot, nodes = { /* index: node */ } ) {
    this.unshadowParentElement;
    super.migrateNewConsumableNodes( slot, nodes );
    if ( this.embedded )
      this.unshadow();
    this.dispatchDidConsumeEvent( slot, nodes );
  }

  unshadow() {
    /*
        Anything in shadowRoot is moved to lightDOM.
    */
    if ( ! this.unshadowed ) {
      let slots = this.preserveSlots();
      this.moveShadowChildrenToLight();
      this.restoreSlots( slots );
      this.unshadowed = true;
      this.dispatchDidUnshadowEvent();
    }
  }

  preserveSlots() {
    let slots = this.shadowRoot.querySelectorAll('slot');
    let temp_div = document.createElement('div');
    let slot_count = slots.length;
    for ( let slot_index = 0 ; slot_index < slot_count ; ++slot_index ) {
      let this_slot = slots[0];
      let assigned_nodes = this_slot.assignedNodes();
      temp_div.appendChild(this_slot);
    }
    return temp_div;
  }

  moveShadowChildrenToLight() {
    let child_node_count = this.shadowRoot.childNodes.length;
    for ( let index = 0 ; index < child_node_count ; ++index ) {
      let this_child = this.shadowRoot.childNodes[0];
      this.appendChild( this_child );
      this_child._hasBeenUnshadowed = true;
      this.dispatchDidUnshadowChildEvent( this_child );
    }
  }

  restoreSlots( temp_div ) {
    let slot_count = temp_div.childNodes.length;
    for ( let slot_index = 0 ; slot_index < slot_count ; ++slot_index ) {
      let this_slot = temp_div.firstChild;
      this.shadowRoot.appendChild( this_slot );
    }
  }

  /***********
  *  Events  *
  ***********/

  dispatchDidUnshadowEvent() {
    let did_unshadow_event = new CustomEvent('did_unshadow' );
    this.dispatchEvent( did_unshadow_event );
  }

  dispatchDidUnshadowChildEvent( node ) {
    this.dispatchDidUnshadowChildNodeEvent( node );
    if ( node.nodeType === Node.ELEMENT_NODE )
      this.dispatchDidUnshadowChildElementEvent( node );
  }

  dispatchDidUnshadowChildNodeEvent( node ) {
    let did_unshadow_child_node_event = new CustomEvent( 'did_unshadow_child_node', { detail: { node: node } } );
    this.dispatchEvent( did_unshadow_child_node_event );
  }

  dispatchDidUnshadowChildElementEvent( element ) {
    let did_unshadow_child_element_event = new CustomEvent( 'did_unshadow_child_element', { detail: { element: element } } );
    this.dispatchEvent( did_unshadow_child_element_event );
  }

});

export { CCCEmbeddableElementMixin,
         LitElement, html,
         Mixin, mix }
