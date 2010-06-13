var richtext = {};

richtext.DEBUG = true;

richtext.log = function() {
  if (richtext.DEBUG && window.console && window.console.log) {
    if (window.console.log.apply) {
      window.console.log.apply(window.console, arguments);
    } else { // IE 8
      window.console.log(
	Array.prototype.join.apply(arguments, [' ']));
    }
  }
};

richtext.makeBorderBox = function(element) {
  // Set to border-box box sizing
  var boxSizingProps = ['boxSizing', 'mozBoxSizing', 'webkitBoxSizing', 'msBoxSizing'];
  for (var i = 0; i < boxSizingProps.length; i++) {
    var boxSizingProp = boxSizingProps[i];
   if (typeof element.style[boxSizingProp] != 'undefined') {
     element.style[boxSizingProp] = 'border-box';
   }
  }
};

richtext.makeInlineBlock = function(element) {
  element.style.display = 'inline-block';
};

/*
 * Returns the element's position relative to the closest ancestor
 * that has position: relative or position: absolute;
 */
richtext.getAbsolutePosition = function(element) {
    var totalOffset = {left: element.offsetLeft, top: element.offsetTop};
    do {
	element = element.offsetParent;
	var computedStyle = element.currentStyle ? element.currentStyle :
	    document.defaultView.getComputedStyle(element, '');
	if (computedStyle.position == 'absolute' ||
	    computedStyle.position == 'relative') {
	    break;
	}
	totalOffset.left += element.offsetLeft;
	totalOffset.top += element.offsetTop;

    } while (element.offsetParent);
    return totalOffset;
};