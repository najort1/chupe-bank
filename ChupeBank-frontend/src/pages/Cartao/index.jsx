import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState,useRef } from "react";
import { encryptAES } from "../../utils/AesUtil";
import { doRequest } from "../../utils/doRequest";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ModalError from "../../components/Modals/Error";
import Card from "../../components/Cartao/Cartao";
import InputText from "../../components/Inputs/Input";

const Cartao = () => {
    const [numeroCartao, setNumeroCartao] = useState("");
    const [cvv, setCvv] = useState("");
    const [validade, setValidade] = useState("");
    const [nome, setNome] = useState("");
    const [limite, setLimite] = useState(0);
    const inputRefs = useRef([]);


    const [showPassword, setShowPassword] = useState(false);


    const [showModalError, setShowModalError] = useState({
        erro: false,
        tituloErro: "",
        detalheErro: "",
    });

    const [senha, setSenha] = useState("");
    const [digitouSenha, setDigitouSenha] = useState(false);
    

    const navigate = useNavigate();
    const location = useLocation();

    const {cartaoId} = location.state;
    

    const fetchCartao = async () => {
        const token = localStorage.getItem("token");

        const jwtDecoded = jwtDecode(token);
        const nome = jwtDecoded.nome;
        setNome(nome);

        const senhaToString = senha.join("");

        const response = await doRequest(
            "http://localhost:8080/api/cartao/id",
            "POST",
            {id: cartaoId,senha: encryptAES(senhaToString)},
            {
                Authorization: `Bearer ${token}`,
            }
        );

        const responseString = JSON.stringify(response.data);

        if (response.status === 200) {
            setNumeroCartao(response.data.numero);
            setCvv(response.data.cvv);
            let validade = response.data.dataValidade;
            const partes = validade.split('T')[0].split('-'); // Separar a data do restante e dividir por '-'
            const ano = partes[0];
            const mes = partes[1];
            setValidade(`${mes}/${ano}`);
            setLimite(response.data.limite);
            setDigitouSenha(true);
        }else if(responseString.includes('Senha incorreta')){
            setShowModalError({
                erro: true,
                tituloErro: "Senha incorreta",
                detalheErro: responseString,
            });
        }

        else {
            setShowModalError({
                erro: true,
                tituloErro: "Erro ao buscar cartão",
                detalheErro: responseString,
            });
        }
    };


    const digiteASenha = () => {
    
        const handleInputChange = (e, index) => {
            const value = e.target.value;
            setSenha((prevSenha) => {
                const newSenha = [...prevSenha];
                newSenha[index] = value;
                return newSenha;
            });
    
            if (value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        };
    
        return (
            <>
                <Header />
                <div className="w-screen h-screen flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold">Digite sua senha de 4</h1>
                        <div className="inputs-group-password flex flex-row">
                            {[0, 1, 2, 3].map((_, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type={showPassword ? "text" : "password"}
                                    maxLength={1}
                                    className="input-password border-2 border-gray-300 p-2 rounded-lg mt-4 w-12 h-12"
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            ))}
                        </div>
                        <div className="botoes-acoes flex flex-row gap-4">
                            <button className="bg-blue-500 text-white p-2 rounded-lg mt-4 w-1/2 h-12" onClick={() => { fetchCartao(); } }>Confirmar</button>
                            <button className="bg-blue-500 text-white p-2 rounded-lg mt-4 w-1/2 h-12" onClick={() => setShowPassword(!showPassword)}>Mostrar</button>
                            <button className="bg-blue-500 text-white p-2 rounded-lg mt-4 w-1/2 h-12" onClick={() => navigate("/home")}>Voltar</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    };

    return (
        <>
{showModalError.erro && <ModalError tituloErro={showModalError.tituloErro} detalheErro={showModalError.detalheErro}  setShowError={setShowModalError}/>}

        {!digitouSenha ? digiteASenha() : (

            <div>
            <Header />

            <div className="mostrar-cartao flex justify-center items-center m-8">
                <Card number={numeroCartao} cvv={cvv} validThru={validade} name={nome} />
            </div>
            
            <div className="informacoes-cartao flex flex-col gap-6 p-2 m-4 xl:justify-center xl:items-center">
                
                <InputText label="Nome" id="nome" value={nome} tipo="text" copyButton={true} />
                <InputText label="Número" id="numero" value={numeroCartao} tipo="text" copyButton={true} />
                <InputText label="Validade" id="validade" value={validade} tipo="text" copyButton={true} />
                <InputText label="CVV" id="cvv" value={cvv} tipo="text" copyButton={true} />
                <InputText label="Limite" id="limite" value={limite} tipo="text" copyButton={true} />

            </div>

            <div className="botoes-acoes flex justify-center flex-col xl:flex-row">
                <button className="bg-green-700 text-white p-2 rounded-lg mt-4 w-full h-12 xl:w-[10%]" onClick={() => navigate("/home")}>Voltar</button>
            </div>

            <Footer />
            </div>
        )}

        </>

    );



}

export default Cartao;