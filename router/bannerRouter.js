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

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("Banner Route Working");
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb("Only Images Are Allowed");
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post("/add", upload.single("image"), addBanner, (req, res) => {
  console.log("banner add");
});

router.get("/all", getAllBanners);

router.get("/single/:id", getSingleBanner);

router.put("/update/:id", upload.single("image"), updateBanner);

router.delete("/delete/:id", deleteBanner);

module.exports = router;
