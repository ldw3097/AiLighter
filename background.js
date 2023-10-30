const serverURL = "http://127.0.0.1:8000/items/";

/**
* ---------------------------------------------------------------------------------
* | 백그라운드 |
* ---------------------------------------------------------------------------------
* - 디폴트 컬러를 지정하여 스토리지 API 를 호출하여 지정한 색을 저장시킵니다.
**/
const color = ["#3aa757"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });

});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.id === 'crawling') {
    const receivedData = request.data;
    const sendData = {
      data: receivedData
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

    fetch(serverURL, apiCall).then(function(response){
      if(response.status !== 200){

        return;
      }
      response.json().then(function(data){
      
      })
    }).catch(function(err){

    });    
  }
});
