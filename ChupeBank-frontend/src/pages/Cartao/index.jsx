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
import useDarkMode from '../../utils/useDarkMode';
import {InputOtp, Form} from "@nextui-org/react";
import eyeShow from '../../assets/eye-password-show.svg';
import eyeHide from '../../assets/eye-password-hide.svg';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";

  

const Cartao = () => {
    const [numeroCartao, setNumeroCartao] = useState("");
    const [cvv, setCvv] = useState("");
    const [validade, setValidade] = useState("");
    const [nome, setNome] = useState("");
    const [limite, setLimite] = useState(0);
    const inputRefs = useRef([]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const isDarkMode = useDarkMode();


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
    
    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login');
        }
    }
    , []);
    
    const fetchCartao = async () => {
        const token = localStorage.getItem("token");

        const jwtDecoded = jwtDecode(token);
        const nome = jwtDecoded.nome;
        setNome(nome);


        const response = await doRequest(
            "http://localhost:8080/api/cartao/id",
            "POST",
            {id: cartaoId,senha: encryptAES(senha)},
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

    
        return (
            <div className="min-h-screen">
                <Header />
                <div className="h-screen flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold">Digite sua senha de 4 digitos</h1>
                        <button className="text-white rounded-lg mt-4 w-12 h-12 flex items-center justify-center" onClick={onOpen}>
                            {isDarkMode ? (<box-icon name='question-mark' color='#ffff' ></box-icon>) : (<box-icon name='question-mark' ></box-icon>)}
                        </button>

                        <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
                            <ModalContent>
                            {(onClose) => (
                                <>
                                <ModalHeader className="flex flex-col gap-1">Qual é minha senha de 4 digitos?</ModalHeader>
                                <ModalBody>
                                    <p>
                                        A sua senha de 4 digitos é os ultimos 4 digitos do seu cartão principal. Ou seja o cartão que você recebeu ao cadastrar sua conta.
                                    </p>
                                    <p>
                                        Não recomendamos que você continue com essa senha, pois ela é facilmente descoberta. Recomendamos que você altere sua senha o mais rápido possível.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                    Fechar
                                    </Button>
                                    <Button color="primary" onPress={onClose}>
                                    Trocar Senha
                                    </Button>
                                </ModalFooter>
                                </>
                            )}
                            </ModalContent>
                        </Modal>
                        <div className="inputs-group-password flex flex-row">
                        <InputOtp
                            isRequired
                            aria-label="OTP input"
                            length={4}
                            name="otp"
                            placeholder="Digite sua senha"
                            validationBehavior="native"
                            size="lg"
                            type={showPassword ? "text" : "password"}
                            errorMessage="Senha inválida"
                            onValueChange={(value) => { setSenha(value); }}
                        />
                        </div>
                        <div className="botoes-acoes flex flex-row gap-4">
                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 flex items-center justify-center" onClick={() => { fetchCartao(); } }>
                                {isDarkMode ? (<box-icon name='paper-plane' color='#ffff' ></box-icon>) : (<box-icon name='paper-plane' ></box-icon>)}
                            </button>
                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 dark:invert flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? eyeHide : eyeShow} alt="Mostrar senha" />
                            </button>


                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 flex items-center justify-center" onClick={() => navigate("/home")}>
                                {isDarkMode ? (<box-icon name='arrow-back' color='#ffff' ></box-icon>) : (<box-icon name='arrow-back' ></box-icon>)}
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
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