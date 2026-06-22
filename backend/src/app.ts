import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import { testDbConnection } from "./config/db";
import adminRouter from "./routes/admin.route";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import membershipPlansRouter from "./routes/membership-plans.route";
import subscriptionRouter from "./routes/subscription.route";
import paymentRouter from "./routes/payment.route";
import companyRouter from "./routes/company.route";
import companyVerifyRouter from "./routes/companyVerify.route";
import eventRouter from "./routes/event.route";
import paymentAdminVerifyRouter from "./routes/paymentAdminVerify.route";
import eventRegistrationRouter from "./routes/eventRegistration.route";
import resourcesRouter from "./routes/resources.route";
import resourcesPurchasesRouter from "./routes/resourcePurchases.route";
import userResourcesRouter from "./routes/resourcesUser.route";
import paidUpladsUserRouter from "./routes/paidUploadsUser.route";
import paidUpladsAdminRouter from "./routes/paidUploadsAdmin.route";
import adPlacementsRouter from "./routes/adPlacements.route";

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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("welcome!");
});

app.use("/public", express.static(path.join(__dirname, "../public")));

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/membership-plans", membershipPlansRouter);
app.use("/subscription", subscriptionRouter);
app.use("/payment", paymentRouter);
app.use("/company", companyRouter);
app.use("/company-verify", companyVerifyRouter);
app.use("/event", eventRouter);
app.use("/payment-admin-verify", paymentAdminVerifyRouter);
app.use("/event-registration", eventRegistrationRouter);
app.use("/resources", resourcesRouter);
app.use("/resource-purchases", resourcesPurchasesRouter);
app.use("/user-resources", userResourcesRouter);
app.use("/paid-uploads", paidUpladsUserRouter);
app.use("/paid-uploads-admin", paidUpladsAdminRouter);
app.use("/ad-placements", adPlacementsRouter);

export default app;
