import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Chat = lazy(() => import("./pages/chat"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const SetAvatar = lazy(() => import("./pages/setAvatar"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Chat />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
