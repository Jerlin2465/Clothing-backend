const express = require("express");

const {
  createProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const upload = require("../middleware/uploads");

const authmiddleware = require("../middleware/authmiddleware");
// const authorizeRoles = require("../middleware/roleBaseMiddleware");

const router = express.Router();

router.post("/upload", upload.array("image", 4), createProduct);
router.get("/get-product", getProduct);
router.get("/get-product/:id", getSingleProduct);
router.put("/update-product/:id", upload.array("image", 4), updateProduct);
router.delete("/delete-product/:id", deleteProduct);
module.exports = router;
