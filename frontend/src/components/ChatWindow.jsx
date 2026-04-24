import React from "react";

const ChatWindow = ({ contact, messages, text, setText, onSend, currentUser }) => {
  if (!contact) {
    return null;
  }

  return (
    <div className="qchat-main-chat-area">
      <div className="qchat-main-chat-header">{contact.username}</div>

      <div className="qchat-main-chat-body">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`qchat-bubble ${
              m.from === currentUser.id ? "me" : "them"
            }`}
          >
            {m.body}
          </div>
        ))}
      </div>

      <div className="qchat-main-chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

// import React, { useEffect, useState } from "react";
// import api from "../api/axiosClient";

// const ChatWindow = ({ contact }) => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     if (!contact) return;
//     const fetchMessages = async () => {
//       const res = await api.get(`/chat/messages/${contact._id}`);
//       setMessages(res.data);
//     };
//     fetchMessages();
//   }, [contact]);

//   const handleSend = async () => {
//     if (!text.trim() || !contact) return;
//     const res = await api.post("/chat/messages", { to: contact._id, body: text });
//     setMessages((prev) => [...prev, res.data]);
//     setText("");
//   };

//   if (!contact) {
//     return (
//       <div className="chat-window empty">
//         <div className="chat-empty-center">
//           <h2>Qchat for you!!!!!</h2>
//           <p>send and receive message with</p>
//           <p>using quantum key cryptography</p>
//           <p className="chat-footer-text">end to end secured with cryptography</p>
//         </div>
//       </div>
//     );
//   }

//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   return (
//     <div className="chat-window">
//       <div className="chat-window-header">{contact.username}</div>
//       <div className="chat-window-body">
//         {messages.map((m) => (
//           <div
//             key={m._id}
//             className={`chat-bubble ${
//               m.from === currentUser.id ? "me" : "them"
//             }`}
//           >
//             {m.body}
//           </div>
//         ))}
//       </div>
//       <div className="chat-window-input">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;