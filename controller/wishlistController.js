const Wishlist = require("../model/wishlistModel");

const addWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId }],
      });
    } else {
      // safety check
      wishlist.items = wishlist.items || [];

      const index = wishlist.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index === -1) {
        wishlist.items.push({ productId });
      } else {
        return res.status(400).json({ message: "Already in wishlist" });
      }
    }

    await wishlist.save();

    console.log("Saved Wishlist ", wishlist); 

    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// get
const getwishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.userId,
    }).populate("items.productId");

    console.log("Fetched Wishlist ", wishlist);

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(wishlist); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//remove
const removeWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addWishlist, getwishlist, removeWishlist };