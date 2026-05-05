const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeItem,
  clearCart,
} = require("../controller/cartController");

const auth = require("../middleware/product/cartMiddleware");

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.put("/update", auth, updateCartQuantity);
router.delete("/remove", auth, removeItem);
router.delete("/clear", auth, clearCart);

module.exports = router;
