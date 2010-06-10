richtext.CharRange = function(containerElement) {
  this.nodes = [];
  this.containerElement = containerElement;
  this.refresh();
}

richtext.CharRange.prototype.refresh = function() {
  this.nodes.length = [];
  this.buildNodeList_(this.containerElement, this.nodes);

  // TODO: remove this hackery.
  if (!this.nodes.length) {
    this.nodes.push(this.containerElement);
  } else {
    this.nodes.push(this.nodes[this.nodes.length - 1]);
  }
  richtext.log('refreshed char range', this.nodes);
};

richtext.CharRange.prototype.buildNodeList_ = function(element, nodeList) {
  var childNodes = element.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    var node = childNodes[i];
    if ((node.nodeType == 3 || node.nodeType == 4)) { // Text node / CDATA
	//&& /[^\t\n\r ]/.test(node.data)) { // Not all whitespace
      var text = node.data;
      for (var j = 0; j < text.length; j++) {
	    nodeList.push(node);
      }
    } else {
      this.buildNodeList_(node, nodeList)
    }
  }
};

richtext.CharRange.prototype.isInContainer_ = function(child) {
    do {
	if (child == this.containerElement) {
	    return true;
	}
    } while (child = child.parentNode);
    return false;
};

richtext.CharRange.prototype.containsRange_ = function(range) {
    return this.isInContainer_(range.startContainer) &&
        this.isInContainer_(range.endContainer);
};

richtext.CharRange.prototype.getSelectionIndexes = function() { 
  var selection = window.getSelection();
  var range;
  if (selection.rangeCount) {
      range = selection.getRangeAt(0);
  }
  if (!range || !this.containsRange_(range)) {
    return [null, null];
  }

  var startContainerStartIndex = this.getNodeStartIndex(range.startContainer) || 0;
  var endContainerStartIndex = this.getNodeStartIndex(range.endContainer) || 0;
  return [startContainerStartIndex + range.startOffset,
	  endContainerStartIndex + range.endOffset];
};

richtext.CharRange.prototype.setSelectionIndexes = function(startIndex,
							    endIndex) {
  var startNode = this.nodes[startIndex];
  var endNode = this.nodes[endIndex];
  var startOffset = this.getNodeStartIndex(startNode);
  var endOffset = this.getNodeStartIndex(endNode);
  richtext.log(startNode, startOffset, endNode, endOffset);
  var range = document.createRange();
  range.setStart(startNode, startIndex - startOffset);
  range.setEnd(endNode, endIndex - endOffset);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
};

richtext.CharRange.prototype.getNodeStartIndex = function(node) {
  for (var i = 0; i < this.nodes.length; i++) {
    var testNode = this.nodes[i];
    if (testNode == node || testNode.parentNode == node) {
      return i;
    }
  }
};

