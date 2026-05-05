require("dotenv").config();
const dns = require("dns");

const mongoose = require("mongoose");
const Register = require("./model/register");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  dns.setServers(["1.1.1.1", "1.0.0.1"]);

  await mongoose.connect(process.env.MONGO_URI);

  const exist = await Register.findOne({
    email: "admin@gmail.com",
  });

  if (exist) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await Register.create({
    fullname: "Jerlin",
    email: "admin@gmail.com",
    phoneNumber: 1234567890,
    password: hashPassword,
    role: "admin",
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
