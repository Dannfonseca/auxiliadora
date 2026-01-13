import { useState } from 'react';
import { useMercadorias } from './hooks/useMercadorias';
import { categorias } from './data/categorias';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import CategoryContent from './components/CategoryContent';
import ActionButtons from './components/ActionButtons';
import Modal from './components/Modal';
import HomeScreen from './components/HomeScreen';
import Toast from './components/Toast';
import ConfirmToast from './components/ConfirmToast';
import './App.css';

function App() {
  const {
    quantidades,
    categoriaAtual,
    setCategoriaAtual,
    incrementar,
    decrementar,
    limparTudo,
    getTotalItens,
    getItensSelecionados,
    normalizarNome
  } = useMercadorias();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasSeenHome, setHasSeenHome] = useState(() => {
    return localStorage.getItem('hasSeenHome') === 'true';
  });

  // Toast states
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  const [confirmToast, setConfirmToast] = useState({ isVisible: false, message: '' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleStartApp = () => {
    setHasSeenHome(true);
    localStorage.setItem('hasSeenHome', 'true');
  };

  const handleWhatsAppClick = () => {
    const itensSelecionados = getItensSelecionados();

    if (Object.keys(itensSelecionados).length === 0) {
      showToast('Selecione pelo menos um item antes de enviar!', 'warning');
      return;
    }

    let mensagem = '';

    // Data atual
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataFormatada = `-------------${dia}/${mes}/${ano}------------\n\n`;

    mensagem += `*${dataFormatada}*`;

    // Agrupar por categoria
    Object.entries(itensSelecionados).forEach(([categoriaId, categoria]) => {
      mensagem += `\n*(${categoria.nome.toUpperCase()})*\n\n`;
      categoria.itens.forEach(item => {
        mensagem += `➡️ ${item.quantidade}x ${item.nome}\n`;
      });
    });

    const numeroWhatsApp = "5521984145211";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem.trim())}`;
    window.open(linkWhatsApp, "_blank");

    showToast('Pedido enviado para o WhatsApp!', 'success');
  };

  const handleClearClick = () => {
    setConfirmToast({
      isVisible: true,
      message: 'Tem certeza que deseja limpar todas as quantidades?'
    });
  };

  const handleConfirmClear = () => {
    limparTudo();
    setConfirmToast({ isVisible: false, message: '' });
    showToast('Todas as quantidades foram limpas!', 'success');
  };

  const handleCancelClear = () => {
    setConfirmToast({ isVisible: false, message: '' });
  };

  if (!hasSeenHome) {
    return <HomeScreen onStart={handleStartApp} />;
  }

  const categoriaAtualData = categorias[categoriaAtual];

  return (
    <div className="app">
      <Header
        totalItens={getTotalItens()}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onItemCountClick={() => setModalOpen(true)}
      />

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        categoriaAtual={categoriaAtual}
        onCategoriaChange={setCategoriaAtual}
      />

      <main className="main-content">
        <div className="container">
          <div className="category-content">
            <CategoryContent
              categoria={categoriaAtualData}
              quantidades={quantidades}
              onIncrement={incrementar}
              onDecrement={decrementar}
              normalizarNome={normalizarNome}
            />
          </div>

          <ActionButtons
            onWhatsAppClick={handleWhatsAppClick}
            onClearClick={handleClearClick}
          />
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itensSelecionados={getItensSelecionados()}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <ConfirmToast
        message={confirmToast.message}
        isVisible={confirmToast.isVisible}
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </div>
  );
}

export default App;
