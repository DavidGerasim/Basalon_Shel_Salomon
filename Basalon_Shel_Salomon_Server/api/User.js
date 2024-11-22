const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const nodemailer = require("nodemailer");

// Password validation function
const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password is too short!";
  }

  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter!";
  }

  if (!/[!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]/.test(password)) {
    return "Password must contain at least one special character!";
  }

  return null;
};

// Validate input fields
const validateSignUpInputs = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phoneNumber,
}) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !phoneNumber
  ) {
    return "Empty input fields!";
  }

  // Validate name fields
  if (!/^[a-zA-Z ]*$/.test(firstName) || !/^[a-zA-Z ]*$/.test(lastName)) {
    return "Invalid name entered";
  }

  // Validate email format
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Invalid email entered";
  }

  // Validate password match
  if (password !== confirmPassword) {
    return "Passwords do not match!";
  }

  // Validate phone number (simple check for numbers and length)
  if (!/^\d{10}$/.test(phoneNumber)) {
    return "Invalid phone number!";
  }

  return null;
};

// Hash password
const hashPassword = (password) => bcrypt.hash(password, 10);

// Check if user already exists
const userExists = (email) => User.findOne({ email });
const phoneNumberExists = (phoneNumber) => User.findOne({ phoneNumber });

// Signup Route---------------------------------------------------------------
router.post("/signup", async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { firstName, lastName, password, confirmPassword, phoneNumber } =
    req.body;

  console.log("Signup request received:", { ...req.body, email });

  // Validate input fields
  const validationError = validateSignUpInputs({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
  });
  if (validationError) {
    console.log("Validation error:", validationError);
    return res.status(400).json({ message: validationError });
  }

  // Validate password
  const passwordValidationError = validatePassword(password);
  if (passwordValidationError) {
    console.log("Password validation error:", passwordValidationError);
    return res.status(400).json({ message: passwordValidationError });
  }

  try {
    // Check if user already exists
    const existingUser = await userExists(email);
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res
        .status(400)
        .json({ message: "User with the provided email already exists" });
    }

    // Check if phone number already exists
    const existingPhoneNumber = await phoneNumberExists(phoneNumber);
    if (existingPhoneNumber) {
      console.log("Phone number already exists:", existingPhoneNumber);
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed successfully");

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    console.log("New user saved:", newUser);

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    console.log("JWT token created:", token);

    // Save user ID in session
    req.session.userId = newUser._id;

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    console.error("Error during signup: ", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the account" });
  }
});

// Signin Route---------------------------------------------------------------
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  console.log("Signin request received:", req.body);

  if (!email || !password) {
    console.log("Empty credentials supplied");
    return res.status(400).json({ message: "Empty credentials supplied" });
  }

  try {
    const user = await userExists(email);
    if (!user) {
      console.log("Invalid credentials entered! User not found.");
      return res.status(400).json({ message: "Invalid credentials entered!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password entered!");
      return res.status(400).json({ message: "Invalid password entered!" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    console.log("JWT token created:", token);

    // Save user ID in session
    req.session.userId = user._id;

    // Return response with necessary info
    res.status(200).json({
      message: "Signin successful",
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } catch (error) {
    console.error("Error during signin: ", error);
    res.status(500).json({ message: "An error occurred during signin" });
  }
});

// User Profile Route--------------------------------------------------------
router.get("/profile", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("User profile request received. Token:", token);

  if (!token) {
    console.log("No token provided.");
    return res.status(403).json({ message: "Token is required!" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    console.log("Decoded token:", decoded);
    const userId = decoded.userId;

    // Fetch user data from database
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found!" });
    }

    // Return user profile data
    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      gigs: user.gigs,
    });
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user profile" });
  }
});

// Update User Details--------------------------------------------------------
router.put("/update", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    console.log("No token provided.");
    return res.status(403).json({ message: "Token is required!" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    console.log("Decoded token:", decoded);

    const userId = decoded.userId;

    const { field, value } = req.body;
    console.log("Request body:", req.body);

    const allowedFields = ["firstName", "lastName", "password", "phoneNumber"];

    if (!allowedFields.includes(field)) {
      console.log("Invalid field:", field);
      return res.status(400).json({ message: "Invalid field!" });
    }

    let updateValue = value;

    // Validation for phone number
    if (field === "phoneNumber") {
      if (!/^\d{10}$/.test(value)) {
        console.log("Invalid phone number:", value);
        return res.status(400).json({ message: "Invalid phone number!" });
      }

      const existingUser = await User.findOne({ phoneNumber: value });
      if (existingUser && existingUser._id.toString() !== userId) {
        console.log("Phone number already exists:", value);
        return res
          .status(400)
          .json({ message: "Phone number already exists!" });
      }
    }

    // Validation for password
    if (field === "password") {
      const passwordValidationError = validatePassword(value);
      if (passwordValidationError) {
        console.log(passwordValidationError);
        return res.status(400).json({ message: passwordValidationError });
      }
      updateValue = await bcrypt.hash(value, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: updateValue },
      { new: true, select: "-password" }
    );

    console.log("Updated User:", updatedUser);

    if (!updatedUser) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Error updating user info" });
  }
});

// Update Password Route-----------------------------------------------------
router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("Received request to update password for email:", email);

  // Validate input
  if (!email || !newPassword) {
    console.log("Validation failed: Missing email or new password.");
    return res
      .status(400)
      .json({ message: "Email and new password are required." });
  }

  // Validate the new password
  const passwordValidationError = validatePassword(newPassword);
  if (passwordValidationError) {
    console.log("Password validation error:", passwordValidationError);
    return res.status(400).json({ message: passwordValidationError });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    console.log("Password updated successfully for user:", email);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the password." });
  }
});

// Signout Route--------------------------------------------------------------
router.post("/signout", (req, res) => {
  console.log("Signout request received");
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to sign out:", err);
      return res.status(500).json({ message: "Failed to sign out" });
    }
    console.log("Signout successful");
    res.json({ message: "Signout successful" });
  });
});

// Profile Picture Route-----------------------------------------------------
router.put(
  "/profile/image",
  upload.single("profilePicture"),
  async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      console.log("Token not provided");
      return res.status(403).json({ message: "Token is required!" });
    }

    try {
      console.log("Token received:", token);

      const decoded = jwt.verify(token, "your-secret-key");
      console.log("Token decoded successfully:", decoded);

      const userId = decoded.userId;
      console.log("User ID extracted from token:", userId);

      const profilePicture = req.file.path;
      if (!profilePicture) {
        console.log("Profile picture not found in request");
        return res
          .status(400)
          .json({ message: "Profile picture is required!" });
      }
      console.log("Profile picture path:", profilePicture);

      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: profilePicture },
        { new: true }
      );

      if (!user) {
        console.log("User not found with ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log(
        "Profile image updated successfully in database for user:",
        user
      );

      res.status(200).json({
        message: "Profile image updated successfully",
        profilePicture,
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({
        message: "An error occurred while updating the profile image",
      });
    }
  }
);

// Forgot Password-----------------------------------------------------
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "basalonshelsalomonservice@gmail.com",
    pass: "nbeg cfxs yvza ntjg",
  },
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Received reset password request for email: ${email}`);

    const verificationCode = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    await transporter.sendMail({
      from: "your-service-email@gmail.com",
      to: email,
      subject: "Password Reset Code",
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    });
    console.log(`Email sent to: ${email}`);

    res.status(200).json({
      success: true,
      message: "Verification code sent",
      code: verificationCode,
      email,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch all users from the database-----------------------------------------------------
router.get("/users", async (req, res) => {
  console.log("Received request to fetch all users.");
  try {
    const users = await User.find().select("-password");
    console.log("Successfully fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
});

module.exports = router;
