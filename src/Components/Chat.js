import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
let dialog = [];

const Chats = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({});
  const [dataGet, setDataGet] = useState({});

  useEffect(() => {
    const id = setInterval(() => {
      btnGet();
    }, 6000);

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
    <div style={{ width: 200 }}>
      <div>
        ID: {location.state.id} -{" "}
        <button onClick={() => navigate("/")}>Exit</button>
        <br />
        <span>Чат с - {location.state.tel}</span>
      </div>
      <div>
        <div>
          {dialog.map((item) => {
            if (item.chatId === telefon && item.senderName === "Me") {
              return (
                <div key={item.idMessage} style={{ textAlign: "right" }}>
                  {item.senderName} - {item.message}
                </div>
              );
            } else {
              return (
                <div key={item.idMessage}>
                  {item.senderName} - {item.message}
                </div>
              );
            }
          })}
        </div>
      </div>
      <div>
        <div id="dialog"></div>

        <br />
        <textarea
          placeholder="Text message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button onClick={btnSend}>Отправить</button>
        {/* <button onClick={btnGet}>Получить</button> */}
      </div>
    </div>
  );
};

export default Chats;
