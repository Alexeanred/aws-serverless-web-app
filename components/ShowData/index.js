import React from "react";
import styles from "./Input.module.css";

const ShowData = ({ placeholder, value }) => {
    
  return (
    <div className={styles.section}>
      <input
        className={styles.input}
        value={value}
        readOnly
      />
      <label className={styles.label} >
        {placeholder}
      </label>
    </div>
  );
};

export default ShowData;
