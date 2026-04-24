// const express = require("express");
// const auth = require("../middleware/authMiddleware");
// const qkdApi = require("../utils/qkdClient");

// const router = express.Router();

// // POST /api/qkd/session
// // Body: { toUserId: "..." }
// // router.post("/session", auth, async (req, res) => {
// //   try {
// //     const { toUserId } = req.body;
// //     if (!toUserId) {
// //       return res.status(400).json({ message: "toUserId is required" });
// //     }

// //     const participants = [String(req.user.id), String(toUserId)];

// //     const response = await qkdApi.post("/bb84/session", {
// //       participants,
// //       num_qubits: 256,
// //       max_error_rate: 0.11,
// //     });

// //     const { keyId, errorRate } = response.data;

// //     // If you want to store mapping (recommended), create a QkdSession model here
// //     // and save: { keyId, userA: req.user.id, userB: toUserId, errorRate }.

// //     return res.json({ keyId, errorRate });
// //   } catch (err) {
// //     console.error("QKD session error:", err.response?.data || err.message);
// //     return res
// //       .status(500)
// //       .json({ message: "Failed to create QKD session" });
// //   }
// // });

// // module.exports = router;



// router.post("/session", auth, async (req, res) => {
//   try {
//     const { toUserId } = req.body;
//     if (!toUserId) {
//       return res.status(400).json({ message: "toUserId is required" });
//     }

//     const participants = [String(req.user.id), String(toUserId)];
//     console.log("Starting QKD session with:", participants);

//     const response = await qkdApi.post("/bb84/session", {
//       participants,
//       num_qubits: 256,
//       max_error_rate: 0.11,
//     });

//     const { keyId, errorRate } = response.data;
//     return res.json({ keyId, errorRate });
//   } catch (err) {
//     console.error("QKD session error:", err.response?.data || err.message);
//     // For debugging, return the error details (remove in production)
//     return res.status(500).json({
//       message: "Failed to create QKD session",
//       error: err.response?.data || err.message,
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const auth = require("../middleware/authMiddleware");
const qkdApi = require("../utils/qkdClient");

const router = express.Router();

// POST /api/qkd/session
// Body: { toUserId: "..." }
router.post("/session", auth, async (req, res) => {
  try {
    const { toUserId } = req.body;
    if (!toUserId) {
      return res.status(400).json({ message: "toUserId is required" });
    }

    const participants = [String(req.user.id), String(toUserId)];
    console.log("Starting QKD session with:", participants);

    const response = await qkdApi.post("/bb84/session", {
      participants,
      num_qubits: 256,
      max_error_rate: 0.11,
    });

    const { keyId, errorRate } = response.data;
    return res.json({ keyId, errorRate });
  } catch (err) {
    if (err.response) {
      console.error(
        "QKD session error (response):",
        err.response.status,
        err.response.data
      );
    } else if (err.request) {
      console.error("QKD session error (no response):", err.message);
    } else {
      console.error("QKD session error (setup):", err.message);
    }

    return res.status(500).json({
      message: "Failed to create QKD session",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;