英語媒合家教平台
=
老師可在該平台上授課，學生能夠選取自己想上的課程！

功能
--
* 可註冊自己的帳號，也可透過已有的google帳號登入
* 登入後所有人預設身分皆為學生，可以透過點選＂成為老師＂按鈕成為老師並授課（時間限制在18:00-22:00)
* 能透過點選右上角自己的名字去編輯個人資料
* 在首頁可以透過關鍵字查詢到符合的老師或課程
* 在個人頁面可以看到已預約的課程資訊
* 學生上完課可以給予老師評分，該評分會顯示在首頁的課程內資訊，也會顯示在老師自己能看到的個人資料處
* 學生能在個人資料處看到目前學習時數排名
* 在首頁會顯示目前學習時數排名前十的學生
* 管理員可透過＂後台＂按鈕看見所有的使用者

開始使用
--
1. 請確認已安裝 node.js 與 npm
2. 將專案 clone 到本地

   ```bash
   git clone ...
   ```
3.進入到本地資料夾後，輸入以下指令安裝套件
   ```bash
 npm install
   ```
4. 依照 .env.example 設定環境變數
5. 連接資料庫後，輸入以下指令建立資料庫內容
     ```bash
   npx sequelize db:migrate
   ```
6. 輸入以下指令建立種子資料

   ```bash
    npx sequelize db:seed:all
   ```
7. 開始專案

   ```bash
   npm run start
   ```

8. 若看見以下訊息代表順利運行，便可打開瀏覽器進入該網址

   ```bash
   Example app listening on port 3000!
   ```
   
9.  若想結束此專案請輸入
    ```bash
     ctrl + c
     ```
### 開發環境
* Node.js 16.14.1
* MySQL 8.0.15
