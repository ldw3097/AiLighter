const serverURL = "http://127.0.0.1:8000/"; 
// 결과출력
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function(tabs) {
    if (tabs.length === 0) {
        console.error('현재 활성 탭을 찾을 수 없습니다.');
        return;
    }
    const url = tabs[0].url;

    // readabilitySAX 앱 연결
    chrome.runtime.sendNativeMessage(
        'com.ailighter.readability', {
            Address: `${url}`
        },
        function(response) {
            if (response) { // 응답을 받으면
                const result = response.result;

                // JSON 데이터 생성
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

                fetch(serverURL, apiCall).then(function(response) {
                    if (response.status !== 200) {

                        return;
                    }
                    response.json().then(function(data) {
                        chrome.storage.local.set({'response': data}, function() {
                            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {action: 'getValue'})})
                        });
                        console.log("store");
                    })
                }).catch(function(err) {

                });
            } else {
                console.log("none");
            }
        }
    );

});
// button element 요소
document.addEventListener('DOMContentLoaded', function() 
{
    let page = document.getElementById("content");
    let ResetBtn = document.getElementById("resetbtn");

    var newTextDiv =  document.createElement("div");
    /*
     for(var i = 0; i < searchStrings.length; i++)
    {
            newTextDiv.setAttribute("id","ContentDiv");
            //var newText =  document.createTextNode(i+1 +". "+searchStrings[i]);
            var newBr =  document.createElement("p");

           // newTextDiv.appendChild(newText);
            newTextDiv.appendChild(newBr);
            page.appendChild(newTextDiv);
    }
    */
    ResetBtn.addEventListener('click',ResetButton);
    function ResetButton(event)
    {
         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) 
         {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'reset'}, /* callback */);
        });
         if(document.getElementById("ContentDiv") != null)
            document.getElementById("ContentDiv").parentNode.removeChild(document.getElementById("ContentDiv"));
    }
});
