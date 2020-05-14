
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

  /*************
  *  Unshadow  *
  *************/

  attributeBoolean( name ) {
    let value = this.getAttribute(name);
    if ( value === '' )
      return true;
    else
      return false;
  }

  setAttributeBoolean( name, true_or_false ) {
    if ( true_or_false )
      this.setAttribute(name, '');
     else
      this.removeAttribute(name);
  }

  get embedded() {
    return this.attributeBoolean( 'embedded' );
  }

  set embedded( true_or_false ) {
    return this.setAttributeBoolean( 'embedded', true_or_false );
  }

  get unshadowParentElement() {
    if ( ! this._unshadowParentElement ) {
      this._unshadowParentElement = this;
      do { this._unshadowParentElement = this._unshadowParentElement.parentElement; }
      while ( this._unshadowParentElement && ! this._unshadowParentElement.nodeName.startsWith('PRO-') );
      if ( this._unshadowParentElement === null )
        return undefined;
    }
    return this._unshadowParentElement;
  }

  set unshadowParentElement( parent_element ) {
    this._unshadowParentElement = parent_element;
  }

  /*********
  *  Slot  *
  *********/

  get nonMigratingElementCount() {
    if ( this._nonMigratingElementCount === undefined )
      this._nonMigratingElementCount = 0;
    return this._nonMigratingElementCount;
  }

  slotDidChange( event ) {
    let slot = event.target;
    this.migrateEmbeddedElements( slot );
  }

  unshadow() {
    /*
        Anything in shadowRoot is moved to lightDOM.
    */
    if ( ! this._hasUnshadowed ) {
      let temp_slot_div = this.moveSlotsToTempDIV();
      this.moveShadowChildrenToLight();
      this.restoreSlotsToShadow( temp_slot_div );
      this._hasUnshadowed = true;
    }
  }

  get hasUnshadowed() {
    return this._hasUnshadowed;
  }

  migrateEmbeddedElements( slot ) {
    /*
        Anything matching ::slotted([embedded]) is moved from lightDOM
        into shadowDOM.
    */
    slot.removeEventListener( 'slotchange', this.slotDidChange );
    let assigned_nodes = slot.assignedNodes();
    let assigned_node_count = assigned_nodes.length;
    for ( let index = this.nonMigratingElementCount ; index < assigned_node_count ; ++index ) {
      let this_node = assigned_nodes[index];
      if ( this_node.embedded ) {
        let this_container = this.embeddedElementsContainer( slot.classList );
        this_container.appendChild( this_node );
        this_node.unshadow();
      }
      else
        ++this._nonMigratingElementCount;
    }
    slot.addEventListener( 'slotchange', this.slotDidChange );
  }

  moveSlotsToTempDIV() {
    let slots = this.shadowRoot.querySelectorAll('slot');
    let temp_slot_div = document.createElement('div');
    let slot_count = slots.length;
    for ( let index = 0 ; index < slot_count ; ++index ) {
      let this_slot = slots[0];
      temp_slot_div.appendChild( this_slot );
    }
    return temp_slot_div;
  }

  moveShadowChildrenToLight() {
    let child_node_count = this.shadowRoot.childNodes.length;
    for ( let index = 0 ; index < child_node_count ; ++index ) {
      let this_child = this.shadowRoot.childNodes[0];
      this.appendChild( this_child );
    }
  }

  restoreSlotsToShadow( temp_slot_div ) {
    let slot_count = temp_slot_div.length;
    for ( let index = 0 ; index < slot_count ; ++index ) {
      let this_slot = temp_slot_div.firstChild;
      this.shadowRoot.appendChild( this_slot )
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
      if ( this.hasMovedEmbeddedElements )
        container = this.querySelector(class_string);
      else
        container = this.shadowRoot.querySelector(class_string);
      this.embeddedElementsContainers[ class_string ] = container
    }

    return container;
  }

});

export { CCCEmbeddableElementMixin,
         LitElement, html,
         Mixin, mix }
