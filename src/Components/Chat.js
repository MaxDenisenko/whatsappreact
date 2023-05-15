import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/chat.css";

let dialog = [];

const Chats = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({});
  const [dataGet, setDataGet] = useState({});
  const scrollRef = useRef();

  useEffect(() => {
    if (data || dataGet) {
      scrollRef.current.scrollIntoView();
    }
  }, [data, dataGet]);
  useEffect(() => {
    const id = setInterval(() => {
      btnGet();
    }, 2000);

    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  let telefon = location.state.tel + "@c.us";
  const urlSend = `https://api.green-api.com/waInstance${location.state.id}/SendMessage/${location.state.token}
  `;
  const urlGet = `https://api.green-api.com/waInstance${location.state.id}/ReceiveNotification/${location.state.token}
  `;

  const btnSend = (event) => {
    event.preventDefault();
    const newMessage = { chatId: telefon, message };
    let dataSend = axios
      .post(urlSend, newMessage)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));

    setData(dataSend);
    const newDialog = {
      idMessage: data.timestamp,
      chatId: newMessage.chatId,
      senderName: "Me",
      message,
    };
    dialog = [...dialog, newDialog];

    setMessage("");
  };

  const btnGet = async () => {
    try {
      const response = await axios.get(urlGet);
      let receiptId = response.data.receiptId;
      let webhookBody = response.data.body;

      if (webhookBody.typeWebhook === "incomingMessageReceived") {
        DeleteNotification(receiptId);
      }

      if (webhookBody.senderData.chatId === telefon) {
        setDataGet(webhookBody);
        const newmsg = {
          idMessage: webhookBody.timestamp,
          chatId: webhookBody.senderData.chatId,
          senderName: webhookBody.senderData.senderName,
          message: webhookBody.messageData.textMessageData.textMessage,
          type: dataGet.typeWebhook,
        };
        dialog = [...dialog, newmsg];
      }
    } catch (ex) {}
  };

  const DeleteNotification = async (receiptId) => {
    return await axios
      .delete(
        `https://api.green-api.com/waInstance${location.state.id}/DeleteNotification/${location.state.token}/${receiptId}
`
      )
      .then((response) => console.log("New msg"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="wrapper">
      <div className="wrapper-header">
        <div>ID: {location.state.id}</div>
        <div>Чат с {location.state.tel}</div>
        <button onClick={() => navigate("/")}>Выйти из чата</button>
      </div>

      <div className="wrapper-chat">
        {dialog.map((item) => {
          if (item.chatId === telefon && item.senderName === "Me") {
            return (
              <div key={item.idMessage} className="my-message">
                {item.message}
              </div>
            );
          } else {
            return (
              <div key={item.idMessage} className="other-message">
                <span>{item.senderName}</span>
                <br />
                {item.message}
              </div>
            );
          }
        })}
      </div>

      <div className="wrapper-footer">
        <form onSubmit={btnSend}>
          <input
            placeholder="Text message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Отправить</button>
        </form>
      </div>
      <div ref={scrollRef} className="wrapper-scroll"></div>
    </div>
  );
};

export default Chats;
