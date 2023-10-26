let searchStrings;
var regex = /\(|\)/g;
var processedStrings;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getValue') {
    chrome.storage.local.get('key', function(result) {
      searchStrings = JSON.parse(result.key);
      processedStrings = searchStrings.map(function (str) {
        return str.replace(regex, function (match) {
          return "\\" + match;
        });
      });
      processTextNodes(document.body);
      a = false;
    });
  }

  if(request.action === 'reset')
  {
    var highlightArr = document.querySelectorAll(".highlighted");
    console.log("asd" + highlightArr.length);
    for(var i = 0; i < highlightArr.length; i++)
    {
      highlightArr[i].classList.remove("highlighted");
    }
  }
});
function processTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    var text = node.textContent;
    processedStrings.forEach(function (searchString) {
      var searchText = new RegExp(searchString, 'g');
      if (searchText.test(text)) {
        var span = document.createElement('span');
        span.innerHTML = text.replace(searchText, '<span class ="highlighted">$&</span>');
        node.parentNode.replaceChild(span, node);
      }
    });
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; i++) {
      processTextNodes(node.childNodes[i]);
    }
  }
}