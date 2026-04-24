import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import "../styles/Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register/send-otp", form);
      // go to OTP page, passing phone (and optionally username)
      navigate("/register/otp", { state: { phone: form.phone } });
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
          {/* Username */}
          <div>
            <div className="auth-label-row">
              <span>
                <span>Username</span>
                <span className="auth-icon">👤</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Mobile No */}
          <div>
            <div className="auth-label-row">
              <span>
                <span>Mobile No</span>
                <span className="auth-icon">📞</span>
              </span>
            </div>
            <input
              className="auth-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Sending..." : "Next"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;









// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { auth, setupRecaptcha } from "../firebase";
// import { signInWithPhoneNumber } from "firebase/auth";
// import "../styles/Auth.css";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", phone: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (!form.username || !form.phone) {
//         setError("Enter username and phone");
//         setLoading(false);
//         return;
//       }

//       // Make sure phone is in E.164 format
//       const fullPhone = form.phone.startsWith("+")
//         ? form.phone
//         : "+91" + form.phone; // change country code if needed

//       const verifier = setupRecaptcha();
//       const confirmation = await signInWithPhoneNumber(auth, fullPhone, verifier);

//       // Save confirmation for OTP page
//       window.confirmationResult = confirmation;

//       navigate("/register/otp", {
//         state: { phone: fullPhone, username: form.username },
//       });
//     } catch (err) {
//       console.error("Firebase phone auth error", err);
//       setError(err.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* Required by Firebase: invisible reCAPTCHA root */}
//       <div id="recaptcha-container" />

//       <div className="auth-card">
//         <button className="auth-close">×</button>
//         <h2 className="auth-title">Register</h2>

//         <form onSubmit={handleSubmit}>
//           <div>
//             <div className="auth-label-row">
//               <span>
//                 <span>Username</span>
//                 <span className="auth-icon">👤</span>
//               </span>
//             </div>
//             <input
//               className="auth-input"
//               type="text"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <div className="auth-label-row">
//               <span>
//                 <span>Mobile No</span>
//                 <span className="auth-icon">📞</span>
//               </span>
//             </div>
//             <input
//               className="auth-input"
//               type="tel"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//             />
//           </div>

//           {error && <p className="auth-error">{error}</p>}

//           <button type="submit" className="auth-button" disabled={loading}>
//             {loading ? "Sending..." : "Next"}
//           </button>
//         </form>

//         <p className="auth-footer">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;