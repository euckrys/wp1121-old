# Web Programming HW#3

## Running the APP

### 1. Install dependencies

```bash
yarn install
```

### 2. Create a `.env.local` file in the root of the project and add a _valid_ Postgres URL. To get a Postgres URL, follow the instructions [here](https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199?pvs=4).

You can create `.env.local` by copying `.env.example`

```bash
cp .env.example .env.local
```

This is just an example, you should replace the URL with your own.

```bash
#in .env.example
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/twitter"
```

### 3. Run the migrations

```bash
yarn migrate
```

You may see messages look like this (beacuse of the different in db schema):

```bash
Is activities table created or renamed from another table?
❯ + activities          create table
  ~ tweets › activities rename table
  ~ likes › activities  rename table
```

Please choose `create table` for activities, joins and replies table.

Then, you may receive a warning looks like this:

```bash
 Warning  Found data-loss statements:
· You're about to delete activities table with 1 items
· You're about to delete joins table with 1 items
· You're about to delete replies table with 1 items

THIS ACTION WILL CAUSE DATA LOSS AND CANNOT BE REVERTED

Do you still want to push changes?
  No, abort
❯ Yes, I want to remove 2 tables,
```

Please choose the `Yes` option.

### 4. Start the app

```bash
yarn dev
```

## Managing the database

`drizzle-kit` provides some useful commands to manage the database.

### Update database schema

Note that if your schema changes, some data might be deleted in the process. `drizzle-kit` would prompt you about destructive changes.

```bash
yarn drizzle-kit push:pg
```

### View or edit data

This command launches a web UI to view or edit data in the database.

```bash
yarn drizzle-kit studio
```

## 實作細節

完成Pass要求，部份細節在此說明，其餘與HW3作業說明相同。

1. 按下"切換使用者名稱"會彈出視窗，可在此切換顯示的使用者名稱（注意：不是更改使用者，即handle不變）。
2. 若要以不同使用者身份登入，請回到[http://localhost:3000](http://localhost:3000)進行登入。相同handle代表相同使用者
3. 新增活動時，開始與結束的時間請符合格式（YYYY-MM-DD HH），若錯誤會提醒。
4. 瀏覽頁面中的回覆欄具有line-wrapping功能，高度會隨著輸入內容增長。留言區同樣有line-wrapping功能。
