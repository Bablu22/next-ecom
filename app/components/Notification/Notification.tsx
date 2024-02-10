"use client";
import React from "react";
import { ToastContainer, Flip } from "react-toastify";

const Notification = () => {
 return (
  <ToastContainer
   position="top-right"
   autoClose={5000}
   hideProgressBar={false}
   closeOnClick
   rtl={false}
   pauseOnFocusLoss
   draggable
   pauseOnHover
   theme="dark"
   transition={Flip}
  />
 );
};

export default Notification;
