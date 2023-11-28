

import React from 'react';
import styles from './CustomButton.module.css';

const CustomButton = ({ onClick, content }) => {
  return (
    <div className={styles.m_btm}>
      <button onClick={onClick} className={styles.vertical_shake} id={styles.btnal}>
        {content}
      </button>
    </div>
  );
};

export default CustomButton;
