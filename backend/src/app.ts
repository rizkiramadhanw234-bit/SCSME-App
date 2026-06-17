import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { testDbConnection } from "./config/db";
import adminRouter from "./routes/admin.route";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import membershipPlansRouter from "./routes/membership-plans.route";
import subscriptionRouter from "./routes/subscription.route";
import paymentRouter from "./routes/payment.route";
import companyRouter from "./routes/company.route";
import companyVerifyRouter from "./routes/companyVerify.route";

dotenv.config();
testDbConnection();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: process.env.ALLOW_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("welcome!");
});

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/membership-plans", membershipPlansRouter);
app.use("/subscription", subscriptionRouter);
app.use("/payment", paymentRouter);
app.use("/company", companyRouter);
app.use("/company-verify", companyVerifyRouter);

export default app;
