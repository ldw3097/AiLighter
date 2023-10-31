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

            (async () => {
                const response = await chrome.runtime.sendNativeMessage(
                    'com.ailighter.readability', {
                        Address: `${url}`
                    }, );
                // do something with response here, not outside the function
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
                        console.log("response error");
                        return;
                    }
                    response.json().then(function(data) {
                        searchStrings = data["content"];
                        const stringList = document.getElementById("content");
                        var i = 1;
                        searchStrings.forEach(str => {
                            if(str != "")
                            {
                                const p = document.createElement('p');
                                p.textContent = i + '. '+ str;
                                i++;
                                stringList.appendChild(p);
                            }
                        });
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'highlight', content: searchStrings}, /* callback */);
                    })
                }).catch(function(err) {

                });
            })();
});
// button element 요소
document.addEventListener('DOMContentLoaded', function() 
{
    let ResetBtn = document.getElementById("resetbtn");
    ResetBtn.addEventListener('click',ResetButton);

    function ResetButton(event)
    {
         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) 
         {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'reset'}, /* callback */);
        });
         document.getElementById("content").innerHTML = '';
    }
});
