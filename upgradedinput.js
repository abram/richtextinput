
richtext.UpgradedInput = function(inputElement) {
  if (inputElement.type != 'text') {
    throw "UpgradeInput can only upgrade text inputs";
  }
  this.inputElement = inputElement;
  richtext.Input.call(this);
}
richtext.UpgradedInput.prototype = new richtext.Input();
richtext.UpgradedInput.prototype.constructor = richtext.UpgradedInput;

richtext.UpgradedInput.prototype.createInputElement_ = function() {
  return this.inputElement_;
};

richtext.UpgradedInput.prototype.render = function() {
  richtext.Input.prototype.render.call(this);
  this.containerElement.className = 'richtext-upgraded';

  this.inputElement.parentNode.insertBefore(this.containerElement,
					    this.inputElement);

  richtext.UpgradedInput.copyStyles(this.inputElement,
			    this.editableElement,
			    richtext.UpgradedInput.TEXTINPUT_STYLES);

  var nativePadding = richtext.UpgradedInput.getNativePadding(
	this.inputElement.tagName);

  this.containerElement.style.width =
      this.inputElement.clientWidth - (nativePadding * 2) + 'px';
  this.containerElement.style.height =
      this.inputElement.clientHeight + 'px'; // (nativePadding * 2) + 'px';

  var self = this;
  this.inputElement.onfocus = function() { 
    self.editableElement.focus();
  }
  this.inputElement.onkeydown = function() {
    self.editableElement.focus(); return false; 
  };
  this.inputElement.onmousedown = function() {
    self.editableElement.focus(); return false; 
  };
  this.inputElement.unselectable = 'on';
  this.inputElement.tabIndex = "-1";

  this.containerElement.style.position = 'absolute';
  var originalInputPosition = richtext.getAbsolutePosition(this.inputElement);

  this.containerElement.style.top = 
      originalInputPosition.top + nativePadding + 'px';
  this.containerElement.style.left =
      originalInputPosition.left + nativePadding + 'px';
  richtext.log('positioned using', originalInputPosition.top, originalInputPosition.left, nativePadding)

  this.inputElement.style.color = richtext.UpgradedInput.getCurrentStyles(
    this.inputElement, ['backgroundColor']).backgroundColor;
  
  this.setText(this.inputElement.value);
};

richtext.UpgradedInput.getNativePadding = function(tagName) {
  var testElement = document.createElement(tagName);
  testElement.style.fontFamily = 'monospace';
  testElement.style.fontSize = '10px';
  testElement.style.position = 'absolute';
  testElement.style.lineHeight = '10px';
  //testElement.style.top = '-100px';
  testElement.value = 'xxxxx12345';
  document.body.appendChild(testElement);
  testElement.size = testElement.maxLength = 10;
  var testElement2 = document.createElement('div');
  testElement2.style.fontFamily = 'monospace';
  testElement2.style.fontSize = '10px';
  testElement2.style.lineHeight = '10px';
  testElement2.style.position = 'absolute';
  testElement2.innerHTML = 'xxxxx12345';
  document.body.appendChild(testElement2);
  var padding = (testElement.offsetHeight - testElement2.offsetHeight) / 2;
  document.body.removeChild(testElement);
  document.body.removeChild(testElement2);
  return padding;
};

richtext.UpgradedInput.getCurrentStyles = function(element, styleNames) {
  var currentStyle;
  if (element.currentStyle) {
    currentStyle = element.currentStyle;
  } else {
    currentStyle = document.defaultView.getComputedStyle(element, null);
  }
  var results = {};
  for (var i = 0; i < styleNames.length; i++) {
    var styleName = styleNames[i];
    results[styleName] = currentStyle[styleName];
  }
  return results;
};

richtext.UpgradedInput.copyStyles = function(sourceElement, targetElement, styleNames) {
  var sourceValues = richtext.UpgradedInput.getCurrentStyles(sourceElement,
							     styleNames);
  for (var styleName in sourceValues) {
    targetElement.style[styleName] = sourceValues[styleName];
  }
};

richtext.UpgradedInput.TEXTINPUT_STYLES = [
  'fontFamily',
  'fontWeight',
  'fontSize',
  'color',
  'textDecoration',
  'letterSpacing',
  'lineHeight',
  'position',
  'left',
  'right',
  'float',
  'verticalAlign',
  'outlineColor',
  'outlineStyle',
  'outlineWidth'
];
