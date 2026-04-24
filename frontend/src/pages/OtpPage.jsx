import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import "../styles/Auth.css";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  useEffect(() => {
    inputRef0.current?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length !== 4) {
      setError("Enter 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register/verify-otp", {
        phone,
        otp: code,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-close">×</button>
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="otp-display">
            <span>{phone || "+91XXXXXXXXXX"}</span>
            <button type="button" className="auth-link">
              Edit
            </button>
          </div>

          <div>
            <div className="auth-label-row">
              <span>Enter OTP</span>
            </div>
            <div className="otp-inputs">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={inputRefs[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="auth-label-row">
              <span>
                <span>Password</span>
                <span className="auth-icon">🔒</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;



// import React, { useState, useRef } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import api from "../api/axiosClient";
// import "../styles/Auth.css";

// const OtpPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const phone = location.state?.phone || "";

//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Refs for each OTP input
//   const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

//   const handleChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Move to next box automatically
//     if (value && index < 3) {
//       inputRefs[index + 1].current?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     // Backspace on empty box goes to previous
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs[index - 1].current?.focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const code = otp.join("");
//     if (code.length !== 4) {
//       setError("Enter 4-digit OTP");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/register/verify-otp", {
//         phone,
//         otp: code,
//         password,
//       });
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <button className="auth-close">×</button>
//         <h2 className="auth-title">Register</h2>

//         <form onSubmit={handleSubmit}>
//           {/* Phone display bar */}
//           <div className="otp-display">
//             <span>{phone || "+91XXXXXXXXXX"}</span>
//             <button type="button" className="auth-link">
//               Edit
//             </button>
//           </div>

//           {/* OTP */}
//           <div>
//             <div className="auth-label-row">
//               <span>Enter OTP</span>
//             </div>
//             <div className="otp-inputs">
//               {otp.map((digit, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   ref={inputRefs[idx]}
//                   onChange={(e) => handleChange(idx, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(idx, e)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <div className="auth-label-row">
//               <span>
//                 <span>Password</span>
//                 <span className="auth-icon">🔒</span>
//               </span>
//             </div>
//             <input
//               className="auth-input"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {error && <p className="auth-error">{error}</p>}

//           <button type="submit" className="auth-button" disabled={loading}>
//             {loading ? "Verifying..." : "Register"}
//           </button>
//         </form>

//         <p className="auth-footer">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OtpPage;



// // import React, { useState, useRef, useEffect } from "react";
// // import { useLocation, useNavigate, Link } from "react-router-dom";
// // import api from "../api/axiosClient";
// // import "../styles/Auth.css";

// // const OtpPage = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const phone = location.state?.phone || "";
// //   const username = location.state?.username || "";

// //   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // ✅ Valid use of refs: declare each one explicitly
// //   const inputRef0 = useRef(null);
// //   const inputRef1 = useRef(null);
// //   const inputRef2 = useRef(null);
// //   const inputRef3 = useRef(null);
// //   const inputRef4 = useRef(null);
// //   const inputRef5 = useRef(null);

// //   const inputRefs = [
// //     inputRef0,
// //     inputRef1,
// //     inputRef2,
// //     inputRef3,
// //     inputRef4,
// //     inputRef5,
// //   ];

// //   // Optional: auto-focus first box on mount
// //   useEffect(() => {
// //     inputRef0.current?.focus();
// //   }, []);

// //   const handleChange = (index, value) => {
// //     if (!/^\d*$/.test(value)) return;

// //     const newOtp = [...otp];
// //     newOtp[index] = value;
// //     setOtp(newOtp);

// //     // Move to next box automatically
// //     if (value && index < otp.length - 1) {
// //       inputRefs[index + 1].current?.focus();
// //     }
// //   };

// //   const handleKeyDown = (index, e) => {
// //     // Backspace on empty box -> go to previous
// //     if (e.key === "Backspace" && !otp[index] && index > 0) {
// //       inputRefs[index - 1].current?.focus();
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     const code = otp.join("");
// //     if (code.length < 4) {
// //       setError("Enter full OTP");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const confirmation = window.confirmationResult;
// //       if (!confirmation) {
// //         setError("OTP session expired, go back and resend.");
// //         setLoading(false);
// //         return;
// //       }

// //       // 🔐 Verify OTP with Firebase (set by signInWithPhoneNumber on Register page)
// //       const result = await confirmation.confirm(code);
// //       const firebaseUser = result.user;

// //       // Get Firebase ID token
// //       const idToken = await firebaseUser.getIdToken();

// //       // Send to your backend to create user + JWT
// //       const res = await api.post("/auth/firebase-register", {
// //         idToken,
// //         username,
// //         password,
// //       });

// //       // Save your own JWT/user and go to chats
// //       localStorage.setItem("token", res.data.token);
// //       localStorage.setItem("user", JSON.stringify(res.data.user));

// //       navigate("/chats");
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.message || "OTP verification failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <div className="auth-card">
// //         <button className="auth-close">×</button>
// //         <h2 className="auth-title">Register</h2>

// //         <form onSubmit={handleSubmit}>
// //           <div className="otp-display">
// //             <span>{phone}</span>
// //             <button type="button" className="auth-link">
// //               Edit
// //             </button>
// //           </div>

// //           <div>
// //             <div className="auth-label-row">
// //               <span>Enter OTP</span>
// //             </div>
// //             <div className="otp-inputs">
// //               {otp.map((digit, idx) => (
// //                 <input
// //                   key={idx}
// //                   type="text"
// //                   maxLength={1}
// //                   value={digit}
// //                   ref={inputRefs[idx]}
// //                   onChange={(e) => handleChange(idx, e.target.value)}
// //                   onKeyDown={(e) => handleKeyDown(idx, e)}
// //                 />
// //               ))}
// //             </div>
// //           </div>

// //           <div>
// //             <div className="auth-label-row">
// //               <span>
// //                 <span>Password</span>
// //                 <span className="auth-icon">🔒</span>
// //               </span>
// //             </div>
// //             <input
// //               className="auth-input"
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //             />
// //           </div>

// //           {error && <p className="auth-error">{error}</p>}

// //           <button type="submit" className="auth-button" disabled={loading}>
// //             {loading ? "Verifying..." : "Register"}
// //           </button>
// //         </form>

// //         <p className="auth-footer">
// //           Already have an account? <Link to="/login">Login</Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OtpPage;


