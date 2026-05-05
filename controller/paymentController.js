require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../model/paymentModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAYMENT_ID,
  key_secret: process.env.RAZOR_SECRET_KEY,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("createOrder error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("verifyPayment req.body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      totalAmount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment fields",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZOR_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    // ✅ Signature matched — save payment record
    const payment = new Payment({
      totalAmount: totalAmount || 0,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_status: "paid",
    });

    await payment.save();
    console.log(" Payment saved:", payment._id);

    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
    });
  } catch (error) {
    console.error("verifyPayment error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
