import React, { useEffect } from 'react';
import '../styles/Modal.scss';

const Modal = ({ isOpen, onClose, children }) => {

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

  return (
    <div className='modal-backdrop' onClick={handleBackdropClick}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>x</button>
        {children}
      </div>
    </div>
  )
}

export default Modal;