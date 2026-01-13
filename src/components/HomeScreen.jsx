import './HomeScreen.css';

const HomeScreen = ({ onStart }) => {
    return (
        <div className="home-screen">
            <div className="home-content">
                <h1>Bem-vindo ao Sistema de registro para compra de mercadorias!</h1>
                <p>Aqui está um guia rápido para usar o aplicativo:</p>
                <ol>
                    <li>Selecione uma categoria no menu lateral.</li>
                    <li>Adicione ou remova itens usando os botões "+" e "-".</li>
                    <li>Clique no botão "Enviar para WhatsApp" para finalizar o pedido.</li>
                    <li>Use o botão "Limpar Tudo" para limpar as mercadorias da memória e poder começar um novo registro!</li>
                </ol>
                <button className="start-button" onClick={onStart}>
                    Começar
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
