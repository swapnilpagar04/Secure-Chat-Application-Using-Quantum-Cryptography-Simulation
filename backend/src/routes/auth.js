const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateOtp, sendOtpSms } = require("../services/otpService");

const router = express.Router();

// Step 1: send OTP for registration
router.post("/register/send-otp", async (req, res) => {
  try {
    const { username, phone } = req.body;
    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone required" });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ username, phone });
    } else {
      // update username if changed
      user.username = username;
    }

    const otp = generateOtp(4);
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpCode = otp;
    user.otpExpiresAt = expires;
    await user.save();

    await sendOtpSms(phone, otp);

    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Step 2: verify OTP and set password
router.post("/register/verify-otp", async (req, res) => {
  try {
    const { phone, otp, password } = req.body;
    if (!phone || !otp || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.otpCode || !user.otpExpiresAt || user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // clear OTP fields
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Registration complete" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login with phone + password
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { generateOtp, sendOtpSms } = require("../services/otpService");
// const admin = require("../config/firebaseAdmin");

// const router = express.Router();


// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { phone, password } = req.body;
//     if (!phone || !password) {
//       return res.status(400).json({ message: "Phone and password required" });
//     }

//     const user = await User.findOne({ phone });
//     if (!user || !user.passwordHash) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     return res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         phone: user.phone,
//         avatarUrl: user.avatarUrl,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Firebase-based registration after phone OTP is verified on the frontend
// router.post("/firebase-register", async (req, res) => {
//   try {
//     const { idToken, username, password } = req.body;

//     if (!idToken || !username || !password) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     // Verify Firebase ID token
//     const decoded = await admin.auth().verifyIdToken(idToken);
//     const phone = decoded.phone_number; // comes from Firebase Phone Auth

//     if (!phone) {
//       return res.status(400).json({ message: "No phone in Firebase token" });
//     }

//     // Upsert user in your MongoDB
//     let user = await User.findOne({ phone });
//     if (!user) {
//       user = new User({ username, phone });
//     } else {
//       user.username = username; // update username if changed
//     }

//     // Set password
//     const salt = await bcrypt.genSalt(10);
//     user.passwordHash = await bcrypt.hash(password, salt);
//     await user.save();

//     // Issue your own JWT for the chat app
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     return res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         phone: user.phone,
//         avatarUrl: user.avatarUrl,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Firebase register failed" });
//   }
// });


// module.exports = router;