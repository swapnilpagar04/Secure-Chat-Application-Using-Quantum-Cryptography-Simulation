const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String },

    // OTP-related
    otpCode: { type: String },
    otpExpiresAt: { type: Date },

    // profile bits (for later UI screens)
    about: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);