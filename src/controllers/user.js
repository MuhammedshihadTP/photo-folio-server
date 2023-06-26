const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user");
const imageModel = require("../model/image");

module.exports = {
  register: async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failure",
        message: "User already exists",
        error_message: "Field registration",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ ...req.body, password: hashPassword });
    await user.save();

    res.status(201).json({
      status: "success",
      message: "Successfully Registed",
      data: user,
    });
  },

  loogin: async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
        error_message: "User Not Founded",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid password",
        error_message: "Invalid Password",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ status: "Success", message: "Successfully Loged", data: token });
  },

  addImage: async (req, res, next) => {
    const { originalname, path } = req.file;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid user",
        error_message: "Invalid User",
      });
    }
    const image = new imageModel({ image: originalname, user: user._id });
    await image.save();

    res.status(200).json({
      status: "Success",
      message: "Image uploaded successfully",
      data: image,
    });
  },

  getImage: async (req, res, next) => {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({
          status: "failed",
          message: "Invalid user",
          error_message: "Image not found",
        });
    }
    const userImages = await imageModel.find({ user: user._id });

    res.status(200).json({ status: "Success", data: userImages });
  },
};
