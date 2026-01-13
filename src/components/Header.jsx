import './Header.css';

const Header = ({ totalItens, onMenuToggle, onItemCountClick }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-left">
                    <button id="menuToggle" className="menu-toggle" onClick={onMenuToggle}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1>Mercadorias</h1>
                </div>
                <div className="cart-info">
                    <button
                        className="item-count-button"
                        onClick={onItemCountClick}
                    >
                        {totalItens} {totalItens === 1 ? 'item' : 'itens'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
