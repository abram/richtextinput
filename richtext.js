var richtext = {};

richtext.DEBUG = true;

richtext.log = function() {
  if (richtext.DEBUG && window.console && window.console.log) {
    window.console.log.apply(window.console, arguments);
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