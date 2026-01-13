import './SideMenu.css';
import { categorias } from '../data/categorias';

const categoryIcons = {
    'itens-acai': '🍦',
    'copos': '🥤',
    'picole': '🍡',
    'doces': '🍬',
    'coberturas': '🍫',
    'acai-sorvete': '🍨',
    'bebidas': '🥤',
    'alimentacao': '🍔'
};

const SideMenu = ({ isOpen, onClose, categoriaAtual, onCategoriaChange }) => {
    const handleCategoryClick = (categoriaId) => {
        onCategoriaChange(categoriaId);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            <nav className={`side-menu ${isOpen ? 'active' : ''}`}>
                <div className="menu-header">
                    <h2>📋 Categorias</h2>
                    <button className="close-menu" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <ul>
                    {Object.entries(categorias).map(([id, categoria]) => (
                        <li key={id}>
                            <a
                                href="#"
                                className={categoriaAtual === id ? 'active' : ''}
                                style={{
                                    '--category-color': categoria.cor
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategoryClick(id);
                                }}
                            >
                                <span className="category-icon">{categoryIcons[id]}</span>
                                <span className="category-name">{categoria.nome}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div
                className={`menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            ></div>
        </>
    );
};

export default SideMenu;
