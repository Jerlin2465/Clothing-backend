const express = require("express");
const dns = require("dns");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/db");

const register = require("./router/register");
const addProductRoutes = require("./router/uploadRouter");
const cartRouter = require("./router/cartRouter");
const wishlistRouter = require("./router/wishlistRouter");
const paymentRouter = require("./router/razorRouter");
const orderRouter = require("./router/orderRouter");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://localhost:5001",
        "https://clothing-e-com-alpha.vercel.app",
        "https://clothing-e-com-v6ww.onrender.com",
      ];

      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.use("/api", register);
app.use("/get-product", addProductRoutes);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/payment", paymentRouter);
app.use("/order", orderRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
