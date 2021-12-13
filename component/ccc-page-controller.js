
import { LitElement, html } from 'lit-element/lit-element.js';
import { render } from 'lit-html/lit-html.js';
import { Mixin, mix } from "../src/mixwith.js";
import { CCCElement } from './ccc-element.js';

class CCCPageController extends CCCElement {

  static get properties () {
    return {
      userAgent:          { type: String,  reflect: true, attribute: 'data-browser' },
      isFirstPage:        { type: Boolean, reflect: true, attribute: 'first-page' },
      isLastPage:         { type: Boolean, reflect: true, attribute: 'last-page' },
      totalPages:         { type: Number },
      linearNavigation:   { type: Boolean, reflect: true, attribute: 'linear-navigation' }
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
    super.connectedCallback();
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
    document.documentElement.setAttribute("data-browser", navigator.userAgent);
    this.userAgent = navigator.userAgent;
  }

  /************
  *  Methods  *
  ************/

  get nextButton() {
    if ( ! this._form ) {
      this._form = this.unshadowRoot.querySelector('input.back');
    }
    return this._form;
  }

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


  get nextPageNumber() {
    return this.selectedPage ? this.selectedPage.nextPageNumber : undefined;
  }

  get previousPageNumber() {
    return this.selectedPage ? this.selectedPage.previousPageNumber : undefined;
  }

  get selectedPage() {
    if ( ! this._selectedPage )
      this.selectedPage = this.unshadowRoot.querySelector( '[selected]' );
    return this._selectedPage;
  }

  set selectedPage( selected_page ) {
    this._selectedPage = selected_page;
    if ( selected_page ) {
      if ( this.linearNavigation && selected_page.computeNextButtonLabel )
        this.nextButtonLabel = selected_page.computeNextButtonLabel();
      this.pageNumber = this.selectedPage.pageNumber;
      this.isFirstPage = this._selectedPage.previousElementSibling === null;
      this.isLastPage = this._selectedPage.nextElementSibling === null;
      this.requestUpdate( 'selectedPageIsLastPage', undefined );
    }
  }

  moveToPreviousPage() {
    this.ontransitionend = (event) => {
      this.ontransitionend = undefined;
      if ( this.selectedPage ) {
        this.selectedPage.selected = false;
        this.selectedPage.invisible = true;
        this.selectedPage.previousElementSibling.invisible = false;
        this.selectedPage.previousElementSibling.selected = true;
        this.selectedPage = this.selectedPage.previousElementSibling;
      }
      this.fadeOut = false;
    };
    this.fadeOut = true;
  }

  moveToNextPage() {
    this.ontransitionend = (event) => {
      this.ontransitionend = undefined;
      if ( this.selectedPage ) {
        this.selectedPage.selected = false;
        this.selectedPage.invisible = true;
        this.selectedPage.nextElementSibling.invisible = false;
        this.selectedPage.nextElementSibling.selected = true;
        this.selectedPage = this.selectedPage.nextElementSibling;
      }
      this.fadeOut = false;
    };
    this.fadeOut = true;
  }

  backWasClicked() {
    this.moveToPreviousPage();
  }

  nextWasClicked() {
    this.moveToNextPage();
  }

  get selectedPageNumber() {
    return this.selectedPage ? this.selectedPage.pageNumber : undefined;
  }

  get selectedPageIsLastPage() {
    return this.selectedPage ? this.selectedPage.isLastPage : undefined;
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
    else if ( slot.name == 'pre-top-navigation-footer' )
      this.dispatchPreTopNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'top-navigation' )
      this.dispatchTopNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'post-top-navigation-footer' )
      this.dispatchPostTopNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'pre-bottom-navigation-footer' )
      this.dispatchPreBottomNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'bottom-navigation' )
      this.dispatchBottomNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'post-bottom-navigation-footer' )
      this.dispatchPostBottomNavigationAddedEvent( slot, element_detail );
    else if ( slot.name == 'page-footer' )
      this.dispatchPageFooterAddedEvent( slot, element_detail );
  }

  dispatchDidRemoveElementEvent( slot, element_detail = { /* index: node */ } ) {
    super.dispatchDidRemoveElementEvent( slot, element_detail );
    if ( slot.name === '' )
      this.dispatchPageRemovedEvent( slot, element_detail );
    else if ( slot.name == 'page-header' )
      this.dispatchHeaderRemovedEvent( slot, element_detail );
    else if ( slot.name == 'pre-top-navigation' )
      this.dispatchPreTopNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'top-navigation' )
      this.dispatchTopNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'post-top-navigation' )
      this.dispatchPostTopNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'pre-bottom-navigation' )
      this.dispatchPreBottomNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'bottom-navigation' )
      this.dispatchBottomNavigationRemovedEvent( slot, element_detail );
    else if ( slot.name == 'post-bottom-navigation' )
      this.dispatchPostBottomNavigationRemovedEvent( slot, element_detail );
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
      if ( this_element.selected ) {
        this.selectedPage = this_element;
      }
      else
        this_element.invisible = true;
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

  dispatchPreTopNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_top_navigation_added_event = new CustomEvent(
      'pre_top_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_top_navigation_added_event);
  }

  dispatchPreTopNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_navigation_removed_event = new CustomEvent(
      'pre_top_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_top_navigation_removed_event);
  }

  dispatchTopNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let top_navigation_added_event = new CustomEvent(
      'top_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(top_navigation_added_event);
  }

  dispatchTopNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let top_navigation_removed_event = new CustomEvent(
      'top_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(top_navigation_removed_event);
  }

  dispatchPostTopNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_added_event = new CustomEvent(
      'post_top_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_top_navigation_added_event);
  }

  dispatchPostTopNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_removed_event = new CustomEvent(
      'post_top_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_top_navigation_removed_event);
  }

  dispatchPreBottomNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_bottom_navigation_added_event = new CustomEvent(
      'pre_bottom_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_bottom_navigation_added_event);
  }

  dispatchPreBottomNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let pre_navigation_removed_event = new CustomEvent(
      'pre_bottom_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(pre_bottom_navigation_removed_event);
  }

  dispatchBottomNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let navigation_added_event = new CustomEvent(
      'bottom_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(bottom_navigation_added_event);
  }

  dispatchBottomNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let navigation_removed_event = new CustomEvent(
      'bottom_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(bottom_navigation_removed_event);
  }

  dispatchPostBottomNavigationAddedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_added_event = new CustomEvent(
      'post_bottom_navigation_added',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_bottom_navigation_added_event);
  }

  dispatchPostBottomNavigationRemovedEvent( slot, element_detail = { /* index: node */ } ) {
    let post_navigation_removed_event = new CustomEvent(
      'post_bottom_navigation_removed',
      { detail: { slot: slot, elements: element_detail } }
    );
    this.dispatchEvent(post_bottom_navigation_removed_event);
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
  *  Elements  *
  *************/

  get topNavigation() {
    if ( ! this._topNavigation )
      this._topNavigation = this.unshadowRoot.querySelector('div.top-navigation');
    return this._topNavigation;
  }

  get topNavigationSlot() {
    if ( ! this._topNavigationSlot )
      this._topNavigationSlot = this.unshadowRoot.querySelector('slot.top-navigation');
    return this._topNavigationSlot;
  }

  get bottomNavigation() {
    if ( ! this._bottomNavigation )
      this._bottomNavigation = this.unshadowRoot.querySelector('div.bottom-navigation');
    return this._bottomNavigation;
  }

  /*********************
  *  Dyanmic Template  *
  *********************/

  createToolButton( tool ) {
    let label = tool.label ? tool.label : tool.constructor.name;
    let identifier = tool.identifier ? tool.identifier : tool.tagName;

    let fragment = document.createDocumentFragment();
    let template = this.templatedToolButton( tool, label, identifier );
    render( template, fragment, { eventContext: this } );
    return fragment.firstElementChild;
  }

  toolButtonClickHandler( event ) {

  }

  templatedToolButton( tool, label, identifier ) {
    return html`<a href slot="top-navigation" class="navigation-button ${identifier}" @click="${(event) => {
      event.preventDefault();
      tool.selected = true;
    }}" >${label}</a>`;
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

  get templatedPreTopNavigation() {
    return this.templatedSlot('pre-top-navigation');
  }

  get templatedTopNavigation() {
    return html`<div class="top-navigation navigation">${this.templatedSlot('top-navigation')}</div>`;
  }

  get templatedPostTopNavigation() {
    return this.templatedSlot('post-top-navigation');
  }

  get templatedPreBottomNavigation() {
    return this.templatedSlot('pre-bottom-navigation');
  }

  get templatedBottomNavigation() {
    // return this.templatedSlot('bottom-navigation');
    return html`<div class="bottom-navigation navigation">${this.templatedNavigationElements}</div>`;
  }

  get templatedPostBottomNavigation() {
    return this.templatedSlot('post-bottom-navigation');
  }

  get templatedNavigationElements() {
    return this.linearNavigation ?
html`
${this.templatedLinearNavigation}
${this.templatedSlot('navigation', undefined)}
` :
html`${this.templatedSlot('navigation', undefined)}`;
  }

  get templatedPageFooter() {
    return this.templatedSlot('page-footer');
  }

  get templatedLinearNavigation() {
    return html`
${this.templatedBackButton()}
${this.templatedNextButton()}
`;
  }

  templatedBackButton() {
    return html`<a data-page-back="${this.previousPageNumber}" class="navigation-button back" @click="${this.backWasClicked}" >Back</a>`;
  }

  templatedNextButton() {
    return html`<a data-page-next="${this.nextPageNumber}" class="navigation-button next" @click="${this.nextWasClicked}">${this.nextButtonLabel}</a>`;
  }

  render() {
    return html`
${this.templatedCSSLinks()}
${this.templatedHeader}
${this.templatedPreTopNavigation}
${this.templatedTopNavigation}
${this.templatedPostTopNavigation}
${this.templatedPageContent}
${this.templatedPreBottomNavigation}
${this.templatedBottomNavigation}
${this.templatedPostBottomNavigation}
${this.templatedPageFooter}
`;
  }

}

export { CCCPageController,
         LitElement, html, render,
         Mixin, mix }
