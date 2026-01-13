import './CategoryContent.css';

// Helper to convert hex to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const CategoryContent = ({ categoria, quantidades, onIncrement, onDecrement, normalizarNome }) => {
    const rgb = hexToRgb(categoria.cor);
    const colorVars = rgb ? {
        '--category-color': categoria.cor,
        '--category-color-light': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`,
        '--category-color-alpha': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
        '--category-color-dark': categoria.cor
    } : {};

    return (
        <div className="category-card" style={colorVars}>
            <h2 style={{ color: categoria.cor }}>{categoria.nome}</h2>
            <div className="items-list">
                {categoria.itens.map((item) => {
                    const nomeNormalizado = normalizarNome(item);
                    const quantidade = quantidades[nomeNormalizado] || 0;

                    return (
                        <div key={item} className={`item ${quantidade > 0 ? 'selected' : ''}`}>
                            <span>{item}</span>
                            <div className="controls">
                                <button onClick={() => onDecrement(item)}>−</button>
                                <span>{quantidade}</span>
                                <button onClick={() => onIncrement(item)}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryContent;
