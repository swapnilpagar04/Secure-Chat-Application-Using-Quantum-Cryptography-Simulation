const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Encrypted payload fields
    keyId: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    ciphertext: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);


// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema(
//   {
//     from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     body: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", MessageSchema);