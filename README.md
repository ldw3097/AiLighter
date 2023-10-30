# AiLighter 크롬 확장프로그램 클라이언트 

## 개요
AiLighter 크롬 확장프로그램 클라이언트

## 주의사항
native-app/readability.json 파일은 사용자마다 allowed_origins가 다르기 때문에 gitignore에 등록되어 따로 받아야 한다.
받는 링크:
https://cnu365-my.sharepoint.com/:u:/g/personal/201802123_o_cnu_ac_kr/EUYUyxqS4JxFqb-ozLTehU0BzNplsdQx358Wzhbs6IyzyA?e=N61yLj

## 설치방법
readabilitySAX를 실행시키는 실행 파일을 크롬익스텐션에서 호출하기 위해 크롬 익스텐션이 제공하는 nativeMessaging 권한이 필요하다. (manifest.json permisson 항목에 nativeMessaging 권한 추가)
권한을 획득했다면 크롬 익스텐션에서 Local에 접근하기 위해 readability.json폴더의 allowed_Origins 항목을 크롬 익스텐션을 연동했을 때 생기는 ID로 바꾸어주어야 한다.(예시 : chrome-extension://각자의 크롬 익스텐션 ID/).이후 주소 지정을 하기 위해 window의 경우 HKEY_LOCAL_MACHINE -> SOFTWARE -> Google -> Chrome -> NativeMessagingHosts나 HKEY_CURRENT_USER -> SOFTWARE -> Google -> Chrome -> NativeMessagingHosts 폴더 중 한 곳 에서 readbility.json폴더에 작성된 이름과 똑같은 파일을 만든 뒤 데이터 값에 eadbility.json의 경로 주소를 복사해서 넣어주면 된다.
native_app을 실행시키기 위해 popup.js에 코드를 작성해 놓았는데 chrome.tabs를 이용해 현제 실행 된 탭의 주소를 받아와 nativeMessaging을 이용해 native_app에 url을 전송하고(json파일) native_app에서 결과를  받아오는(json파일) 역활을 한다.(native_app이 보내오는 파일 형식 : {’result’ : ‘크롤링 내용’})

