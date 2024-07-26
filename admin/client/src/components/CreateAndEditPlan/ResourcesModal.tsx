import React from 'react';
import classes from './ResourcesModal.module.css';
import styles from "./ResourcesModal.module.css"
import { CheckType } from './Create';

interface ModalProps {
  show: boolean;
  closeModal: () => void;
  modalContent: any[];
  handleCheckboxChange: (rId: string) => void;
  handleAccessChange: (rId: string, access: number) => void;
  isChecked: CheckType[]
}

export default function ResourcesModal({ show, closeModal, modalContent, handleCheckboxChange, handleAccessChange, isChecked }: ModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className={classes.modalBackdrop}>
      <div className={classes.modalContent}>
      {/* <h2>Modal Title</h2> */}
          <button onClick={closeModal} type="button" className={styles.closeButton}>
            X
          </button>
          <div className={styles.imgContainer}>
          {modalContent.map((res) => (

              <div
                key={res._id}
                className={styles.card}
                onClick={() => handleCheckboxChange(res._id)}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isChecked.find((ch) => ch.rId === res._id)?.checkProperty || false}
                  onChange={() => handleCheckboxChange(res._id)}
                />
                <h2 className={styles.title}>{res.title}</h2>
                <img className={styles.image} src={res.url} alt={res.title} />
                <input 
                placeholder="Number of access" 
                type="number" 
                min="0"
                className={styles.accessNum}
                value={isChecked.find((ch) => ch.rId === res._id)?.access || ''}
                onChange={(e) => handleAccessChange(res._id, parseInt(e.target.value))}                
                onClick={(e) => e.stopPropagation()}
                />
              </div>
          ))}
          </div>
          <button onClick={closeModal} type="button">
            Add
          </button>
      </div>
    </div>
  );
}
