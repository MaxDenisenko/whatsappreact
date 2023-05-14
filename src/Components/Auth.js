import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [tel, setTel] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <input
        placeholder="Введите ID"
        type="text"
        value={id}
        onChange={(e) => console.log(setId(e.target.value))}
      />
      <input
        placeholder="Введите Token"
        type="password"
        value={token}
        onChange={(e) => console.log(setToken(e.target.value))}
      />
      <input
        placeholder="tel.number"
        type="text"
        value={tel}
        onChange={(e) => {
          setTel(e.target.value);
        }}
      />
      <button onClick={() => navigate("/chats", { state: { id, token, tel } })}>
        Войти
      </button>
      <p>{id}</p>
      <p>{token}</p>
    </>
  );
};

export default Auth;
