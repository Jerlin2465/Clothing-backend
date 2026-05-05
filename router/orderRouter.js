const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getUserOrders,
} = require("../controller/orderController");

router.post("/place-order", placeOrder);
router.get("/all-orders", getAllOrders);
router.get("/user/:userId", getUserOrders);

module.exports = router;
