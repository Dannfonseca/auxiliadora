import './Modal.css';

const Modal = ({ isOpen, onClose, itensSelecionados }) => {
    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Itens Selecionados</h2>
                    <button className="close-modal" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {Object.keys(itensSelecionados).length === 0 ? (
                        <p>Nenhum item selecionado ainda.</p>
                    ) : (
                        Object.entries(itensSelecionados).map(([categoriaId, categoria]) => (
                            <div key={categoriaId} className="category-section">
                                <h3 style={{ color: categoria.cor }}>
                                    ({categoria.nome.toUpperCase()})
                                </h3>
                                <ul>
                                    {categoria.itens.map(item => (
                                        <li key={item.nome}>
                                            {item.quantidade}x {item.nome}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
