import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";
import "../styles/Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
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
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("Login success, navigating to /chats");
      navigate("/chats");
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
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit}>
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

          {/* Password */}
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
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="auth-link">
              Forget Password?
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;










// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axiosClient";
// import "../styles/Auth.css";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ phone: "", password: "" });
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
//       const res = await api.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/chats");
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
//         <h2 className="auth-title">Login</h2>

//         <form onSubmit={handleSubmit}>
//           {/* Mobile No */}
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
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="auth-row">
//             <label>
//               <input type="checkbox" /> Remember me
//             </label>
//             <button type="button" className="auth-link">
//               Forget Password?
//             </button>
//           </div>

//           {error && <p className="auth-error">{error}</p>}

//           <button type="submit" className="auth-button" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="auth-footer">
//           Don't have account? <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;