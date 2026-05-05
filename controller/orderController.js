const Order = require("../model/orderModel");
const Product = require("../model/productUpload");

// POST /order/place-order
const placeOrder = async (req, res) => {
  try {
    console.log("=== placeOrder called ===");
    console.log("req.body:", JSON.stringify(req.body, null, 2));

    const { userId, products, totalAmount, paymentStatus } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products are empty" });
    }

    const amount = Number(totalAmount);
    if (!totalAmount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: `totalAmount invalid: received "${totalAmount}"`,
      });
    }

    const formattedProducts = [];

    for (let item of products) {
      const pid = item.productId?._id || item.productId;
      console.log("Looking up productId:", pid);

      const product = await Product.findById(pid);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${pid}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${product.productName}`,
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
      paymentStatus: paymentStatus || "Paid",
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ placeOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /order/all-orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name fullname email")
      .populate("products.productId", "productName price image stock")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /order/user/:userId
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate("products.productId", "productName price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getUserOrders error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { placeOrder, getAllOrders, getUserOrders };
