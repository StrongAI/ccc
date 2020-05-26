
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from './ccc-element.js';

let CCCObjectConsumerMixin = Mixin( (superclass) => class extends superclass {

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

  didAssignNode( event ) {
    if ( ! this.hasMigratedEmbeddedElements )
      this.migrateEmbeddedElements( event.detail.slot );
  }

  /*
    "Consume": to move any ::slotted(*) to insert before slot in shadow root.
  */
  dispatchDidConsumeEvent() {

  }

  dispatchDidConsumeElementEvent() {

  }

  dispatchDidConsumeNodeEvent() {

  }

});

export { CCCObjectConsumerMixin,
         CCCElement,
         LitElement, html, render,
         Mixin, mix }
