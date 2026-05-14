const Order = require("../model/orderModel");
const Product = require("../model/productUpload");
const sendOrderEmail = require("../units/sendEmail");

const placeOrder = async (req, res) => {
  try {
    console.log("=== placeOrder called ===");

    const { userId, products, totalAmount, paymentStatus, email, name } =
      req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products empty" });
    }

    const amount = Number(totalAmount);
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid totalAmount",
      });
    }

    const formattedProducts = [];

    for (let item of products) {
      const pid = item.productId?._id || item.productId;

      const product = await Product.findById(pid);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Out of stock: ${product.productName}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      formattedProducts.push({
        productId: product._id,
        quantity: item.quantity,
        size: item.size || "",
      });
    }
    const newOrder = new Order({
      userId,
      products: formattedProducts,
      totalAmount: amount,
      paymentStatus: paymentStatus || "Pending",
    });

    const savedOrder = await newOrder.save();

    console.log("Order saved:", savedOrder._id);
    await sendOrderEmail({
      email,
      name,
      totalAmount: amount,
      orderId: savedOrder._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "productName price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("products.productId", "productName price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getUserOrders,
};
