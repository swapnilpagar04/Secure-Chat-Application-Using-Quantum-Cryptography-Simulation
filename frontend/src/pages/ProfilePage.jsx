import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";  // reuse glass card styles

const ProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}"
  );

  const [about, setAbout] = useState(
    storedUser.about || "just typing and playing with life"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 420 }}>
        <button className="auth-close" onClick={() => navigate("/chats")}>
          ×
        </button>

        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src={storedUser.avatarUrl || "/default-avatar.png"}
            alt={storedUser.username || "User"}
            style={{
              width: 64,
              height: 64,
              borderRadius: "999px",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{storedUser.username || "User"}</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {storedUser.phone || "No phone"}
            </div>
          </div>
        </div>

        {/* About section */}
        <div style={{ marginBottom: "1.2rem" }}>
          <div
            style={{
              fontSize: "0.9rem",
              marginBottom: "0.25rem",
              color: "#3b264b",
            }}
          >
            About
          </div>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              resize: "none",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.3)",
              padding: "0.5rem 0.6rem",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              background: "rgba(255,255,255,0.75)",
              color: "#120819",
            }}
          />
        </div>

        {/* Phone (read-only) */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "0.9rem",
              marginBottom: "0.25rem",
              color: "#3b264b",
            }}
          >
            Phone number
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            {storedUser.phone || "No phone"}
          </div>
        </div>

        <button
          className="auth-button"
          style={{ width: "100%" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;