import React, { useEffect } from 'react';
import '../styles/Modal.scss';

const Modal = ({ className, isOpen, onClose, children }) => {

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        console.log('Modal closed via Escape key'); // Debugging log
        onClose();
      }
    };

    if(isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    console.log('Modal closed via backdrop click'); // Debugging log
    onClose();
  };

  if(!isOpen) return null;

  const modalClassName = className ? `modal-backdrop ${className}` : 'modal-backdrop';
  const closeModalClassName = className ? `modal-close ${className}` : 'modal-close';
  return (
    <div className={modalClassName} onClick={handleBackdropClick}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className={closeModalClassName} onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  )
}

export default Modal;