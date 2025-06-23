import { useNotify } from "../context/NotifyContext";
import React from "react";

function Notify() {
  const { message } = useNotify();

  if (!message) return null;

  return <div className="notify">{message}</div>;
}

export default Notify;
