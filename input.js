richtext.Input = function() {
  this.textStyles = [];
  this.render();
  this.charRange = new richtext.CharRange(this.editableElement);
};

richtext.Input.prototype.size = 10;

richtext.Input.prototype.formatter = null;

richtext.Input.prototype.render = function() {
  this.containerElement = document.createElement('div');
  this.containerElement.className = 'richtext';
  this.containerElement.style.overflow = 'hidden';
  richtext.makeInlineBlock(this.containerElement);
  this.containerElement.style.width = this.size + 1 + 'em';
  this.containerElement.style.height = "1em";

  this.editableElement = document.createElement('div');
  this.editableElement.style.width = "100000px"; // TODO: be reasonable
  this.editableElement.style.height = "1em";

  this.containerElement.appendChild(this.editableElement);
  this.editableElement.contentEditable = true;

  this.createInputElement_()

  this.editableElement.onfocus = function() {
    // select all text?
  };

  var self = this;
  this.editableElement.onkeyup = function () {
    var value = self.getText();
    if (value != self.inputElement.value) {
      self.inputElement.value = self.getText();
      self.format();
    }
  };
};

richtext.Input.prototype.createInputElement_ = function() {
  var inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  this.containerElement.appendChild(inputElement);
};


richtext.Input.prototype.getText = function() {
  return typeof this.editableElement.innerText != 'undefined' ?
      this.editableElement.innerText : this.editableElement.textContent;
};

richtext.Input.prototype.setText = function(text) {
  this.editableElement.innerHTML = '';
  this.editableElement.appendChild(document.createTextNode(text));
};


richtext.Input.prototype.format = function() {
  if (!this.formatter) { return; }
  var currentSelection = this.charRange.getSelectionIndexes();
  richtext.log("CURRENT SEL", currentSelection);
  this.editableElement.innerHTML = this.formatter.format(this.getText());
  this.charRange.refresh();
  if (currentSelection[0] != null) {
    this.charRange.setSelectionIndexes.apply(this.charRange, currentSelection);
  }
};