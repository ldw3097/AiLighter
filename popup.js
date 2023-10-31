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
                        searchStrings.forEach(str => {
                            const p = document.createElement('p');
                            p.textContent = str;
                            stringList.appendChild(p);
                        });
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'highlight', content: searchStrings}, /* callback */);
                    })
                }).catch(function(err) {

                });
            })();
});

function downloadJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 다운로드 링크 생성
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'result.json';
    
    // 링크를 클릭하여 다운로드 시작
    downloadLink.click();
} // json파일 파싱 및 다운로드
 
// button element 요소
let page = document.getElementById("changeColor");
let Return_color = document.body.style.backgroundColor;
// 제공할 배경색 목록
const presetButtonColors = [Return_color,"#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

/**
 * @param {object} buttonColors - 버튼 컬러 목록
 * @description 제공할 배경색을 웹 페이지에 표시하여 줍니다.
 **/
 
function constructOptions(buttonColors) {

    for (let buttonColor of buttonColors) {
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;
      let selectedColor = button.dataset.color;
      button.addEventListener("click", async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
       chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setPageBackgroundColor,
            args: [selectedColor]
        });
      });
      page.appendChild(button);
    }
}
function setPageBackgroundColor(selectedColor) {
    document.body.style.backgroundColor = selectedColor;
}
// 최초 버튼 컬러 표시 및 이벤트 등록 호출
constructOptions(presetButtonColors);
