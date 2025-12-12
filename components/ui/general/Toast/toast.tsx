// components/Toast.tsx
import React, { useEffect, useState } from "react";
import styles from "./Notify.module.scss";
import {InformationCircleIcon, CheckIcon} from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [dismiss, setDismiss] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleDismiss = () => {
    setDismiss(true);
    // console.log("called disabled");
    setTimeout(() => {
      setDismiss(false);
    }, 4100);
  };

  return (
    <>
      {dismiss ? null : (
        <div
          className={
            type === "error"
              ? `${styles.notify} ${styles.notify__failed} font-satoshi`
              : `${styles.notify} font-satoshi`
          }
        >
          <div className="flex items-start justify-center">{type === "error" ? (
            <InformationCircleIcon className="size-6 text-[#EF4444]  stroke-2" />
          ) : (
            <CheckIcon className="size-5 text-[#1AB837] stroke-2" />
          )}</div>
          <div className={`${styles.notify__message} break-words text-wrap`}>
            <p className="break-words text-wrap">{message}</p>
          </div>
          
        </div>
      )}
    </>
  );
};

export default Toast;
