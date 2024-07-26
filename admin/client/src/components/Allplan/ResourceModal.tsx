import React from 'react';
import './ResourceModal.module.css';
import styles from "./ResourceModal.module.css"
import { IAccessResource } from './Plan';

interface PaymentProps {
  isModalOpen: boolean;
  closeModal: () => void;
  modalContent: IAccessResource[];
}

const ResourceModal: React.FC<PaymentProps> = ({ isModalOpen, closeModal, modalContent }) => {

  return (
    isModalOpen ? (
    <div className={styles.modalBackdrop}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <h2>Resources Available</h2>
          <button onClick={closeModal} type="button" className={styles.closeButton}>
            X
          </button>
          <div className={styles.imgContainer}>
          {modalContent.map((res) => (
              <div
                key={res._id}
                className={styles.card}
              >
                <h2 className={styles.title}>{res.title}</h2>
                <img className={styles.image} src={res.url} alt={res.title} />
                <p className={styles.accessNum}>Access: {res.access}</p>
              </div>
          ))}
          </div>
        </div>
      </div>
    ) : null
  );
};


export default ResourceModal;
