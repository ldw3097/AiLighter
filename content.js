const serverURL = "http://127.0.0.1:8000/";
const url = document.URL;

let searchStrings;
var processedStrings;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'openPopup') {
        chrome.runtime.sendMessage({ action: "getNativeMessage", url: url }, function(response) {
            if (response) {
                const result = response.result;
                const jsonData = {
                    url: url,
                    content: result
                };
                const sendData = {
                    data: jsonData
                };

                const headers = new Headers({
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                });

                const apiCall = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(sendData),
                };

                fetch(serverURL, apiCall)
                    .then(function(response) {
                        if (response.status !== 200) {
                            return;
                        }
                        response.json()
                            .then(function(data) {
                                searchStrings = data["content"];
                                processedStrings = searchStrings;
                                chrome.runtime.sendMessage({ processedStrings: processedStrings }, function(response) {
                                        console.log('processedStrings sent to popup.js');
                                  });
                                processTextNodes(document.body);
                            });
                    })
                    .catch(function(err) {
                        // Handle error
                    });
            } else {
                console.log("none");
            }
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'reset') {
        var highlightArr = document.querySelectorAll(".highlighted");
        for (var i = 0; i < highlightArr.length; i++) {
            if (highlightArr[i].parentNode) {
                highlightArr[i].parentNode.replaceChild(document.createTextNode(highlightArr[i].textContent), highlightArr[i]);
            }
        }
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