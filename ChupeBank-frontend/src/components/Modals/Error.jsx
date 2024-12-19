import gifError from '../../assets/Error.webm';
import './animError.css';

const ModalError = ({ tituloErro, detalheErro, setShowError }) => {
    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="modal-error modalSurgindoAnimError text-white p-4 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[35%] flex justify-center flex-col items-center gap-4 bg-[#800d0d] z-50
            xl:w-[20%]
            xl:h-[30%]
            md:w-[40%]
            md:h-[30%]
            ">
                <video src={gifError} alt="Erro" className="w-20 h-20 flex justify-center items-center" autoPlay playsInline />
                <div className="mensagens-modal flex items-center flex-col">
                    <h1 className="titulo-erro font-bold text-xl">{tituloErro}</h1>
                    <p className="detalhe-erro font-bold text-center">{detalheErro}</p>
                </div>
                <button className="bg-red-500 text-white p-2 rounded-lg mt-4" onClick={() => { setShowError({
                    erro: false,
                    tituloErro: "",
                    detalheErro: "",
                }); }}>Tentar novamente</button>
            </div>
        </div>
    );
};

export default ModalError;