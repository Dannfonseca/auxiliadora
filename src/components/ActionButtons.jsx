import './ActionButtons.css';

const ActionButtons = ({ onWhatsAppClick, onClearClick }) => {
    return (
        <div className="action-buttons">
            <button className="whatsapp-button" onClick={onWhatsAppClick}>
                Enviar para WhatsApp
            </button>
            <button className="clear-button" onClick={onClearClick}>
                Limpar Tudo
            </button>
        </div>
    );
};

export default ActionButtons;
