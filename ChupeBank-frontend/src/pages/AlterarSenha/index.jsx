import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState, useRef } from "react";
import { encryptAES } from "../../utils/AesUtil";
import { decryptAES } from "../../utils/AesUtil";
import { doRequest } from "../../utils/doRequest";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ModalError from "../../components/Modals/Error";
import Card from "../../components/Cartao/Cartao";
import InputText from "../../components/Inputs/Input";
import useDarkMode from "../../utils/useDarkMode";
import { InputOtp, Form } from "@nextui-org/react";
import eyeShow from "../../assets/eye-password-show.svg";
import eyeHide from "../../assets/eye-password-hide.svg";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const AlterarSenhaCartao = () => {
  const [senha, setSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalError, setShowModalError] = useState({
    erro: false,
    tituloErro: "",
    detalheErro: "",
});


  const isDarkMode = useDarkMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const location = useLocation();

  const alterarSenha = async () => {
    const token = localStorage.getItem("token");
    const { cartaoId } = location.state;

    const senhaCriptografada = encryptAES(senha);
    const senhaAtualCriptografada = encryptAES(senhaAtual);

    const body = {
        senha: senhaAtualCriptografada,
        novaSenha: senhaCriptografada,
        id: cartaoId,
    };
    const response = await doRequest(
        "http://localhost:8080/api/cartao/trocar-senha",
        "POST",
        body,
        {
            Authorization: `Bearer ${token}`,
        }
    );

    if (response.status === 200) {
        navigate("/home");
    }else{
        setShowModalError({
            erro: true,
            tituloErro: "Erro ao alterar senha",
            detalheErro: response.data
        });
    }

};



  useEffect(() => {
    {
        onOpen();
    }
  }, []);


  return (
    <>
      <Header />

      {/* const ModalError = ({ tituloErro, detalheErro, setShowError }) => { */}
      {showModalError.erro && (
        <ModalError
          tituloErro={showModalError.tituloErro}
          detalheErro={showModalError.detalheErro}
          setShowError={setShowModalError}
        />
      )}

      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose} placement="center" defaultOpen={true}>
                            <ModalContent>
                            {(onClose) => (
                                <>
                                <ModalHeader className="flex flex-col gap-1 text-center text-2xl">Dicas para uma senha segura</ModalHeader>
                                <ModalBody>
                                    <ul className="list-disc list-inside">
                                    <li>Não utilize seu ano de nascimento</li>
                                    <li>Não utilize os primeiros digitos do seu cpf</li>
                                    <li>Não utilize os ultimos digitos do seu cpf</li>
                                    <li>Não utilize sequências numéricas ex: 1234</li>
                                    </ul>

                                    <p className="text-center mt-4">Lembre-se de não compartilhar sua senha com ninguém.</p>

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onPress={onClose}>
                                        Fechar
                                    </Button>
                                </ModalFooter>
                                </>
                            )}
                            </ModalContent>
                        </Modal>

      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-8 w-96 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg items-center justify-center">
          <h1 className="text-2xl font-bold text-center">
            Alterar Senha do cartão
          </h1>

          <div className="senha-atual flex flex-col gap-2">
            <h1 className="text-lg font-bold text-center">Senha atual</h1>
            <InputOtp
              isRequired
              aria-label="OTP input"
              length={4}
              color="success"
              name="otp"
              validationBehavior="native"
              size="lg"
              type={showPassword ? "text" : "password"}
              errorMessage="Senha inválida"
              onValueChange={(value) => {
                setSenhaAtual(value);
              }}
            />
          </div>
          <div className="senha-atual flex flex-col gap-2">
            <h1 className="text-lg font-bold text-center">Nova senha</h1>
            <InputOtp
              isRequired
              aria-label="OTP input"
              length={4}
              color="success"
              name="otp"
              validationBehavior="native"
              size="lg"
              type={showPassword ? "text" : "password"}
              errorMessage="Senha inválida"
              onValueChange={(value) => {
                setSenha(value);
              }}
            />
          </div>
                        <div className="botoes-acoes flex flex-row gap-4">
                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 flex items-center justify-center" onClick={() => { alterarSenha(); } }>
                                {isDarkMode ? (<box-icon name='paper-plane' color='#ffff' ></box-icon>) : (<box-icon name='paper-plane' ></box-icon>)}
                            </button>
                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 dark:invert flex items-center justify-center" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? eyeHide : eyeShow} alt="Mostrar senha" />
                            </button>


                            <button className="text-white p-2 rounded-lg mt-4 w-1/2 h-12 flex items-center justify-center" onClick={() => navigate("/home")}>
                                {isDarkMode ? (<box-icon name='arrow-back' color='#ffff' ></box-icon>) : (<box-icon name='arrow-back' ></box-icon>)}
                            </button>
                            <button className="text-white rounded-lg mt-4 w-12 h-12 flex items-center justify-center" onClick={onOpen}>
                            {isDarkMode ? (<box-icon name='question-mark' color='#ffff' ></box-icon>) : (<box-icon name='question-mark' ></box-icon>)}
                        </button>
                        </div>
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AlterarSenhaCartao;
