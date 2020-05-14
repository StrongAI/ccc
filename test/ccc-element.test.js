import { Selector, ClientFunction } from 'testcafe';

fixture `CCCElement`
  .page `http://localhost/test/test.html`;

// test( 'migrateEmbeddedElements-no-children', async test => {
//   const no_children_element = await Selector('#no-children')();
//   await test.expect(no_children_element.childElementCount).eql(0);
// });
//
// test( 'migrateEmbeddedElements-manages-children', async test => {
//   const manages_children_element = await Selector('#manages-children')();
//   await test.expect(manages_children_element.childElementCount).eql(1);
// });

test( 'migrateEmbeddedElements-manages-children', async test => {
  const consumes_children_element = await Selector('#consumes-children')();
  await test.expect(consumes_children_element.hasMovedEmbeddedElements).eql(true);
  // await test.expect(consumes_children_element.childElementCount).eql(0);
});
