const serverURL = "http://127.0.0.1:8000/";
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
        removeNbsp();
        SpanAdd();
        DeleteBanner();
       // DeleteRefer();
        wikipediaProcess();
        processTextNodes(document.body);
    }
});
function removeNbsp() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.innerHTML.includes('&nbsp;')) {
            element.innerHTML = element.innerHTML.replace(/&nbsp;/g, ' ');
        }
    }
}
var contentArr = [];
var nodeArr = [];
function processTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        nodeArr.push(node.parentNode);
        var text = node.textContent;
        var highlightedText = text; // 하이라이트 처리된 텍스트
        contentArr.push(highlightedText);
        processedStrings.forEach(function(searchString) {
           // searchString = searchString.replace(/\[.*?\]/g, '');
           // console.log(searchString);
            highlightedText = highlightedText.replace("  ", " ");
            if (searchString != "" && highlightedText.includes(searchString)) {
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
function wikipediaProcess() 
{
    var item = document.querySelectorAll('.mw-parser-output > p');

   for(var i = 0; i < item.length; i++)
    {
        var str = "";
        for(var j = 0; j < item[i].childNodes.length; j++)
        {
            str += item[i].childNodes[j].textContent;
           
        }
        var span = document.createElement('p');
        span.innerHTML = str;
        item[i].parentNode.replaceChild(span,item[i]);
    }
}
function SpanAdd() 
{
    var item = document.querySelectorAll('.wrap_item');
    for(var i = 0; i < item.length; i++)
    {
        var str = "";
        var node = item[i].querySelectorAll('span');
        if(node.length > 0)
        {
            for(var j = 0; j < node.length; j++)
            {
                str += node[j].textContent;
            }
            var span = document.createElement('span');
            span.innerHTML = str;
            item[i].innerHTML = '';
            item[i].appendChild(span);
        }
    }
    
}
function DeleteBanner() 
{
    var banner = document.querySelectorAll('.sticky');
    for(var i = 0; i < banner.length; i++)
    {
        banner[i].parentNode.removeChild(banner[i]);
    }
}
