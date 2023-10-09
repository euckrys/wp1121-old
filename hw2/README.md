# Web Programming HW#2

## Run the APP

Follow the instructions in this section to run the app locally.

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
