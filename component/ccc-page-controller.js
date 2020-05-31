
import { LitElement, html } from '../../lit-element/lit-element.js';
import { render } from '../../lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

class CCCPageController extends CCCElement {

  static get properties () {
    return {
      totalPages:   { type: Number }
    };
  };

  static get tagName() { return 'ccc-page-controller'; }

  static get cssTerminatingClass() {
    return CCCPageController;
  }

  /*****************
  *  Constructors  *
  *****************/

  constructor() {
    super();
    this.totalPages = 0;
    window.pageController = this;
  }

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
  }

  /************
  *  Methods  *
  ************/

  firstNumberedPage( number_variable_name = '_number',
                     increment_condition  = ( accumulator, this_element ) =>
                                            { return this_element.isNumbered; } ) {
    let this_element = this;
    while ( ! increment_condition( this[number_variable_name], this_element ) && (this_element = this_element.nextElementSibling) );
    return this_element;
  }

  lastNumberedPage( number_variable_name = '_number',
                    increment_condition  = ( accumulator, this_element ) =>
                                           { return this_element.isNumbered; } ) {
    let this_element = this;
    while ( ! increment_condition( this[number_variable_name], this_element ) && (this_element = this_element.previousElementSibling) );
    return this_element;
  }

  /***********************
  *  Slot Event Handler  *
  ***********************/

  dispatchDidAssignElementEvent( slot, element_detail = { /* index: node */ } ) {
    super.dispatchDidAssignElementEvent( slot, element_detail );
    if ( slot.name === '' )
      this.dispatchPageAddedEvent( slot, element_detail );
    else if ( slot.name == 'page-header' )
      this.dispatchHeaderAddedEvent( slot, element_detail );
    else if ( slot.name == 'pre-navigation-footer' )
      this.dispatchPagePreNavigationFooterAddedEvent( slot, element_detail );
    else if ( slot.name == 'post-navigation-footer' )
      this.dispatchPostNavigationFooterAddedEvent( slot, element_detail );
    else if ( slot.name == 'navigation' )
      this.dispatchPageNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'page-footer' )
      this.dispatchPageFooterAddedEvent( slot, element_detail );
  }

  dispatchDidRemoveElementEvent( slot, element_detail = { /* index: node */ } ) {
    super.dispatchDidRemoveElementEvent( slot, element_detail );
    if ( slot.name === '' )
      this.dispatchPageRemovedEvent( slot, element_detail );
    else if ( slot.name == 'page-header' )
      this.dispatchHeaderRemovedEvent( slot, element_detail );
    else if ( slot.name == 'pre-navigation-footer' )
      this.dispatchPagePreNavigationFooterRemovedEvent( slot, element_detail );
    else if ( slot.name == 'post-navigation-footer' )
      this.dispatchPostNavigationFooterRemovedEvent( slot, element_detail );
    else if ( slot.name == 'navigation' )
      this.dispatchPageNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'page-footer' )
      this.dispatchPageFooterRemovedEvent( slot, element_detail );
  }

  /****************
  *  Slot Events  *
  ****************/

  dispatchPageAddedEvent( slot, element_detail = { /* index: node */ } ) {
    for ( const key in element_detail ) {
      let this_element = element_detail[ key ];
      if ( this_element.isNumbered )
        ++this.totalPages;
    }
    let page_added_event = new CustomEvent(
      'page_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(page_added_event);
  }

  dispatchPageRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    for ( const key in element_detail ) {
      let this_element = element_detail[ key ];
      if ( this_element.isNumbered && ! this_element._consumed )
        --this.totalPages;
    }
    let page_removed_event = new CustomEvent(
      'page_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(page_removed_event);
  }

  dispatchPreNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_navigation_added_event = new CustomEvent(
      'pre_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_navigation_added_event);
  }

  dispatchPreNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_navigation_removed_event = new CustomEvent(
      'pre_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_navigation_removed_event);
  }

  dispatchNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let navigation_added_event = new CustomEvent(
      'navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(navigation_added_event);
  }

  dispatchNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let navigation_removed_event = new CustomEvent(
      'navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(navigation_removed_event);
  }

  dispatchPostNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_added_event = new CustomEvent(
      'post_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_navigation_added_event);
  }

  dispatchPostNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_removed_event = new CustomEvent(
      'post_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_navigation_removed_event);
  }

  /*****************
  *  State Events  *
  *****************/

  dispatchWillChangePageEvent() {

  }

  dispatchWillChangeToNextPageEvent() {

  }

  dispatchWillChangeToPreviousPageEvent() {

  }

  dispatchWillChangeToNumberedPageEvent() {

  }

  dispatchWillChangeToUnnumberedPageEvent() {

  }

  dispatchDidChangePageEvent() {

  }

  dispatchDidChangeToNextPageEvent() {

  }

  dispatchDidChangeToPreviousPageEvent() {

  }

  dispatchDidChangeToNumberedPageEvent() {

  }

  dispatchDidChangeToUnnumberedPageEvent() {

  }

  /*************
  *  Template  *
  *************/

  get templatedHeader() {
    return this.templatedSlot('page-header');
  }

  get templatedPageContent() {
    return this.templatedSlot('default', undefined);
  }

  get templatedPreNavigationFooter() {
    return this.templatedSlot('pre-navigation-footer', undefined);
  }

  templatedNavigationElements() {
    return this.templatedSlot('navigation', undefined);
  }

  templatedNavigation() {
    return html`<div class="navigation">${this.templatedNavigationElements()}</div>`;
  }

  get templatedPostNavigationFooter() {
    return this.templatedSlot('post-navigation-footer', undefined);
  }

  get templatedPageFooter() {
    return this.templatedSlot('page-footer');
  }

  render() {
    return html`
${this.templatedHeader}
${this.templatedPageContent}
${this.templatedPreNavigationFooter}
${this.templatedNavigation()}
${this.templatedPostNavigationFooter}
${this.templatedPageFooter}
`;
  }

}

export { CCCPageController,
         LitElement, html, render,
         Mixin, mix }
