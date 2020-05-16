
import { LitElement, html } from '../../lit-element/lit-element.js';
import { Mixin, mix } from "../src/mixwith.js";

let CCCEmbeddableElementMixin = Mixin( (superclass) => class extends superclass {

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

  attributeChangedCallback(name, old_value, new_value) {
    if ( this.constructor.getPropertyOptions(name).type === Boolean && new_value == '')
      new_value = true;
    this[name] = new_value;
    this.requestUpdate( name, old_value );
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

  get unshadowParentElement() {
    if ( ! this._unshadowParentElement )
      this._unshadowParentElement = this.parentElement;
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

  slotDidChange( event ) {
    let slot = event.target;
    if ( ! this.hasMigratedEmbeddedElements )
      this.migrateEmbeddedElements( slot );
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
        let this_container = this.embeddedElementsContainer( slot.classList );
        this_container.appendChild( this_node );
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

  get embeddedElementsContainers() {
    if ( ! this._embeddedElementsContainer )
      this._embeddedElementsContainer = {};
    return this._embeddedElementsContainer;
  }

  embeddedElementsContainer( slot_class_list ) {
    let class_string = [ '.embedded-elements' ].concat( slot_class_list ).join('.');
    let container = this.embeddedElementsContainers[ class_string ];
    if ( ! container ) {
      if ( ! ( container = this.shadowRoot.querySelector(class_string) ) )
        container = this.querySelector(class_string);
      this.embeddedElementsContainers[ class_string ] = container
    }

    return container;
  }

  /*************
  *  Template  *
  *************/

  templatedSlot() {
    if ( ! this._templatedSlot ) {
      this.onslotchange = (event) => { this.slotDidChange(event); };
      this._templatedSlot = html`<div class="embedded-elements default"></div><slot class="default" @slotchange="${this.onslotchange}"></slot>`;
    }
    return this._templatedSlot;
  }

});

export { CCCEmbeddableElementMixin,
         LitElement, html,
         Mixin, mix }
