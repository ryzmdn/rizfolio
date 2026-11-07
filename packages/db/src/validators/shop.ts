import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  products,
  productFiles,
  orders,
  orderItems,
  coupons,
  productReviews,
} from "@workspace/db/schema/shop"

export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)

export const insertProductFileSchema = createInsertSchema(productFiles)
export const selectProductFileSchema = createSelectSchema(productFiles)

export const insertOrderSchema = createInsertSchema(orders)
export const selectOrderSchema = createSelectSchema(orders)

export const insertOrderItemSchema = createInsertSchema(orderItems)
export const selectOrderItemSchema = createSelectSchema(orderItems)

export const insertCouponSchema = createInsertSchema(coupons)
export const selectCouponSchema = createSelectSchema(coupons)

export const insertProductReviewSchema = createInsertSchema(productReviews)
export const selectProductReviewSchema = createSelectSchema(productReviews)
