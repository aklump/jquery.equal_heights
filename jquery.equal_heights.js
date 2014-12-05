/**
 * Equal Heights jQuery JavaScript Plugin v2.0.4
 * http://www.intheloftstudios.com/packages/js/jquery.equal_heights
 *
 * Equalize the heights of all child elements to the tallest child.
 *
 * Copyright 2013, Aaron Klump
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thu Oct  9 15:03:34 PDT 2014
 *
 * Equalize the heights of all child elements to the tallest child.
 *   - filter: An optional selector string to filter which children are considered.
 *   - not: An optional selector string to filter which children are NOT considered.
 *   - target: Additional selector of targets where height will be applied; these nodes
 *     will not be used to calculate height, but will ONLY receive the calculated height
 *   - find: Used to target descendents that are deep inside the container, 
 *     rather than children.
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

  // We really only care about this for the first pass.  If we're going to
  // apply responsive then this has to be set to false.  So we capture its
  // value and then set the options value to false.
  var disable = this.options.disable;

  // Make it responsive
  if (this.options.responsive) {
    this.options.disable = false;
    var instance = this;
    $(window).bind('resize', function() {
      clearTimeout(instance.responsiveTimer);
      instance.responsiveTimer = setTimeout(function(){
        instance.respond($(window).width());
      }, instance.options.delay);
    });
  }

  // Now handle this pass.
  if (disable) {
    this.reset();
    return this;
  }
  this.respond();
  
  return this;
}

EqualHeights.prototype.respond = function(width) {
  if (this.options.reset) {
    this.reset();
  }
  this.apply();
};

/**
 * Figures out the sample, extras and target elements.
 *
 * @return {bool} FALSE if there is nothing to do (only one element).
 */
EqualHeights.prototype.init = function () {

  var self = this;
  
  // This will count the number of targets.
  this.length = 0;

  // This will hold the max height.
  this.height = null;

  // Holds our reponsive timer object.
  this.responsiveTimer = null;

  if ($(this.element).length === 0) {
    return false;
  }

  var cssPrefix = this.options.cssPrefix;
  this.targets = null;
  

  var $sample = null;
  $(this.element).each(function () {
    
    var $merge = null;
    if (self.options.find) {
      $merge = $(this).find(self.options.find);
    }
    else {
      $merge = $(this).children();
    }

    if ($sample === null) {
      $sample = $merge;
    }
    else {
      $.merge($sample, $merge);
    }

  });
  this.sample = this.filterElements($sample);
  this.extras = null;
  
  this.length += this.sample.length;
  if (this.options.target) {
    this.extras = $(this.element).find(this.options.target);
    this.length += this.extras.length;
  }
  
  // Nothing to do if we don't have more than one element.
  if (this.length < 2) {
    return false;
  }

  this.targets = this.sample.add(this.extras);

  // Store any inline height attributes as data.
  if (!this.element.hasClass(cssPrefix + 'processed')) {
    this.targets.each(function () {
      var style = $(this).attr('style');
      var height;
      if (style && (height = style.match(/height[ :]+(\d+)/))) {
        $(this).data(cssPrefix + 'original', height[1]);
      }
    });
  }

  $(this.element).addClass(cssPrefix + 'processed');
  
  return true;
};

/**
 * Removes equal heights and classes from this.element and targets.
 *
 * @return {object} this
 */
EqualHeights.prototype.reset = function () {
  var cssPrefix = this.options.cssPrefix;
  this.targets.height('').removeClass(cssPrefix + 'target');

  // Apply any original style attributes
  var data;
  this.targets.each(function () {
    if ((data = $(this).data(cssPrefix + 'original'))) {
      $(this).height(data);
    }
  });

  return this;
};

/**
 * Applies the target class/equal height to this.targets.
 *
 * @return {object} this
 */
EqualHeights.prototype.apply = function () {
  
  // Apply the beforeApply callback and possible halt application.
  var execute = true;
  if (typeof this.options.beforeApply !== 'undefined') {
    execute = this.options.beforeApply(this, $(window).width());
  }
  if (!execute) {
    return;
  }

  var cssPrefix = this.options.cssPrefix;

  // Find the tallest.
  var tallest = this.options.minHeight;
  this.sample.each(function(){
    var height = $(this).outerHeight();
    tallest = Math.max(tallest, height);
  });

  // Now, apply the heights/class to the targets.
  this.targets
  .addClass(cssPrefix + 'target')
  .height(tallest);

  this.height = tallest;

  if (typeof this.options.afterApply !== 'undefined') {
    this.options.afterApply(this, $(window).width());
  }

  return this;
};

/**
 * Filters a set of jquery elements using this.options
 *
 * @param  {jQuery} $elements
 *
 * @return {jQuery}
 */
EqualHeights.prototype.filterElements = function($elements) {
  if ($elements !== null) {
    if (this.options.filter) {
      $elements = $elements.filter(this.options.filter);
    }
    if (this.options.not) {
      $elements = $elements.not(this.options.not);
    }
  }

  return $elements;
};

$.fn.equalHeights = function(options) {
  var instance = new EqualHeights(this, options);
  var key = instance.options.key === null ? $.fn.equalHeights.instances.length : instance.options.key;
  $.fn.equalHeights.instances[key] = instance;
  
  return instance;
};

$.fn.equalHeights.instances = [];

$.fn.equalHeights.defaults = {

  // Passing a unique key will register this instance using this key so it
  // can be accessed: $.fn.equalHeights.instances.myKey, where key = 'myKey'
  // from any other script.
  'key'               : null,

  // The minimum height to be calculated.
  'minHeight'         : 0,

  // jQuery selector to use when the children are not direct.  Use this to
  // target deeper children nested inside when .children(). would fail.
  'find'              : null,
  
  // jQuery selector to apply as .filter() to the children of the element.
  'filter'            : null,

  // jQuery selector to apply as .not() to the children of the element.
  'not'               : null,

  // jQuery selector to select elements that will be targetted but not measured.
  'target'            : null,

  // Used to reverse the effects of a previous equalHeights call.  This can
  // also be a function in which case it will receive the following parameters:
  // (windowWidth).
  'disable'           : false,

  // Buried this option because it should always been true, but leaving it
  // here for that fringe case that sneaks up,
  'reset'             : true,

  // For responsiveness you may use
  'responsive'        : false,

  // A callback to fire just before applying heights.  Takes the object and the
  // window width as arguments.  Return false to stop normal application.  This
  // is useful to control the responsive application based on window width.
  // You may also use this to hijack the height application and write your own
  // version of the apply method.
  'beforeApply'       : function(eh, width) {
    return true;
  },

  // A function that is called after .apply().  You can use this to manipulate
  // the options based on the results, say to set the minHeight based on the
  // discovered height.
  'afterApply'        : function(eh, width) {
    return true;
  },

  // Because a window may be changing size rapidly, you should set a delay
  // before we apply things, so that this doesn't fire for every pixel.  The
  // default is a reasonable choice.  The lower the number the smoother the
  // operation, but the more processor intensive.
  'delay'             : 25,
  
  // A prefix for all css classes
  "cssPrefix"         : 'eqh-'
};

$.fn.equalHeights.version = function() { return '2.0.4'; };

})(jQuery, window, document);