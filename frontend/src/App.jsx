import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import ChatsPage from "./pages/ChatsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/otp" element={<OtpPage />} />
        <Route
          path="/chats"
          element={token ? <ChatsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="\*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import OtpPage from "./pages/OtpPage";
// import ChatsPage from "./pages/ChatsPage";


// const App = () => {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/register/otp" element={<OtpPage />} />
//         <Route
//           path="/chats"
//           element={token ? <ChatsPage /> : <Navigate to="/login" />}
//         />
//         <Route path="\*" element={<Navigate to="/login" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;