richtext.Formatter = function() {

};

richtext.Formatter.format = function(text, callback) {
  throw "Not implemented."
};

richtext.RegExpFormatter = function() {
  this.matchers = [];
};

richtext.RegExpFormatter.prototype.addMatcher = function(
    re, opt_style, opt_className) {

  this.matchers.push({
    match: re,
    style: opt_style || '',
    className: opt_className || ''
  });

};

richtext.RegExpFormatter.prototype.format = function(inputText, callback) {

  var outputHtml = '';

  while (inputText.length) {
    var nextMatch = null;
    var nextStyle = null;
    var nextClassName = null;
    // TODO: be smart, keep track of where the next match is for each matcher.
    for (var i = 0; i < this.matchers.length; i++) {
      var match = this.matchers[i].match.exec(inputText);
      if (match && (nextMatch == null || match.index < nextMatch.index)) {
	nextMatch = match;
	nextStyle = this.matchers[i].style;
	nextClassName = this.matchers[i].className;
      }
    }

    if (nextMatch) {
      outputHtml += inputText.substring(0, nextMatch.index).replace(/\ /g, '&nbsp;');
      var matchText = nextMatch[0];
      
      outputHtml += '<span class="' + nextClassName + '" style="' + nextStyle + '">' + matchText.replace(/\ /g, '&nbsp;') + '</span>';
      inputText = inputText.substring(nextMatch.index + matchText.length);
    } else {
      outputHtml += inputText.replace(/\ /g, '&nbsp;');
      inputText = "";
    }
  }

  callback(outputHtml);
};
