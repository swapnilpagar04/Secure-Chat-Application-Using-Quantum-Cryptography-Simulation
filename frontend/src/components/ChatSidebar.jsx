import React from "react";

const ChatSidebar = ({ contacts, selectedContact, onSelect }) => {
  return (
    <>
      {contacts.map((c) => (
        <div
          key={c._id}
          className={`qchat-chat-item ${
            selectedContact?._id === c._id ? "active" : ""
          }`}
          onClick={() => onSelect(c)}
        >
          <img
            src={c.avatarUrl || "/default-avatar.png"}
            alt={c.username}
            className="qchat-chat-avatar"
          />
          <div className="qchat-chat-texts">
            <div className="qchat-chat-name">{c.username}</div>
            {/* <div className="qchat-chat-preview">hi rohit how are you</div> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatSidebar;


// import React from "react";

// const ChatSidebar = ({ contacts, selectedContact, onSelect }) => {
//   return (
//     <div className="chat-sidebar">
//       <div className="chat-sidebar-header">Chats</div>
//       <div className="chat-search">
//         <input placeholder="search or start a new chat" />
//       </div>
//       <div className="chat-list">
//         {contacts.map((c) => (
//           <div
//             key={c._id}
//             className={`chat-list-item ${
//               selectedContact?._id === c._id ? "active" : ""
//             }`}
//             onClick={() => onSelect(c)}
//           >
//             <img
//               src={c.avatarUrl || "/default-avatar.png"}
//               alt={c.username}
//               className="chat-avatar"
//             />
//             <div>
//               <div className="chat-name">{c.username}</div>
//               <div className="chat-preview">hi rohit how are you</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;