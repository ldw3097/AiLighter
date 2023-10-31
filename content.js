const url = document.URL;

var processedStrings;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'reset') {
        var highlightArr = document.querySelectorAll(".highlighted");
        for (var i = 0; i < highlightArr.length; i++) {
            if (highlightArr[i].parentNode) {
                highlightArr[i].parentNode.replaceChild(document.createTextNode(highlightArr[i].textContent), highlightArr[i]);
            }
        }
    }

    if (request.action === 'highlight') {
        processedStrings = request.content;
        processTextNodes(document.body);
    }
});

function processTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        var text = node.textContent;
        var highlightedText = text; // 하이라이트 처리된 텍스트

        processedStrings.forEach(function(searchString) {
            if (highlightedText.includes(searchString)) {
                highlightedText = highlightedText.replace(searchString, '<span class="highlighted">$&</span>');
            }
        });
        var span = document.createElement('span');
        span.innerHTML = highlightedText;
        if (node.parentNode) {
            node.parentNode.replaceChild(span, node);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (var i = 0; i < node.childNodes.length; i++) {
            processTextNodes(node.childNodes[i]);
        }
    }
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 이스케이프 처리 함수
}
