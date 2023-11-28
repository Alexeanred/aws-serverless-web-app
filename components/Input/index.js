import React from "react";
import styles from "./Input.module.css";

const Input = ({ placeholder, name, onChange}) => {
    
  return (
    <div className={styles.section}>
      <input
        className={styles.input}
        onChange={onChange}
        name={name}
      />
      <label className={styles.label} >
        {placeholder}
      </label>
    </div>
  );
};

export default Input;
