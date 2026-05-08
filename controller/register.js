const jwt = require("jsonwebtoken");
const Register = require("../model/register");
const bcrypt = require("bcrypt");

const getDetails = async (req, res) => {
  try {
    const user = await Register.findById(req.user.id).select("-password");
    if (!user) {
      return res.json({ message: "user not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createregister = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, confirmpassword } =
      req.body;

    const exist = await Register.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password mismatch" });
    }

    const hash = await bcrypt.hash(password, 10);

    await Register.create({
      fullname,
      email,
      phoneNumber,
      password: hash,
      role: "user",
    });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Register.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "1d" },
    );

    // res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

module.exports = { getDetails, createregister, loginUser, logoutUser };
