import { Admin } from "./admin.entity";
import { User } from "./user.entity";
import { Company } from "./company.entity";
import { Subscription } from "./subscription.entity";
import { EventRegistration } from "./event-registration.entity";
import { ResourcePurchases } from "./resource-purchases.entity";
import { PaidUpload } from "./paid-upload.entity";
import { Payment } from "./payment.entity";
import { Event } from "./event.entity";
import { Resource } from "./resource.entity";
import { AdminLog } from "./admin-log.entity";
import { AdPlacement } from "./ad-placement.entity";
import { MembershipPlan } from "./membership-plan.entity";
import { Category } from "./category.entity";

export const entities = [
  Admin,
  User,
  Company,
  Category,
  Subscription,
  EventRegistration,
  ResourcePurchases,
  PaidUpload,
  Payment,
  Event,
  Resource,
  AdminLog,
  AdPlacement,
  MembershipPlan,
];
