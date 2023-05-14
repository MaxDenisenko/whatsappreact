import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth";
import Chats from "./Components/Chat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
