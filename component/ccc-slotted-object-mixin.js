
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from './ccc-element.js';

let CCCSlottedObjectMixin = Mixin( (superclass) => class extends superclass {

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

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /*******************
  *  Event Handlers  *
  *******************/

  slotDidChange( event ) {
    let slot = event.target;
    let assigned_nodes = slot.assignedNodes();
    if ( slot.assignedNodeTrace === undefined        ||
         slot.assignedNodeTrace.length === undefined ||
         assigned_nodes.length > slot.assignedNodeTrace.length )
      this.dispatchDidAssignEvent( slot, this.filterAddedNodes( slot ) );
    else
      this.dispatchDidRemoveEvent( slot, this.filterRemovedNodes( slot ) );
    slot.assignedNodeTrace = assigned_nodes;
  }

  filterAddedNodes( slot ) {
    let assigned_nodes = slot.assignedNodes();
    let added_nodes = {};
    for ( let index = 0; index < assigned_nodes.length ; ++index ) {
      if ( slot.assignedNodeTrace &&
           assigned_nodes[ index ] !== slot.assignedNodeTrace[ index ] )
        added_nodes[ index ] = assigned_nodes[ index ];
    }
    return added_nodes;
  }

  filterRemovedNodes( slot ) {
    let assigned_nodes = slot.assignedNodes();
    let removed_nodes = {};
    for ( let index = 0; index < slot.assignedNodeTrace.length ; ++index ) {
      if ( assigned_nodes[ index ] !== slot.assignedNodeTrace[ index ] )
        removed_nodes[ index ] = slot.assignedNodeTrace[ index ];
    }
    return removed_nodes;
  }

  filterElements( node_detail = { /* index: node */ } ) {
    let element_detail = {};
    for ( const index in node_detail )
      if ( node_detail[index].nodeType === Node.ELEMENT_NODE )
        element_detail[index] = node_detail[index];
    return element_detail;
  }

  dispatchDidAssignEvent( slot, detail = { /* index: node */ } ) {
    this.dispatchDidAssignNodeEvent( slot, detail );
    this.dispatchDidAssignElementEvent( slot, this.filterElements( detail ) );
  }

  dispatchDidAssignNodeEvent( slot, node_detail = { /* index: node */ } ) {
    let did_assign_node_event = new CustomEvent(
      'did_assign_node',
      { detail: { slot: slot, nodes: node_detail } }
    );
    this.dispatchEvent(did_assign_node_event);
  }

  dispatchDidAssignElementEvent( slot, element_detail = { /* index: node */ } ) {
    let did_assign_element_event = new CustomEvent(
      'did_assign_element',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(did_assign_element_event);
  }

  dispatchDidRemoveEvent( slot, detail = { /* index: node */ } ) {
    this.dispatchDidRemoveNodeEvent( slot, detail );
    this.dispatchDidRemoveElementEvent( slot, this.filterElements( detail ) );
  }

  dispatchDidRemoveNodeEvent( slot, node_detail = { /* index: node */ } ) {
    let did_remove_node_event = new CustomEvent(
      'did_remove_node',
      { detail: { slot: slot, nodes: node_detail } }
    );
    this.dispatchEvent(did_remove_node_event);
  }

  dispatchDidRemoveElementEvent( slot, element_detail = { /* index: node */ } ) {
    let did_remove_element_event = new CustomEvent(
      'did_remove_element',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(did_remove_element_event);
  }

  /*************
  *  Template  *
  *************/

  templatedSlot( class_string = "default" ) {
    if ( ! this.onslotchange )
      this.onslotchange = (event) => { this.slotDidChange(event); };
    return html`<slot class="${class_string}" @slotchange="${this.onslotchange}"></slot>`;
  }

});

export { CCCSlottedObjectMixin,
         CCCElement,
         LitElement, html, render,
         Mixin, mix }
