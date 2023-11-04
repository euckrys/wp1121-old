# Web Programming HW#3

## Running the APP

1. Clone the repo

2. Install dependencies

```bash
yarn install
```

3. Create a `.env.local` file in the root of the project and add a _valid_ Postgres URL. To get a Postgres URL, follow the instructions [here](https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199?pvs=4).

This is just an example, you should replace the URL with your own.

```bash
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/twitter"
```

4. Run the migrations

```bash
yarn migrate
```

4. Start the app

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
