import './Modal.css';

const Modal = ({message, onClose}) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
);

export default Modal;