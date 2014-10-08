QUnit.test("Assert responsive works as expected.", function(assert) {
  var $group = $('#group7');

  $group.before('<p>You will need to manually resize browser past 600px breakpoint and reload to test for responsive. Watch for changes to height of the green squares, then reload tests.</p>');
  
  $group.equalHeights({
    "responsive": true,
    "target": ".inner"
  });

  var shimHeight = 36;
  if ($(window).width() < 600) {
    shimHeight = 86
  };
  assert.strictEqual($('#item19').height(), shimHeight, 'child has correct height of ' + shimHeight);
});

QUnit.test("Assert disable removes heights from targets.", function(assert) {
  var $group = $('#group6');
  var shimHeight = $group.find('.shim').outerHeight();
  
  $group.equalHeights();
  assert.strictEqual($('#item16').height(), shimHeight, 'child has correct height');

  $group.equalHeights({'disable': true});
  assert.strictEqual($group.hasClass('equal-heights-processed'), false, 'Processed class has been removed from element');
  assert.notStrictEqual($('#item16').height(), shimHeight, 'child has natural height');
});

QUnit.test("Assert height is also applied to target", function(assert) {
  var $group = $('#group5');
  var shimHeight = $group.find('.shim').outerHeight();

  $group.equalHeights({
    'target': '.inner'
  });

  assert.ok($group.hasClass('equal-heights-processed'), 'Processed class is added to element');
  assert.strictEqual($group.find('.equal-heights-target').length, 6, 'No children receive target class');

  assert.strictEqual($('#item12').height(), shimHeight, 'child has correct height');
  assert.strictEqual($('#item12 .inner').height(), shimHeight, 'target has correct height');
});


QUnit.test("Assert height is not applied to a 'not' item", function(assert) {
  var $group = $('#group4');
  $group.equalHeights({
    'not': '#item9'
  });
  assert.ok($group.hasClass('equal-heights-processed'), 'Processed class is added to element');
  assert.strictEqual($group.find('.equal-heights-target').length, 2, 'No children receive target class');
  assert.strictEqual($('#item9.equal-heights-target').length, 0, 'Not child does not receive target class');
  assert.notStrictEqual($('#item9').height(), $('#item8').height(), 'not child does not have equal height to processed child.');
});

QUnit.test("Assert no height is applied with a single child due to filter", function(assert) {
  var $group = $('#group3');
  $group.equalHeights({
    'filter': '#item5'
  });
  assert.ok($group.hasClass('equal-heights-processed'), 'Processed class is added to element');
  assert.strictEqual($group.find('.equal-heights-target').length, 0, 'No children receive target class');
});

QUnit.test("Assert height is applied with multiple children.", function(assert) {
  var $group = $('#group2');
  var shimHeight = $group.find('.shim').outerHeight();
  
  $group.equalHeights();
  assert.ok($group.hasClass('equal-heights-processed'), 'Processed class is added to element');
  
  assert.strictEqual($('#item2').height(), shimHeight, 'Child 1 receives inline height');
  assert.strictEqual($('#item2.equal-heights-target').length, 1, 'Child 1 receives target class');
  
  assert.strictEqual($('#item3').height(), shimHeight, 'Child 2 receives inline height');
  assert.strictEqual($('#item3.equal-heights-target').length, 1, 'Child 2 receives target class');
  
  assert.strictEqual($('#item4').height(), shimHeight, 'Child 3 receives inline height');
  assert.strictEqual($('#item4.equal-heights-target').length, 1, 'Child 3 receives target class');  
});

QUnit.test("Assert no height is applied with a single child.", function(assert) {
  $('#group1').equalHeights();
  assert.strictEqual($('#group1.equal-heights-processed').length, 1, 'Processed class is added to element');
  assert.ok(typeof $('#item1').attr('height') === 'undefined', 'Child does not receive an inline height');
  assert.strictEqual($('#item1.equal-heights-target').length, 0, 'Child does not receive target class');
});


//
//
// Helper functions go here.

function resetDom() {
  $('div')
  .removeClass('equal-heights-processed')
  .removeClass('equal-heights-target')
  .not('.inner')
  .height('');  
}

// QUnit.testStart(function () {
//   resetDom();
// })

// QUnit.testStart(function () {

//   // Removes height and classes.
//   $('div').not('.inner')
//   .removeClass('equal-heights-target')
//   .removeClass('equal-heights-processed')
//   .height('');  
// });

// QUnit.testDone(function (details) {
//   $('div')
//   .removeClass('equal-heights-processed')
//   .removeClass('equal-heights-target')
//   .not('.inner')
//   .height('');
// })