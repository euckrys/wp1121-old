# Web Programming HW#1

## Run the Project

### 1. Clone the project

```bash
git clone <repo link>
```

### 2. Install dapendencies

在/frontend 與/backend 中都安裝 yarn

```bash
cd frontend
yarn
cd ..
cd backend
yarn
```

### 3. MongoDB setup

**在/backend 中新增.env 的檔案**, 並加入以下內容

```bash
PORT=8000
MONGO_URL=<Your MongoDB Connection String>
```

請將"Your MongoDB Connection String" 的值換成你自己的 mongoDB 連結,
可能會呈現以下格式:

```bash
MONGO_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxxxxxxxxx"
```

### 4. Run the server

進到/backend 中並執行以下指令

```bash
#in /backend
yarn start
```

你應該會看到以下訊息, 代表 server 成功開始運作並已連接到 MongoDB

```bash
Connected to MongoDB
Server running on port http://localhost:8000
```

### 5. Open the frontend

在檔案中點擊`forntend/index.html`使其以瀏覽器開啟

Or if you're on ubuntu, you can run the following command to open it in your browser.

```bash
cd frontend
xdg-open index.html
```

If you're on macOS, you can run the following command to open it in your browser.

```bash
cd frontend
open index.html
```

## MyDiary 使用說明

### 首頁

1. 首頁上方中央顯示**MY DIary**標題
2. 首頁右上方有「新增日記卡」與「Filter」按鈕
3. 下方位置將顯示出各個日記卡的預覽

### 新增日記卡

1. 點擊右上方的「新增日記卡」按鈕, 即可進入編輯模式開始新增日季卡
2. 上方可以選擇日期、標籤、心情
3. **(Perfect 要求)** 預設日期將會自動讀取系統日期, 可以進行更改, 可以檢查是否為合法的日期。若將日期清除則不予以新增日記卡。系統會自動幫你判斷當天是星期幾並於稍後顯示。
4. 標籤與心情的預設值為「選擇」, 請下拉選擇 「學業」、「人際」、「社團」與「快樂」、「生氣」、「難過」。若否則不予以新增日記卡
5. 請在下方欄位輸入你的日記卡內容, 若空白則不予以新增日記卡
6. 按下取消鍵將取消新增日記卡, 回到首頁
7. 按下儲存鍵則將新增日記卡, 並進入瀏覽模式, 此時瀏覽模式與首頁的日記卡內容皆已更新完畢
8. 點擊右上角的關閉按鈕或點擊範圍外非白色的區域皆可離開新增日記卡模式回到首頁(功能同取消按鍵)

### 首頁日記卡預覽

1. 可以清楚顯示出日期, 符合 2023.09.27 (三) 的格式
2. 顯示出標籤與心情
3. 顯示日記卡文字內容之預覽
4. View More 按鍵, 按下即可進入瀏覽模式

### 日記卡瀏覽模式

1. 點擊首頁中日記卡的 View More 按鍵, 即可進入該日記卡的瀏覽模式
2. 上方顯示日期、標籤、心情, 下方則有日記卡的詳細文字內容
3. 點擊右上角的關閉按鈕或點擊範圍外非白色的區域皆可離開瀏覽模式回到首頁

### 編輯日記卡

1. 在瀏覽模式中點擊 View More 按鍵, 即可進入該日記卡的編輯模式
2. 上方可以更改日期、標籤、心情(預設值即為之前日記卡儲存的值)
3. **(Perfect 要求)** 更改日期可以檢查日期是否合法, 若清除日期將無法新增日記卡
4. 下方可以更改日記卡文字內容, 若將文字全部清除將不予以更新日記卡
5. 按下取消鍵則不儲存, 回到瀏覽模式
6. 按下儲存鍵則更新日記卡資料, 並同樣回到瀏覽模式, 此時瀏覽模式與首頁的日記卡內容皆已更新完畢
7. 點擊右上角的關閉按鈕即可離開編輯模式回到瀏覽模式（功能同取消按鍵）

### Filter 功能 **(Perfect 要求)**

1. 位於首頁的右上角, 新增日記卡按鈕的下面
2. 一開始預設為 「所有」, 亦即首頁會顯示出所有的日記卡
3. 有「學業」、「人際」、「社團」、「快樂」、「生氣」、「難過」等類別可以選擇, 選擇後即會過濾出含有此類別的日記卡並在首頁中顯示, 其他不含有此類別的日記卡則不予以顯示。(選擇後可能需要 1 秒鐘的時間等待畫面更新)
4. 建議多新增幾個各種類別的日記卡以測試此功能
