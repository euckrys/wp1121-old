# Web Programming HW#2

## Run the APP

Follow the instructions in this section to run the app locally.

### 0. node.js setup

請確認你有安裝`Node.js`(修課同學應該都有裝)，若沒有裝請參考老師公佈的`HW0`，可輸入以下訊息確認。

```bash
node -v
#輸入後會在此顯示node版本，因人而異
```

建議 node 不要使用太新的版本，不然好像會噴錯。

若照下述之步驟開不起 Server，請將 node 版本換成`v18,17.1`試試看，謝謝。

如果你是使用`fnm`作為 version manager，可以輸入以下指令以切換 node 版本

```bash
fnm use v18.17.1
```

若使用的是`nvm`，請輸入以下指令

```bash
nvm use v18.17.1
```

### 1. Install dapendencies

在/frontend 與/backend 中都安裝 yarn

```bash
#in /hw2
cd frontend
yarn
cd ..
cd backend
yarn
```

### 2. setup backend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
#in /hw2
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this.

```bash
#in /backend/.env
PORT=8000
MONGO_URL="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 3. setup frontend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
#in /hw2
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the `port` should be the same as the one you set in the backend `.env` file.

```bash
#in /frontend/.env
VITE_API_URL="http://localhost:8000/api"
```

### 4. start the backend server

進到/backend 中並執行以下指令

```bash
#in /backend
yarn dev
```

你應該會看到類似以下的訊息, 代表 backend server 成功開始運作並已連接到 MongoDB.

```bash
Connected to MongoDB
Server running on port http://localhost:8000
```

### 5. start the frontend server

進到/frontend 中並執行以下指令

```bash
#in /frontend
yarn dev
```

Visit `http://localhost:5173` to see the app in action. That's it, you're done!

若無跳出警告或錯誤訊息即代表網頁已成功開始運作!!

### 6. clear your mongodb

請清空你的 MongoDB，以避免 Schema 與你資料庫的現有內容不相符，造成 APP 無法正常運作。

此外，若和後端 Server 的溝通有問題，請再三確認 backend/.env 中的設定或拼寫無誤(例如 URL 後多了不必要的 semicolon)。

## APP 使用說明

### **_PERFECT 要求_**

1. 使用者提示: 當使用者未輸入資訊或是進行錯誤操作時，給予適當提示。例如使用者新增或編輯清單時，未輸入標題，以彈窗提示「請輸入標題」。

2. 重複名稱檢測: 新增播放清單與歌曲時，播放清單名稱不可重複，同一播放清單內的歌曲名稱不可重複。

### 首頁

1. 標題欄: WP Music 顯示於頁面上方，My Playlists 顯示於其下。
2. 各播放清單顯示於頁面下方，可看到清單圖片、歌曲數量、清單名稱。
3. 點擊清單圖片後即開啟對應之播放清單頁，可瀏覽其內容。
4. 頁面支援響應式設計(RWD)，每列之清單數量會根據螢幕大小進行調整。
5. 頁面右上方有 ADD 與 DELETE 按鈕，分別對應新增播放清單與刪除播放清單之功能。
6. ADD 按鈕。點擊後彈出視窗，使用者可輸入清單名稱與敘述，完成輸入後在首頁看到新的播放清單。若按 CANCEL 則返回首頁。
7. DELETE 按鈕。點擊後進入刪除模式，按鈕上文字變為 DONE。每個清單的右上角會出現紅色刪除按捻，點擊後該播放清單即被刪除。再次點擊 DONE 按鈕後，清單右上角之刪除按鈕消失，按鈕上文字也變回 DELETE。

### 播放清單頁

1. 頁面上方顯示播放清單之圖片、標題與敘述。
2. 播放清單之標題與敘述皆可編輯，點擊標題與敘述之文字便會出現編輯的欄位，離開欄位即自動儲存並更新內容。
3. 畫面下方顯示播放清單內之歌曲資訊。首欄有一個 Checkbox 與各行之標題。
4. 可以清楚看到各個歌曲之標題、歌手、與歌曲連結。歌曲連結可點擊，並以新視窗開啟。每個歌曲最左方有一個 Checkbox 可選取。而首欄之 Checkbox 具有全選功能。
5. 每個歌曲資訊的最右方有一個編輯按鍵，點擊後彈出視窗，使用者可編輯歌曲名稱、歌手與連結。
6. 在歌曲編輯模式下，亦可將歌曲新增置其他清單，於列表中選擇欲新增歌曲之清單，按下確認後即會在選擇之播放清單中自動新增(歌曲仍保留於原播放清單)。
7. 頁面支援響應式設計(RWD)，文字以及歌曲列表之寬度會根據螢幕大小進行調整。
8. 播放清單敘述之右方有 ADD 與 DELETE 按鈕，分別對應新增播放清單與刪除播放清單之功能。
9. ADD 按鈕。點擊後彈出視窗，使用者可輸入歌曲名稱、歌手與歌曲連結，完成輸入後在播放清單頁看到新的歌曲。若按 CANCEL 則返回播放清單頁。
10. DELETE 按鈕。點擊後跳出彈窗，將所有被勾選的歌曲資訊列出。並詢問使用者「是否確定刪除」。若使用者選擇 YES 則刪除所有已選取之歌曲，若否則取消刪除，返回播放清單頁。
11. 若無歌曲被全選時按下 DELETE 按鈕，則會提示「請勾選歌曲」。
