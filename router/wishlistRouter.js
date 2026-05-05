const express = require("express");

const router = express.Router();

const {
  addWishlist,
  getwishlist,
  removeWishlist,
} = require("../controller/wishlistController");

const auth = require("../middleware/product/cartMiddleware");

router.post("/add", auth, addWishlist);
router.get("/", auth, getwishlist);
router.delete("/remove", auth, removeWishlist);

module.exports = router;
