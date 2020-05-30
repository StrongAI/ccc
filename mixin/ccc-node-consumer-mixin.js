
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
        this_node._consumed = true;
        this.migrateNewConsumableNode( slot, index, nodes[index] );
      }
    }
    slot.addEventListener( 'slotchange', this.onslotchange );
    this.dispatchDidConsumeEvent( slot, nodes );
  }

  migrateNewConsumableNode( slot, index, node ) {
    slot.parentNode.insertBefore( node, slot );
  }

  /***********
  *  Events  *
  ***********/

  dispatchDidConsumeEvent( slot, nodes = { /* index: node */ } ) {
    this.dispatchDidConsumeNodesEvent( slot, nodes );
    let elements = this.filterElements( nodes );
    this.dispatchDidConsumeElementsEvent( slot, elements );
  }

  dispatchDidConsumeNodesEvent( slot, nodes = { /* index: node */ } ) {
    let did_consume_nodes_event = new CustomEvent( 'did_consume_nodes', { detail: { nodes: nodes } } );
    this.dispatchEvent( did_consume_nodes_event );
  }

  dispatchDidConsumeElementsEvent( slot, nodes = { /* index: node */ } ) {
    let did_consume_elements_event = new CustomEvent( 'did_consume_elements', { detail: { nodes: nodes } } );
    this.dispatchEvent( did_consume_elements_event );
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
