import { useState, useEffect } from 'react';
import { categorias } from '../data/categorias';

const normalizarNome = (nome) => {
    return nome.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const useMercadorias = () => {
    const [quantidades, setQuantidades] = useState(() => {
        // Inicializa com dados do localStorage ou zeros
        const savedData = localStorage.getItem('quantidades');
        if (savedData) {
            return JSON.parse(savedData);
        }

        // Inicializa todas as quantidades com zero
        const initialQuantidades = {};
        Object.values(categorias).forEach(categoria => {
            categoria.itens.forEach(item => {
                initialQuantidades[normalizarNome(item)] = 0;
            });
        });
        return initialQuantidades;
    });

    const [categoriaAtual, setCategoriaAtual] = useState('itens-acai');

    // Salva no localStorage sempre que as quantidades mudarem
    useEffect(() => {
        localStorage.setItem('quantidades', JSON.stringify(quantidades));
    }, [quantidades]);

    const incrementar = (item) => {
        const nomeNormalizado = normalizarNome(item);
        setQuantidades(prev => ({
            ...prev,
            [nomeNormalizado]: (prev[nomeNormalizado] || 0) + 1
        }));
    };

    const decrementar = (item) => {
        const nomeNormalizado = normalizarNome(item);
        setQuantidades(prev => {
            const currentQty = prev[nomeNormalizado] || 0;
            if (currentQty > 0) {
                return {
                    ...prev,
                    [nomeNormalizado]: currentQty - 1
                };
            }
            return prev;
        });
    };

    const limparTudo = () => {
        const initialQuantidades = {};
        Object.values(categorias).forEach(categoria => {
            categoria.itens.forEach(item => {
                initialQuantidades[normalizarNome(item)] = 0;
            });
        });
        setQuantidades(initialQuantidades);
    };

    const getTotalItens = () => {
        return Object.values(quantidades).reduce((sum, qty) => sum + qty, 0);
    };

    const getItensSelecionados = () => {
        const itensSelecionados = {};

        Object.entries(categorias).forEach(([categoriaId, categoria]) => {
            const itensCategoria = categoria.itens.filter(item =>
                quantidades[normalizarNome(item)] > 0
            );

            if (itensCategoria.length > 0) {
                itensSelecionados[categoriaId] = {
                    nome: categoria.nome,
                    cor: categoria.cor,
                    itens: itensCategoria.map(item => ({
                        nome: item,
                        quantidade: quantidades[normalizarNome(item)]
                    }))
                };
            }
        });

        return itensSelecionados;
    };

    return {
        quantidades,
        categoriaAtual,
        setCategoriaAtual,
        incrementar,
        decrementar,
        limparTudo,
        getTotalItens,
        getItensSelecionados,
        normalizarNome
    };
};
