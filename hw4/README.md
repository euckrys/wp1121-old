# Run the project

本次作業使用 Nextjs, pusher, Github OAuth, POSTGRES database(docker),

## 1. Install dependencies

```bash
yarn
```

## 2. Get Pusher credentials

請使用自己的Pusher Keys

**注意:請取消**APP Settings中的`Enable authorized connection`選項，否則會有30秒的連線限制。

## 3. Get Github OAuth credentials

請使用自己的 Github OAuth credentials

## 4. Create `.env.local` file in the project root.

```bash
cp .env.example .env.local
```

請填寫以下內容，請確保 KEYs 跟 DB URL 都是有效的：

```text
POSTGRES_URL=

PUSHER_ID=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=

AUTH_SECRET=<this can be any random string>
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

## 5. Start the database

```bash
docker compose up -d
```

## 6. Run migrations

```bash
yarn migrate
```

## 7. Start the development server

```bash
yarn dev
```

## 8. Open http://localhost:3000 in your browser

# HW4實作內容說明

## 基本要求

大致如作業敘述所說。

1. 搜尋/新增的部份整合在一起，按下右方按鍵才會work(Enter鍵不行)，功能如下所述：

   a. 若使用者不存在DB, 提示使用者不存在。

   b. 若已有與該使用者之聊天室，提示已存在聊天室並自動跳轉至該聊天室頁面

   c. 若尚未有與該使用者之聊天室，詢問是否新增聊天室，按下確認後即新增聊天室

2. 收回訊息：僅有自己發出的訊息點右鍵才會有反應。

3. 公告：按下每則訊息旁邊的大聲公？圖示即可

## 進階要求

本次作業有實作進階要求

1. **傳送連結**： 自動辨識訊息中文字是否為連結。若是連結，則可以透過該連結開啟新視窗。
   (如：`https://pusher.com/` , `https://cool.ntu.edu.tw/login/portal` )

2. **自動滾動**： 當出現新訊息時，聊天紀錄需自動滾動至最下方。
   請輸入夠多訊息（至超出視窗大小）以測試此功能。

# Pusher Setup

1.  Install pusher

    ```bash
    yarn add pusher pusher-js
    ```

2.  Create a pusher account at https://pusher.com/
3.  Create a new app

    - Click `Get Started` or `Manage/Create app`on the `Channel` tab
    - Enter the app name
    - Select a cluster. Pick the one closest to you, i.e. `ap3(Asia Pacific (Tokyo))`
    - Click `Create app`

4.  Go to `App Keys` tab, you will see the following keys:
    - `app_id`
    - `key`
    - `secret`
    - `cluster`
5.  Copy these keys to your `.env.local` file:

    ```text
    PUSHER_ID=<app_id>
    NEXT_PUBLIC_PUSHER_KEY=<key>
    PUSHER_SECRET=<secret>
    NEXT_PUBLIC_PUSHER_CLUSTER=<cluster>
    ```

    `NEXT_PUBLIC` prefix is required for the client side to access the env variable.

    Also, please remember to add these keys to your environment variables handler in `src/lib/env/private.ts` and `src/lib/env/public.ts`. You can view those two files for more details.

6.  Go to `App Settings` tab, scroll down to `Enable authorized connections` and **don't enable it**.

# NextAuth Setup

We use the latest version (v5) of NextAuth, which is still in beta. So there are some differences between the documentation and the actual code. You can find the detailed v5 migration guide here: https://authjs.dev/guides/upgrade-to-v5#authenticating-server-side

1. Install next-auth

   ```bash
   yarn add next-auth@beta
   ```

2. Get Github OAuth credentials

   - Go to `Settings` tab of your Github account
   - Click `Developer settings` on the left sidebar
   - Click `OAuth Apps` on the left sidebar
   - Click `New OAuth App` or `Registr a new application`
   - Enter the following information:
     - `Application name`: `Notion Clone` (or any name you like)
     - `Homepage URL`: `http://localhost:3000`
     - `Authorization callback URL`: `http://localhost:3000/api/auth/callback/github`
   - Click `Register application`
   - Copy the `Client ID` and `Client Secret` to your `.env.local` file:

     ```text
     AUTH_GITHUB_ID=<Client ID>
     AUTH_GITHUB_SECRET=<Client Secret>
     ```

     Before copying the Clinet Secret, you may need to click on `Generate a new client secret` first.

     Note that in NextAuth v5, the prefix `AUTH_` is required for the env variables.

     Note that you do not have to add those keys to `src/lib/env/private.ts` since they are automatically handled by NextAuth.

3. Add `AUTH_SECRET` to `.env.local`:

   ```text
   AUTH_SECRET=any-random-string
   ```

   This is used to encrypt the session token. You can use any random string here. Make sure to keep it secret and update it regularly.

   Note that you do not have to add those keys to `src/lib/env/private.ts` since they are automatically handled by NextAuth.
