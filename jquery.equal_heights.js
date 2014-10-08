/**
 * Equal Heights Plugin
 * Equalize the heights of all child elements to the tallest child
 *
 * @param object options
 *   - filter: An optional selector string to filter which children are considered.
 *   - not: An optional selector string to filter which children are NOT considered.
 *   - target: Additional selector of targets where height will be applied; these nodes
     will not be used to calculate height, but will ONLY receive the calculated
     height.
     - once: bool: Only allow each dom element to be processed 'once' by this
       function. When processed, elements receive the class
       'equal-heights-processed'. When once is set to false, this class is
       ignored. When true, elements with this class will not be reprocessed.
     - reset: bool: should the heights be removed on children before calculating
       auto heights? This removes the inline height value and allows the node to
       be auto sized.  You might set this to true when responsive is false.
     - disable: bool: Reset the height AND return without applying
       equal-heights. Use this to reverse the effects of this plugin on earlier
       elements.
     - responsive: bool: should this be applied when viewport changes size?
     - delay: milliseconds to wait before applying height after viewport changes

 *
 * Usage: $(object).equalHeights();
 *        $(object).equalHeights({filter: 'h2'});
 *
 * The second example above will process only h2 children
 *
 * @author Aaron Klump, In the Loft Studios, LLC
 * @see http://www.intheloftstudios.com
 *
 */
(function($) {
  $.fn.equalHeights = function(options) {
    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'filter'      : null,
      'not'         : null,
      'target'      : null,
      'once'        : true,
      'reset'       : false,
      'disable'     : false,
      'responsive'  : true,
      'delay'       : 25,
    }, options);
    var tallest = 0;
    var $parent = $(this);
    var $nodes = $parent.children();
    var $target = $();
    if (settings.target) {
      $target = $parent.find(settings.target);
    }
    if (settings.filter) {
      $nodes = $nodes.filter(settings.filter);
    }
    if (settings.not) {
      $nodes = $nodes.not(settings.not);
    }
    if (settings.once) {
      $nodes = $nodes.not('equal-heights-processed')
    }
    if ($nodes.length == 1) {
      return $(this);
    }
    // Reset height to allow for auto heights
    if (settings.reset || settings.disable) {
      $nodes.add($target).height('');
    }
    // Return here if disabling
    if (settings.disable) {
      return $(this);
    }
    // Find the tallest
    $nodes.each(function(){
      var $node = $(this);
      var height = $node.outerHeight();
      tallest = Math.max(tallest, height);
    });
    // Add additional targets, which we don't use to calculate heights
    if (settings.target) {
      $nodes = $nodes.add($target);
    }

    var processedClass = 'equal-heights-processed';
    // Apply the height
    $nodes
    .addClass(processedClass)
    .height(tallest);

    // Set this up to fire on responsive resize, if requested
    if (settings.responsive) {
      var timeout;
      $(window).bind('resize', function(e) {
        // Don't create a new timeout if we're already on one; that's bad
        if (!timeout) {
          timeout = setTimeout(function(){
            settings.reset = true;
            return $parent.equalHeights(settings);
          }, settings.delay);
        }
      });
    }

    $parent.addClass(processedClass);
    return $(this);
  }
})(jQuery);
