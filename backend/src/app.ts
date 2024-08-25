import express from "express";
import { cafeRouter, employeeRouter } from "./routers";
import { errorHandler } from "./utils/express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/employee", employeeRouter);
app.use("/cafe", cafeRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

export default server;
