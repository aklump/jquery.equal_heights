/**
 * Equal Heights jQuery JavaScript Plugin v1.0.0
 * http://www.intheloftstudios.com/packages/js/equal_heights
 *
 * Equalize the heights of all child elements to the tallest child.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Wed Oct  8 15:30:02 PDT 2014
 *
 * Equalize the heights of all child elements to the tallest child.
 *   - filter: An optional selector string to filter which children are considered.
 *   - not: An optional selector string to filter which children are NOT considered.
 *   - target: Additional selector of targets where height will be applied; these nodes
 *     will not be used to calculate height, but will ONLY receive the calculated height
 *   - once: bool: Only allow each dom element to be processed 'once' by this
 *     function. When processed, elements receive the class
 *     'equal-heights-processed'. When once is set to false, this class is
 *     ignored. When true, elements with this class will not be reprocessed.
 *   - disable: bool: Reset the height AND return without applying
 *     equal-heights. Use this to reverse the effects of this plugin on earlier
 *     elements.
 *   - responsive: bool: should this be applied when viewport changes size?
 *   - delay: milliseconds to wait before applying height after viewport changes
 *
 * Usage: $(object).equalHeights();
 *        $(object).equalHeights({filter: 'h2'});
 *
 * The second example above will process only h2 children
 */
;(function($, window, document, undefined) {
"use strict";

// The actual plugin constructor
function EqualHeights(element, options) {
  this.element = element;
  this.options = $.extend( {}, $.fn.equalHeights.defaults, options);
  
  if (!this.init()) {
    return this;
  }

  if (this.options.disable) {
    this.reset();
    return this;
  };

  this.apply();

  // Make it responsive
  if (this.options.responsive) {
    
    var timer;
    var instance = this;
    
    $(window).bind('resize', function() {
      if (timer) {
        clearTimeout(timer)
      };
      timer = setTimeout(function(){
        instance.reset();
        instance.apply();
      }, instance.options.delay);
    });    
  };
  
  return this;
}

/**
 * Initialize variables and determine how many items we have to affect.
 *
 * @return {bool} FALSE if there is nothing to do.
 */
EqualHeights.prototype.init = function () {
  this.targets = null;
  
  // Get our sample to measure for tallest.
  this.total = 0;

  var $children = $(this.element)
  .children();
  // .not(this.options.cssPrefix + '-processed').children();

  this.sample = this.filterElements($children);
  this.extras = null;
  
  this.total += this.sample.length;
  if (this.options.target) {
    this.extras = $children.find(this.options.target);
    this.extras = this.filterElements(this.extras);
    this.total += this.extras.length;
  };

  $(this.element).addClass(this.options.cssPrefix + '-processed');
  
  // Nothing to do if we don't have more than one element.
  if (this.total < 2) {
    return false
  }

  this.targets = this.sample.add(this.extras);

  return true;
};

/**
 * Removes equal heights and classes from this.element and targets.
 *
 * @return {object} this
 */
EqualHeights.prototype.reset = function () {
  var cssPrefix = this.options.cssPrefix;
  this.element.removeClass(cssPrefix + '-processed');
  this.targets.height('').removeClass(cssPrefix + '-target');

  return this;
}

/**
 * Applies the target class/equal height to this.targets.
 *
 * @return {object} this
 */
EqualHeights.prototype.apply = function () {
  var cssPrefix = this.options.cssPrefix;

  // Find the tallest.
  var tallest = 0;
  this.sample.each(function(){
    var height = $(this).outerHeight();
    tallest = Math.max(tallest, height);
  });

  // Now, apply the heights/class to the targets.
  this.targets
  .addClass(cssPrefix + '-target')
  .height(tallest); 

  return this; 
}

/**
 * Filters a set of jquery elements using this.options
 *
 * @param  {jQuery} $elements
 *
 * @return {jQuery}
 */
EqualHeights.prototype.filterElements = function($elements) {
  if (this.options.filter) {
    $elements = $elements.filter(this.options.filter);
  }
  if (this.options.not) {
    $elements = $elements.not(this.options.not);
  }
  if (this.options.once) {
    $elements = $elements.not(this.options.cssPrefix + '-processed');
    $elements = $elements.not(this.options.cssPrefix + '-target');
  }

  return $elements;
}

$.fn.equalHeights = function(options) {
  new EqualHeights(this, options);

  return this;
};

$.fn.equalHeights.defaults = {
  
  // jQuery selector to apply as .filter() to the children of the element.
  'filter'            : null,

  // jQuery selector to apply as .not() to the children of the element.
  'not'               : null,

  // jQuery selector to select elements that will be targetted but not measured.
  'target'            : null,

  // // Boolean to know if the previous height should be first removed.
  // 'reset'             : false,

  // Used to reverse the effects of a previous equalHeights call.
  'disable'           : false,

  // For responsiveness you may use
  'responsive'        : false,

  // Because a window may be changing size rapidly, you should set a delay
  // before we apply things, so that this doesn't fire for every pixel.  The
  // default is a reasonable choice.
  'delay'             : 10,
  
  // A prefix for all css classes
  "cssPrefix"         : 'equal-heights'  
};

$.fn.equalHeights.version = function() { return '1.0.0'; };

})(jQuery, window, document);