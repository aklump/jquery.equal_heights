QUnit.test("Assert using '.each()' produces group-specific, equalized heights.", function(assert) {
  var $group = $('#group12');
  $group.find('.subgroup').each(function () {
    $(this).equalHeights();
  });
  assert.strictEqual($('#item31').height(), 100, 'Child height is uniform');
  assert.strictEqual($('#item32').height(), 100, 'Child height is uniform');
  assert.strictEqual($('#item33').height(), 60, 'Child height is uniform');
  assert.strictEqual($('#item34').height(), 60, 'Child height is uniform');
  assert.strictEqual($('#item35').height(), 30, 'Child height is uniform');
  assert.strictEqual($('#item36').height(), 30, 'Child height is uniform');
});

QUnit.test("Assert that not using each produces uniform height.", function(assert) {
  var $group = $('#group10');
  var shimHeight = 100;
  $group.find('.subgroup').equalHeights();
  assert.strictEqual($('#item23').height(), shimHeight, 'Child height is uniform');
  assert.strictEqual($('#item24').height(), shimHeight, 'Child height is uniform');
  assert.strictEqual($('#item25').height(), shimHeight, 'Child height is uniform');
  assert.strictEqual($('#item26').height(), shimHeight, 'Child height is uniform');
  assert.strictEqual($('#item27').height(), shimHeight, 'Child height is uniform');
  assert.strictEqual($('#item28').height(), shimHeight, 'Child height is uniform');
});

QUnit.test("Assert that our init preserves inline heights.", function(assert) {
  $group = $('#group11');
  var shimHeight = $('#item29').outerHeight();
  $group.equalHeights({"disable": true});
  assert.strictEqual($('#item29').height(), shimHeight, 'Inline height was preserved.');
});

QUnit.test("Assert beforeApply() callback functions correctly.", function(assert) {
  var $group = $('#group9');
  var shimHeight = $group.find('.shim').outerHeight();
  $group.equalHeights({
    "responsive": true,
    "beforeApply": function (eh, width) {
      return width > 600;
    }
  });

  var unapplied = $(window).width() < 600;
  if (unapplied) {
    assert.strictEqual($group.find('.eqh-target').length, 0, 'No targets because window is less than 600px.');
    assert.strictEqual($('#item20').height(), shimHeight, 'child 1 has correct, natural height');
    assert.notStrictEqual($('#item21').height(), shimHeight, 'child 2 has correct, natural height');
    assert.notStrictEqual($('#item22').height(), shimHeight, 'child 3 has correct, natural height');
  }
  else {
    assert.strictEqual($group.find('.eqh-target').length, 3, '3 targets because window is >= 600px.');
    assert.strictEqual($('#item20').height(), shimHeight, 'child 1 has correct, equal height');
    assert.strictEqual($('#item21').height(), shimHeight, 'child 2 has correct, equal height');
    assert.strictEqual($('#item22').height(), shimHeight, 'child 3 has correct, equal height');
  }
  
});

QUnit.test("Assert complex example using filter and target.", function(assert) {
  var $group = $('#group8');
  $group.equalHeights({
    "filter": '.column',
    "target": '.column-inner',
    "responsive": true
  });
  assert.ok($group.find('.first').hasClass('eqh-target'), 'First filtered element has target class.');
  assert.ok($group.find('.first .column-inner').hasClass('eqh-target'), 'First target element has target class.');
  assert.ok($group.find('.second').hasClass('eqh-target'), 'Second filtered element has target class.');
  assert.ok($group.find('.second .column-inner').hasClass('eqh-target'), 'Second target element has target class.');
});

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
  // assert.strictEqual($group.hasClass('eqh-processed'), false, 'Processed class has been removed from element');
  assert.notStrictEqual($('#item16').height(), shimHeight, 'child has natural height');
});

QUnit.test("Assert height is also applied to target", function(assert) {
  var $group = $('#group5');
  var shimHeight = $group.find('.shim').outerHeight();

  $group.equalHeights({
    'target': '.inner'
  });

  assert.ok($group.hasClass('eqh-processed'), 'Processed class is added to element');
  assert.strictEqual($group.find('.eqh-target').length, 6, 'No children receive target class');

  assert.strictEqual($('#item12').height(), shimHeight, 'child has correct height');
  assert.strictEqual($('#item12 .inner').height(), shimHeight, 'target has correct height');
});


QUnit.test("Assert height is not applied to a 'not' item", function(assert) {
  var $group = $('#group4');
  $group.equalHeights({
    'not': '#item9'
  });
  assert.ok($group.hasClass('eqh-processed'), 'Processed class is added to element');
  assert.strictEqual($group.find('.eqh-target').length, 2, 'No children receive target class');
  assert.strictEqual($('#item9.eqh-target').length, 0, 'Not child does not receive target class');
  assert.notStrictEqual($('#item9').height(), $('#item8').height(), 'not child does not have equal height to processed child.');
});

QUnit.test("Assert no height is applied with a single child due to filter", function(assert) {
  var $group = $('#group3');
  $group.equalHeights({
    'filter': '#item5'
  });
  assert.strictEqual($group.hasClass('eqh-processed'), false, 'Processed class was not added to element');
  assert.strictEqual($group.find('.eqh-target').length, 0, 'No children receive target class');
});

QUnit.test("Assert height is applied with multiple children.", function(assert) {
  var $group = $('#group2');
  var shimHeight = $group.find('.shim').outerHeight();
  
  $group.equalHeights();
  assert.ok($group.hasClass('eqh-processed'), 'Processed class is added to element');
  
  assert.strictEqual($('#item2').height(), shimHeight, 'Child 1 receives inline height');
  assert.strictEqual($('#item2.eqh-target').length, 1, 'Child 1 receives target class');
  
  assert.strictEqual($('#item3').height(), shimHeight, 'Child 2 receives inline height');
  assert.strictEqual($('#item3.eqh-target').length, 1, 'Child 2 receives target class');
  
  assert.strictEqual($('#item4').height(), shimHeight, 'Child 3 receives inline height');
  assert.strictEqual($('#item4.eqh-target').length, 1, 'Child 3 receives target class');  
});

QUnit.test("Assert no height is applied with a single child.", function(assert) {
  var $group = $('#group1');
  $group.equalHeights();
  assert.strictEqual($group.hasClass('eqh-processed'), false, 'Processed class was not added to element');
  assert.ok(typeof $('#item1').attr('height') === 'undefined', 'Child does not receive an inline height');
  assert.strictEqual($('#item1.eqh-target').length, 0, 'Child does not receive target class');
});


//
//
// Helper functions go here.

function resetDom() {
  $('div')
  .removeClass('eqh-processed')
  .removeClass('eqh-target')
  .not('.inner')
  .height('');  
}

// QUnit.testStart(function () {
//   resetDom();
// })

// QUnit.testStart(function () {

//   // Removes height and classes.
//   $('div').not('.inner')
//   .removeClass('eqh-target')
//   .removeClass('eqh-processed')
//   .height('');  
// });

// QUnit.testDone(function (details) {
//   $('div')
//   .removeClass('eqh-processed')
//   .removeClass('eqh-target')
//   .not('.inner')
//   .height('');
// })