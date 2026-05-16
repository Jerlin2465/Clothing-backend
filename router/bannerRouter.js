const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  addBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/bannerController");
const upload =require("../middleware/uploads")
const router = express.Router();

router.post("/upload", upload.single("image"), addBanner, (req, res) => {
  console.log("banner add");
});

router.get("/all", getAllBanners);

router.get("/single/:id", getSingleBanner);

router.put("/update/:id", upload.single("image"), updateBanner);

router.delete("/delete/:id", deleteBanner);

module.exports = router;
