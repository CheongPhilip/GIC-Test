import database from "./src/db";

beforeAll(async () => {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_NAME || DB_NAME !== "test") {
    throw new Error("Missing environment variables for database connection");
  }
  await database.connect(DB_HOST, parseInt(DB_PORT), DB_USERNAME, DB_PASSWORD, DB_NAME);
  await database.initSequelize();
});

afterAll(async () => {
  await database.getInstance().drop();
  await database.disconnect();
});
