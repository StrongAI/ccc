import { Selector, ClientFunction } from 'testcafe';
import { CCCSlottedObjectMixin } from '../component/ccc-slotted-object-mixin.js';
import { CCCElement,
         LitElement, html, render,
         Mixin, mix } from '../component/ccc-element.js';

fixture `CCCSlottedObjectMixin`;

class CCCSlottedTestObject extends mix(CCCElement).with(CCCSlottedObjectMixin) {
  static get tagName()  { return 'ccc-slotted-test-object'; }

}

test( 'added', async test => {
  document.create('ccc-slotted-test-object');
  // const consumes_children_element = await Selector('#consumes-children')();
  // await test.expect(consumes_children_element.hasMovedEmbeddedElements).eql(true);
  // await test.expect(consumes_children_element.childElementCount).eql(0);
});
