// components/Toast.tsx
import React, { useEffect, useState } from "react";
import styles from "./Notify.module.scss";

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
          <div className={`${styles.notify__message} break-words text-wrap`}>
            <p className="break-words text-wrap">{message}</p>
          </div>
          <div className={styles.notify__action}>
            <button onClick={() => handleDismiss()}>Ok</button>
            <button onClick={() => handleDismiss()}>Dismiss</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
