import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import "../styles/Chats.css";

const ChatsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [keyId, setKeyId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // Load contacts once
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/chat/chats");
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    fetchContacts();
  }, []);

  // Helper to load messages for a contact
  const loadMessages = async (contactId) => {
    try {
      const msgRes = await api.get(`/chat/messages/${contactId}`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // When a contact is selected -> start QKD once + initial load
  useEffect(() => {
    if (!selectedContact) return;

    const startQkdAndInitialLoad = async () => {
      try {
        const qkdRes = await api.post("/qkd/session", {
          toUserId: selectedContact._id,
        });
        setKeyId(qkdRes.data.keyId);

        await loadMessages(selectedContact._id);
      } catch (err) {
        console.error("Failed to start QKD or load messages", err);
      }
    };

    startQkdAndInitialLoad();
  }, [selectedContact]);

  // POLLING: refresh messages every 2s while a chat is open
  useEffect(() => {
    if (!selectedContact) return;

    const interval = setInterval(() => {
      loadMessages(selectedContact._id);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [selectedContact]);

  const handleSend = async () => {
    if (!text.trim() || !selectedContact || !keyId) return;
    try {
      const res = await api.post("/chat/messages", {
        to: selectedContact._id,
        body: text,
        keyId,
      });
      // Optimistic update for sender
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="qchat-shell">
      {/* LEFT APP SIDEBAR */}
      <div className="qchat-app-sidebar">
        <div className="qchat-logo">Qchat</div>
        <div className="qchat-app-icons">
          <div className="qchat-icon-row">≡</div>
          <div className="qchat-icon-row">💬</div>
          <div className="qchat-icon-row">⚙</div>
        </div>
        <div
          className="qchat-app-user"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          🙂
        </div>
      </div>

      {/* MIDDLE CHATS LIST PANEL */}
      <div className="qchat-chats-panel">
        <div className="qchat-chats-header">Chats</div>
        <div className="qchat-search-wrapper">
          <input
            className="qchat-search-input"
            placeholder="search or start a new chat"
          />
        </div>
        <div className="qchat-chats-divider" />

        <div className="qchat-chats-list">
          <ChatSidebar
            contacts={contacts}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
          />
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="qchat-main-panel">
        <div className="qchat-main-topbar" />

        {!selectedContact ? (
          <div className="qchat-main-center">
            <h2>Qchat for you!!!!!</h2>
            <p>send and receive message with</p>
            <p>using quantum key cryptography</p>
            <p className="qchat-main-foot">
              end to end secured with cryptography
            </p>
          </div>
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={messages}
            text={text}
            setText={setText}
            onSend={handleSend}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default ChatsPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axiosClient";
// import ChatSidebar from "../components/ChatSidebar";
// import ChatWindow from "../components/ChatWindow";
// import "../styles/Chats.css";

// const ChatsPage = () => {
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [keyId, setKeyId] = useState(null);


//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

//   const navigate = useNavigate();

//   // Load contacts once
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await api.get("/chat/chats");
//         setContacts(res.data);
//       } catch (err) {
//         console.error("Failed to load chats", err);
//       }
//     };

//     fetchContacts();
//   }, []);

//   // When a contact is selected -> start QKD + load messages
//   useEffect(() => {
//     if (!selectedContact) return;

//     const startQkdAndLoadMessages = async () => {
//       try {
//         const qkdRes = await api.post("/qkd/session", {
//           toUserId: selectedContact._id,
//         });
//         setKeyId(qkdRes.data.keyId);

//         const msgRes = await api.get(`/chat/messages/${selectedContact._id}`);
//         setMessages(msgRes.data);
//       } catch (err) {
//         console.error("Failed to start QKD or load messages", err);
//       }
//     };

//     startQkdAndLoadMessages();
//   }, [selectedContact]);

//   const handleSend = async () => {
//     if (!text.trim() || !selectedContact || !keyId) return;
//     try {
//       const res = await api.post("/chat/messages", {
//         to: selectedContact._id,
//         body: text,
//         keyId,
//       });
//       setMessages((prev) => [...prev, res.data]);
//       setText("");
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   return (
//     // IMPORTANT: root wrapper is ONLY qchat-shell, nothing else
//     <div className="qchat-shell">
//       {/* LEFT APP SIDEBAR */}
//       <div className="qchat-app-sidebar">
//         <div className="qchat-logo">Qchat</div>
//         <div className="qchat-app-icons">
//           <div className="qchat-icon-row">≡</div>
//           <div className="qchat-icon-row">💬</div>
//           <div className="qchat-icon-row">⚙</div>
//         </div>
//         <div className="qchat-app-user" onClick={() => navigate("/profile")}>🙂</div>
//       </div>

//       {/* MIDDLE CHATS LIST PANEL */}
//       <div className="qchat-chats-panel">
//         <div className="qchat-chats-header">Chats</div>
//         <div className="qchat-search-wrapper">
//           <input
//             className="qchat-search-input"
//             placeholder="search or start a new chat"
//           />
//         </div>
//         <div className="qchat-chats-divider" />

//         <div className="qchat-chats-list">
//           <ChatSidebar
//             contacts={contacts}
//             selectedContact={selectedContact}
//             onSelect={setSelectedContact}
//           />
//         </div>
//       </div>

//       {/* RIGHT MAIN PANEL */}
//       <div className="qchat-main-panel">
//         <div className="qchat-main-topbar" />

//         {!selectedContact ? (
//           <div className="qchat-main-center">
//             <h2>Qchat for you!!!!!</h2>
//             <p>send and receive message with</p>
//             <p>using quantum key cryptography</p>
//             <p className="qchat-main-foot">
//               end to end secured with cryptography
//             </p>
//           </div>
//         ) : (
//           <ChatWindow
//             contact={selectedContact}
//             messages={messages}
//             text={text}
//             setText={setText}
//             onSend={handleSend}
//             currentUser={currentUser}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatsPage;

// import React, { useEffect, useState } from "react";
// import api from "../api/axiosClient";
// import ChatSidebar from "../components/ChatSidebar"; // your existing sidebar
// import ChatWindow from "../components/ChatWindow";
// import "../styles/Chats.css";

// const ChatsPage = () => {
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [keyId, setKeyId] = useState(null);

//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

//   // 1) Load chat list (middle column)
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await api.get("/chat/chats");
//         setContacts(res.data);
//       } catch (err) {
//         console.error("Failed to load chats", err);
//       }
//     };

//     fetchContacts();
//   }, []);

//   // 2) When a contact is selected: start QKD session and load messages
//   useEffect(() => {
//     if (!selectedContact) return;

//     const startQkdAndLoadMessages = async () => {
//       try {
//         // Start BB84 session -> get keyId
//         const qkdRes = await api.post("/qkd/session", {
//           toUserId: selectedContact._id,
//         });
//         setKeyId(qkdRes.data.keyId);

//         // Load existing messages (already decrypted by backend)
//         const msgRes = await api.get(`/chat/messages/${selectedContact._id}`);
//         setMessages(msgRes.data);
//       } catch (err) {
//         console.error("Failed to start QKD or load messages", err);
//       }
//     };

//     startQkdAndLoadMessages();
//   }, [selectedContact]);

//   // 3) Send message using keyId
//   const handleSend = async () => {
//     if (!text.trim() || !selectedContact || !keyId) return;

//     try {
//       const res = await api.post("/chat/messages", {
//         to: selectedContact._id,
//         body: text,
//         keyId,
//       });

//       setMessages((prev) => [...prev, res.data]);
//       setText("");
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   return (
//     <div className="qchat-shell">
//       {/* LEFT APP SIDEBAR + MIDDLE CHATS LIST (your existing layout) */}
//       <div className="qchat-app-sidebar">
//         <div className="qchat-logo">Qchat</div>
//         <div className="qchat-app-icons">
//           <div className="qchat-icon-row">≡</div>
//           <div className="qchat-icon-row">💬</div>
//           <div className="qchat-icon-row">⚙</div>
//         </div>
//         <div className="qchat-app-user">🙂</div>
//       </div>

//       <div className="qchat-chats-panel">
//         <div className="qchat-chats-header">Chats</div>
//         <div className="qchat-search-wrapper">
//           <input
//             className="qchat-search-input"
//             placeholder="search or start a new chat"
//           />
//         </div>
//         <div className="qchat-chats-divider" />

//         <div className="qchat-chats-list">
//           <ChatSidebar
//             contacts={contacts}
//             selectedContact={selectedContact}
//             onSelect={setSelectedContact}
//           />
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="qchat-main-panel">
//         <div className="qchat-main-topbar" />

//         {!selectedContact ? (
//           <div className="qchat-main-center">
//             <h2>Qchat for you!!!!!</h2>
//             <p>send and receive message with</p>
//             <p>using quantum key cryptography</p>
//             <p className="qchat-main-foot">
//               end to end secured with cryptography
//             </p>
//           </div>
//         ) : (
//           <ChatWindow
//             contact={selectedContact}
//             messages={messages}
//             text={text}
//             setText={setText}
//             onSend={handleSend}
//             currentUser={currentUser}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatsPage;


// // import React, { useEffect, useState } from "react";
// // import api from "../api/axiosClient";
// // import "../styles/Chats.css";

// // const ChatsPage = () => {
// //   const [contacts, setContacts] = useState([]);
// //   const [selectedContact, setSelectedContact] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [text, setText] = useState("");

// //   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

// //   // Load chat list (middle column)
// //   useEffect(() => {
// //     const fetchContacts = async () => {
// //       try {
// //         const res = await api.get("/chat/chats");
// //         setContacts(res.data);
// //       } catch (err) {
// //         console.error("Failed to load chats", err);
// //       }
// //     };

// //     fetchContacts();
// //   }, []);

// //   // Load messages whenever a user is selected
// //   useEffect(() => {
// //     if (!selectedContact) return;

// //     const fetchMessages = async () => {
// //       try {
// //         const res = await api.get(`/chat/messages/${selectedContact._id}`);
// //         setMessages(res.data);
// //       } catch (err) {
// //         console.error("Failed to load messages", err);
// //       }
// //     };

// //     fetchMessages();
// //   }, [selectedContact]);

// //   const handleSend = async () => {
// //     if (!text.trim() || !selectedContact) return;

// //     try {
// //       const res = await api.post("/chat/messages", {
// //         to: selectedContact._id,
// //         body: text,
// //       });
// //       setMessages((prev) => [...prev, res.data]);
// //       setText("");
// //     } catch (err) {
// //       console.error("Failed to send message", err);
// //     }
// //   };

// //   return (
// //     <div className="qchat-shell">
// //       {/* LEFT APP SIDEBAR (as in your design) */}
// //       <div className="qchat-app-sidebar">
// //         <div className="qchat-logo">Qchat</div>
// //         <div className="qchat-app-icons">
// //           <div className="qchat-icon-row">≡</div>
// //           <div className="qchat-icon-row">💬</div>
// //           <div className="qchat-icon-row">⚙</div>
// //         </div>
// //         <div className="qchat-app-user">🙂</div>
// //       </div>

// //       {/* MIDDLE CHATS LIST PANEL (matches screenshot) */}
// //       <div className="qchat-chats-panel">
// //         <div className="qchat-chats-header">Chats</div>

// //         <div className="qchat-search-wrapper">
// //           <input
// //             className="qchat-search-input"
// //             placeholder="search or start a new chat"
// //           />
// //         </div>

// //         <div className="qchat-chats-divider" />

// //         <div className="qchat-chats-list">
// //           {contacts.map((c) => (
// //             <div
// //               key={c._id}
// //               className={`qchat-chat-item ${
// //                 selectedContact?._id === c._id ? "active" : ""
// //               }`}
// //               onClick={() => setSelectedContact(c)}
// //             >
// //               <img
// //                 src={c.avatarUrl || "/default-avatar.png"}
// //                 alt={c.username}
// //                 className="qchat-chat-avatar"
// //               />
// //               <div className="qchat-chat-texts">
// //                 <div className="qchat-chat-name">{c.username}</div>
// //                 <div className="qchat-chat-preview">hi rohit how are you</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* RIGHT MAIN PANEL */}
// //       <div className="qchat-main-panel">
// //         {/* top dark strip */}
// //         <div className="qchat-main-topbar" />

// //         {/* If no contact is selected, show your hero text (exactly like image) */}
// //         {!selectedContact && (
// //           <div className="qchat-main-center">
// //             <h2>Qchat for you!!!!!</h2>
// //             <p>send and receive message with</p>
// //             <p>using quantum key cryptography</p>
// //             <p className="qchat-main-foot">end to end secured with cryptography</p>
// //           </div>
// //         )}

// //         {/* If a contact is selected, show messages at bottom (same background) */}
// //         {selectedContact && (
// //           <div className="qchat-main-chat-area">
// //             <div className="qchat-main-chat-header">
// //               {selectedContact.username}
// //             </div>
// //             <div className="qchat-main-chat-body">
// //               {messages.map((m) => (
// //                 <div
// //                   key={m._id}
// //                   className={`qchat-bubble ${
// //                     m.from === currentUser.id ? "me" : "them"
// //                   }`}
// //                 >
// //                   {m.body}
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="qchat-main-chat-input">
// //               <input
// //                 value={text}
// //                 onChange={(e) => setText(e.target.value)}
// //                 placeholder="Type a message"
// //               />
// //               <button onClick={handleSend}>Send</button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatsPage;