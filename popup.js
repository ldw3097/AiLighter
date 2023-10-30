/*
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
        console.error('현재 활성 탭을 찾을 수 없습니다.');
        return;
    }

    const url = tabs[0].url;
    console.log(url);

    // readabilitySAX 앱 연결
    chrome.runtime.sendNativeMessage(
        'com.ailighter.readability',
        { Address: `${url}` },
        function (response) {
            if (response) { // 응답을 받으면
                const result = response.result;

                // 크롤링 결과를 popup.html에 출력
                const resultElement = document.getElementById('result');
                resultElement.textContent = result;
                console.log(result);

            } else {
                console.log("none");
            }
        }
    );
*/ // 결과출력
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
        console.error('현재 활성 탭을 찾을 수 없습니다.');
        return;
    }

    const url = tabs[0].url;

    // readabilitySAX 앱 연결
    chrome.runtime.sendNativeMessage(
        'com.ailighter.readability',
        { Address: `${url}` },
        function (response) {
            if (response) { // 응답을 받으면
                const result = response.result;

                // JSON 데이터 생성
                const jsonData = {
                    url: url,
                    content: result
                };
                
                //background.js로 json파일 전송
                chrome.runtime.sendMessage({ id: 'crawling', data: jsonData }, function(response) {});

                // JSON 데이터를 다운로드
                //downloadJSON(jsonData);            
            } else {
                console.log("none");
            }
        }
    );
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