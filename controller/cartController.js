const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
  const userId = req.userId;
  const { productId, size } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, size }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size,
      );

      if (index !== -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1, size });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId",
    );

    if (!cart) return res.json({ items: [], total: 0 });

    const items = cart.items
      .filter((item) => item.productId) // skip broken refs
      .map((item) => {
        const product = item.productId;
        return {
          productId: product._id.toString(),
          name: product.productName,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
          size: item.size,
          subtotal: product.price * item.quantity,
        };
      });

    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId && i.size === size,
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  const { productId, size } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.productId.toString() === productId && item.size === size),
    );

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.json({ success: true, message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();

    console.log(" Cart cleared for user:", req.userId);
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("clearCart error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeItem,
  clearCart,
};
