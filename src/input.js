richtext.Input = function() {
  this.textStyles = [];
  this.render();
  this.charRange = new richtext.CharRange(this.editableElement);
};

richtext.Input.prototype.size = 10;

richtext.Input.prototype.formatter = null;

richtext.Input.prototype.onenterkey = function() { };

//richtext.Input.prototype.placeholder = '';

richtext.Input.prototype.render = function() {
  this.containerElement = document.createElement('div');
  this.containerElement.className = 'richtext-container';
  this.containerElement.style.overflow = 'hidden';
  richtext.makeInlineBlock(this.containerElement);
  richtext.makeBorderBox(this.containerElement);
  this.containerElement.style.width = this.size + 1 + 'em';

  this.editableElement = document.createElement('div');
  //richtext.makeInlineBlock(this.editableElement);
  this.editableElement.className = 'richtext';
  this.editableElement.style.width = "100000px"; // TODO: be reasonable
  this.editableElement.style.height = "1em";
  this.editableElement.style.lineHeight = "1em";

  this.containerElement.appendChild(this.editableElement);
  this.editableElement.contentEditable = true;
 
  this.createInputElement_();

  var self = this;

  this.editableElement.onfocus = function() {
    // select all text?
  };

  this.editableElement.onkeyup = function () {
    var value = self.getText();
    if (value != self.inputElement.value) {
      self.inputElement.value = value;
      self.format();
    }
  };

  this.editableElement.onkeypress = function(e) {
    if (e.keyCode == 13) { // Enter
      self.onenterkey();
      e.preventDefault();
    }
  };
};

richtext.Input.prototype.createInputElement_ = function() {
  var inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  this.containerElement.appendChild(inputElement);
  this.inputElement = inputElement;
};


richtext.Input.prototype.getText = function() {
  var text = (typeof this.editableElement.innerText != 'undefined') ?
      this.editableElement.innerText : this.editableElement.textContent;
  return text.replace('\n', '');
};

richtext.Input.prototype.setText = function(text) {
  this.clear();
  this.editableElement.appendChild(document.createTextNode(text));
  this.charRange.refresh();
};

richtext.Input.prototype.setHTML = function(html) {
  // setting innerHTML directly on IE causes "unknown runtime error" sometimes.
  var tmpDiv = document.createElement('div');
  tmpDiv.innerHTML = html;
  this.clear();
  while(tmpDiv.firstChild) {
    this.editableElement.appendChild(tmpDiv.firstChild);
  }
};

richtext.Input.prototype.clear = function(opt_includeEmptyContent) {
  while (this.editableElement.lastChild) {
    this.editableElement.removeChild(this.editableElement.lastChild);
  }
  if (opt_includeEmptyContent) {
    if (document.selection) { // IE
      this.editableElement.appendChild(document.createTextNode(''));
    } else {
      this.editableElement.appendChild(document.createElement('br'))
    }
  }
  this.charRange.refresh();
};


richtext.Input.prototype.format = function() {
  var text = this.getText();
  if (text) {
    if (!this.formatter) { return; }
    this.formatter.format(this.getText(), richtext.bind(this.updateHTML, this));
  } else {
    var currentSelection = this.charRange.getSelectionIndexes();
    this.clear(true);
    if (currentSelection[0] != null) {
      this.charRange.setSelectionIndexes(0, 0);
    }
  }
};

richtext.Input.prototype.updateHTML = function(html) {
  var currentSelection = this.charRange.getSelectionIndexes();
  this.setHTML(html);
  this.charRange.refresh();
  if (currentSelection[0] != null) {
    this.charRange.setSelectionIndexes.apply(this.charRange, currentSelection);
  }

};