richtext.CharRange = function(containerElement) {
  this.nodes = [];
  this.containerElement = containerElement;
  this.refresh();
}

richtext.CharRange.prototype.refresh = function() {
  this.nodes = [];
  this.buildNodeList_(this.containerElement, this.nodes);

  // TODO: remove this hackery.
  if (!this.nodes.length) {
    this.nodes.push(this.containerElement);
  } else {
    this.nodes.push(this.nodes[this.nodes.length - 1]);
  }
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


richtext.CharRange.prototype.getSelectionIndexes = function() { 
  if (document.selection) {
    var indices = this.getSelectionIndexesIE_();
  } else {
    var indices = this.getSelectionIndexesW3C_();
  }
  return indices || [null, null];
};

richtext.CharRange.prototype.getSelectionIndexesIE_ = function() {
  var textRange = document.selection.createRange();
  if (!this.isInContainer_(textRange.parentElement)) {
    return null;
  }
  var startRange = textRange.duplicate();
  //var endRange = textRange.duplicate();
  startRange.collapse(true);
  var startNode = startRange.parentElement;
  var startNodeRange = textRange.duplicate();
  startNodeRange.moveToElementText(startNode);
  var entireNodeLength = startNodeRange.text.length;
  startRange.setEndPoint('EndToStart', startNodeRange);
  var startOffset = startRange.text.length - entireNodeLength;
  var startIndex = this.getNodeStartIndex(startNode) + startOffset;
  var endIndex = startIndex + textRange.text.length;
  return [startIndex, endIndex];  
};

richtext.CharRange.prototype.getSelectionIndexesW3C_ = function() {
  var selection = window.getSelection();
  var range;
  if (selection.rangeCount) {
      range = selection.getRangeAt(0);
  }
  if (!range || !this.containsRangeW3C_(range)) {
    return null;
  }
  var startContainerStartIndex =
      this.getNodeStartIndex(range.startContainer) || 0;
  var endContainerStartIndex =
      this.getNodeStartIndex(range.endContainer) || 0;
  return [startContainerStartIndex + range.startOffset,
	  endContainerStartIndex + range.endOffset];
};

richtext.CharRange.prototype.containsRangeW3C_ = function(range) {
    return this.isInContainer_(range.startContainer) &&
        this.isInContainer_(range.endContainer);
};

richtext.CharRange.prototype.setSelectionIndexes = function(startIndex,
							    endIndex) {
   // If the selection would go past the end, move it back.
  var adjustment = 0;
  if (endIndex > this.nodes.length - 1) {
    adjustment = endIndex - (this.nodes.length - 1);
    endIndex = this.nodes.length - 1;
  }
  startIndex = Math.min(endIndex, Math.max(0, startIndex - adjustment));
 
  var startNode = this.nodes[startIndex];
  var endNode = this.nodes[endIndex];
  var startOffset = startIndex - this.getNodeStartIndex(startNode);
  var endOffset = endIndex - this.getNodeStartIndex(endNode);

  if (document.selection) {
    this.selectRangeIE_(startNode, startOffset, endNode, endOffset);
  } else {
    this.selectRangeW3C_(startNode, startOffset, endNode, endOffset);
  }
};

richtext.CharRange.prototype.getNodeStartIndex = function(node) {
  for (var i = 0; i < this.nodes.length; i++) {
    var testNode = this.nodes[i];
    if (testNode == node || testNode.parentNode == node) {
      return i;
    }
  }
};

richtext.CharRange.prototype.selectRangeW3C_ = function(startNode, startOffset,
							endNode, endOffset) {
  var range = document.createRange();
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  
};

richtext.CharRange.prototype.selectRangeIE_ = function(startNode, startOffset,
						       endNode, endOffset) {
  var startRange = document.body.createTextRange();
  var endRange = document.body.createTextRange();
  startRange.moveToElementText(startNode.parentNode);
  endRange.moveToElementText(endNode.parentNode);
  if (startOffset) {
    startRange.moveStart('character', startOffset);
  }
  if (endOffset) {
    endRange.moveStart('character', endOffset);
  }
  var newRange = document.body.createTextRange();
  newRange.setEndPoint('StartToStart', startRange);
  newRange.setEndPoint('EndToStart', endRange);
  newRange.select();
};

