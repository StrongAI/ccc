
import { LitElement, html } from '../../lit-element/lit-element.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCObjectConsumerMixin } from './ccc-object-consumer-mixin.js';
import { CCCSlottedObjectMixin } from './ccc-slotted-object-mixin.js';

const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;

let CCCEmbeddableElementMixin = Mixin( (superclass) => class extends mix(superclass).with(CCCObjectConsumerMixin, CCCSlottedObjectMixin) {

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
    this.addEventListener( 'did_assign_node', this.didAssignNode );
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

  get unshadowParentElement() {
    if ( ! this._unshadowParentElement ) {
      this._unshadowParentElement = this.parentElement;
    }
    return this._unshadowParentElement;
  }

  set unshadowParentElement( parent_element ) {
    this._unshadowParentElement = parent_element;
  }

  get hasMigratedEmbeddedElements() {
    return this._hasMigratedEmbeddedElements;
  }

  /*********
  *  Slot  *
  *********/

  firstUnshadowed() {
    let did_unshadow = new CustomEvent('unshadowed' );
    this.dispatchEvent( did_unshadow );
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

      this.firstUnshadowed();
    }
  }

  migrateEmbeddedElements( slot ) {
    /*
        Anything matching ::slotted([embedded]) is moved from lightDOM
        into shadowDOM.
    */
    slot.removeEventListener( 'slotchange', this.onslotchange );
    this._hasMigratedEmbeddedElements = true;
    this.unshadowParentElement;
    let assigned_nodes = slot.assignedNodes();
    let assigned_node_count = assigned_nodes.length;
    for ( let index = 0 ; index < assigned_node_count ; ++index ) {
      let this_node = assigned_nodes[index];
      if ( this.embedded || this_node.embedded ) {
        // if ( this_node._hasMigratedAsEmbeddedElement !== undefined ) {
          slot.parentNode.insertBefore( this_node, slot );
          this_node._hasMigratedAsEmbeddedElement = true;
        // }
      }
    }
    if ( this.embedded )
      this.unshadow();
    slot.addEventListener( 'slotchange', this.onslotchange );
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
    }
  }

  restoreSlots( temp_div ) {
    let slot_count = temp_div.childNodes.length;
    for ( let slot_index = 0 ; slot_index < slot_count ; ++slot_index ) {
      let this_slot = temp_div.firstChild;
      this.shadowRoot.appendChild( this_slot );
    }
  }

});

export { CCCEmbeddableElementMixin,
         LitElement, html,
         Mixin, mix }
