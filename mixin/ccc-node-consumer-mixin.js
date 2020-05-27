
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCSlotControllerMixin } from '../mixin/ccc-slot-controller-mixin.js';

/*
  "Consume": to move any ::slotted(*) to insert before slot in shadow root.
*/
let CCCNodeConsumerMixin = Mixin( (superclass) => class extends mix(superclass).with(CCCSlotControllerMixin) {

  /***************
  *  Properties  *
  ***************/

  static get properties () {
    return {
      consume: {
        type:  Boolean
      }
    };
  }

  /*****************
  *  Constructors  *
  *****************/

  constructor() {
    super();
    this.addEventListener( 'did_assign_node', this.didAssignNode );
  }

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /******************************
  *  Consuming Slotted Objects  *
  ******************************/

  shouldConsume( node ) {
    return this.consume;
  }

  migrateNewConsumableNodes( slot, nodes = { /* index: node */ } ) {
    slot.removeEventListener( 'slotchange', this.onslotchange );
    for ( const index in nodes ) {
      let this_node = nodes[index];
      if ( this.shouldConsume( this_node ) ) {
        slot.parentNode.insertBefore( this_node, slot );
        this.dispatchDidConsumeEvent( slot, this_node );
      }
    }
    slot.addEventListener( 'slotchange', this.onslotchange );
  }

  /***********
  *  Events  *
  ***********/

  dispatchDidConsumeEvent( slot, node ) {
    this.dispatchDidConsumeNodeEvent( slot, node );
    if ( node.nodeType === Node.ELEMENT_NODE )
      this.dispatchDidConsumeElementEvent( slot, node );
  }

  dispatchDidConsumeNodeEvent( slot, node ) {
    let did_consume_node_event = new CustomEvent(
      'did_consume_node',
      { detail: { slot: slot, node: node } }
    );
    this.dispatchEvent(did_consume_node_event);
  }

  dispatchDidConsumeElementEvent( slot, element ) {
    let did_consume_element_event = new CustomEvent(
      'did_consume_element',
      { detail: { slot: slot, element: element } }
    );
    this.dispatchEvent(did_consume_element_event);
  }

  /*******************
  *  Event Handlers  *
  *******************/

  didAssignNode( event ) {
    this.migrateNewConsumableNodes( event.detail.slot, event.detail.nodes );
  }


});

export { CCCNodeConsumerMixin,
         LitElement, html, render,
         Mixin, mix }
