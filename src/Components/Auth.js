import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";
const Auth = () => {
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [tel, setTel] = useState("");
  const navigate = useNavigate();
  if (!id || !token) {
    return (
      <div className="wrapper">
        <div className="auth-wrapper" align="center">
          <h3>Введите данные</h3>
          <input
            className="input-auth"
            placeholder="Введите ID"
            type="text"
            value={id}
            onChange={(e) => console.log(setId(e.target.value))}
          />
          <input
            className="input-auth"
            placeholder="Введите Token"
            type="password"
            value={token}
            onChange={(e) => console.log(setToken(e.target.value))}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="auth-wrapper" align="center">
        <h3>Введите данные</h3>
        <input
          className="input-auth"
          placeholder="Введите ID"
          type="text"
          value={id}
          onChange={(e) => console.log(setId(e.target.value))}
        />
        <input
          className="input-auth"
          placeholder="Введите Token"
          type="password"
          value={token}
          onChange={(e) => console.log(setToken(e.target.value))}
        />

        <input
          className="input-telefon"
          placeholder="70000000000"
          maxLength={11}
          type="tel"
          value={tel}
          onChange={(e) => {
            setTel(e.target.value);
          }}
        />
        <button
          onClick={() => navigate("/chats", { state: { id, token, tel } })}
        >
          Созать чат
        </button>
      </div>
    </div>
  );
};

export default Auth;
