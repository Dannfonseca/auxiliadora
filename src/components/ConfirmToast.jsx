import './ConfirmToast.css';

const ConfirmToast = ({ message, isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className={`confirm-toast-overlay ${isVisible ? 'active' : ''}`}>
            <div className={`confirm-toast ${isVisible ? 'active' : ''}`}>
                <div className="confirm-toast-icon">⚠️</div>
                <div className="confirm-toast-content">
                    <h3>Confirmação</h3>
                    <p>{message}</p>
                </div>
                <div className="confirm-toast-buttons">
                    <button className="confirm-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="confirm-ok" onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmToast;
