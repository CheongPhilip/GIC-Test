import express from "express";
import { cafeRouter, employeeRouter } from "./routers";
import { errorHandler } from "./utils/express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/employee", employeeRouter);
app.use("/cafe", cafeRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

export default server;
