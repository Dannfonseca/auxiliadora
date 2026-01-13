import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
        confirm: '?'
    };

    return (
        <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-content">
                <p>{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Toast;
