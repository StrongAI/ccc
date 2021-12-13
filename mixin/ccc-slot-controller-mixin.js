
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCSlotControllerMixin = Mixin( (superclass) => class extends superclass {

  /***************
  *  Properties  *
  ***************/

  static get properties () {
    return {
      consume: {
        type:  Boolean,
        reflect: true
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
         assigned_nodes.length > slot.assignedNodeTrace.length ) {
      let added_nodes = this.filterAddedNodes( slot );
      this.dispatchDidAssignEvent( slot, added_nodes );
    }
    else {
      let removed_nodes = this.filterRemovedNodes( slot );
      this.dispatchDidRemoveEvent( slot, removed_nodes );
    }
    slot.assignedNodeTrace = assigned_nodes;
  }

  filterAddedNodes( slot ) {
    let assigned_nodes = slot.assignedNodes();
    let added_nodes = {};
    for ( let index = 0; index < assigned_nodes.length ; ++index ) {
      if ( slot.assignedNodeTrace === undefined ||
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
    let elements = this.filterElements( detail );
    this.dispatchDidAssignElementEvent( slot, elements );
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
    let elements = this.filterElements( detail );
    this.dispatchDidRemoveElementEvent( slot, elements );
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

  templatedSlot( class_string = "default", slot_name = ( class_string=="default" ? undefined : class_string ) ) {
    if ( ! this.onslotchange )
      this.onslotchange = (event) => { this.slotDidChange(event); };
    if ( slot_name )
      return html`<slot name="${slot_name}" class="${class_string}" @slotchange="${this.onslotchange}"></slot>`;
    else
      return html`<slot class="${class_string}" @slotchange="${this.onslotchange}"></slot>`;
  }

  templateDefaultSlot() {
    if ( ! this._templateDefaultSlot )
      this._templateDefaultSlot = this.renderSlot ? this.templatedSlot() : html``;
    return this._templateDefaultSlot;
  }

  render() {
    return html`
${this.templatedCSSLinks()}
${this.templateDefaultSlot()}
`
  }

});

export { CCCSlotControllerMixin,
         LitElement, html, render,
         Mixin, mix }
