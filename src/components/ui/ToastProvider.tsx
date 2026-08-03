"use client";

import nextDynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = nextDynamic(
  () => import("react-toastify").then((m) => m.ToastContainer),
  { ssr: false }
);

export default function ToastProvider() {
  return <ToastContainer position="top-right" autoClose={4000} />;
}
