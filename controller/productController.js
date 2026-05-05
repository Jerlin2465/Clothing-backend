const productUpload = require("../model/productUpload");

const createProduct = async (req, res) => {
  try {
    const { productName, price, description, size, gender, category } =
      req.body;

    let parsedSize = [];
    const image = req.files ? req.files.map((file) => file.filename) : [];

    if (size) {
      parsedSize = JSON.parse(size);
    } else {
      return res.status(400).json({ message: "size must be valid" });
    }

    const product = await productUpload.create({
      productName,
      price,
      description,
      size: parsedSize,
      gender,
      image,
      category,
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { category, gender, size, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    const product = await productUpload.find(filter);

    res.json(product);
  } catch (error) {
    res.status(500).json({ "Get Product": error.message });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const product = await productUpload.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ "Single Product Error": error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { productName, price, description, gender, size, category } =
      req.body;

    const id = req.params.id;
    const product = await productUpload.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.description = description || product.description;
    product.gender = gender || product.gender;
    product.category = category || product.category;

    if (size) {
      product.size = JSON.parse(size);
    }

    const oldImages = JSON.parse(req.body.oldImages || "[]");
    const files = req.files || [];
    const indexes = req.body.index
      ? Array.isArray(req.body.index)
        ? req.body.index
        : [req.body.index]
      : [];

    let updatedImages = [...oldImages];

    files.forEach((file, i) => {
      const index = indexes[i];
      updatedImages[index] = file.filename;
    });

    product.image = updatedImages;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productUpload.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ success: true, message: "Delete Product" });
  } catch (error) {
    console.log({ "Delete error": error });
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
