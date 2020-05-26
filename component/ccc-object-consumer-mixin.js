
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from './ccc-element.js';
import { CCCSlottedObjectMixin } from './ccc-slotted-object-mixin.js';

let CCCObjectConsumerMixin = Mixin( (superclass) => class extends mix(superclass).with(CCCSlottedObjectMixin) {

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

  /*******************
  *  Event Handlers  *
  *******************/

  didAssignNode( event ) {
    this.migrateNewConsumableNodes( event.detail.slot, event.detail.nodes );
  }

  /*
    "Consume": to move any ::slotted(*) to insert before slot in shadow root.
  */
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

});

export { CCCObjectConsumerMixin,
         CCCElement,
         LitElement, html, render,
         Mixin, mix }
