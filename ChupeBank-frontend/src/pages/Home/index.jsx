import useDarkMode from "../../utils/useDarkMode";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button1 from "../../components/Buttons/Button1";

import transferirIcon from "../../assets/send-dollars.svg";
import adicionarIcon from "../../assets/money-withdraw.svg";
import saqueIcon from "../../assets/savings-dollar.svg";
import deleteIcon from "../../assets/trash.svg";

import Chat from "../../components/Chat/Chat";

import ModalAdicionarSaldo from "../../components/Modals/AdicionarSaldo";
import ModalSacarSaldo from "../../components/Modals/SacarSaldo";
import ModalTransferirSaldo from "../../components/Modals/TransferirSaldo";
import ModalDadosTransacao from "../../components/Modals/DadosTransacao";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const HomePageUser = () => {
  const [saldo, setSaldo] = useState(0);
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [nome, setNome] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [dataTransacao, setDataTransacao] = useState("");
  const [valor, setValor] = useState(0);
  const [cartoes, setCartoes] = useState([]);
  const [limiteTotal, setLimiteTotal] = useState(0);
  const [showModal, setShowModal] = useState({
    deposito: false,
    saque: false,
    transferencia: false,
    dadosTransacao: false,
  });

  const isDarkMode = useDarkMode();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalClose = (sucesso) => {
    setShowModal({
      deposito: false,
      saque: false,
      transferencia: false,
      dadosTransacao: sucesso,
    });
  };

  const fetchDadosBancarios = async () => {
    const token = localStorage.getItem("token");
    const response = await doRequest(
      "http://localhost:8080/api/bank/dados",
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.status === 200) {
      setSaldo(response.data.saldo);
      setConta(response.data.numeroConta);
      setAgencia(response.data.agencia);
    } else {
      setSaldo(0);
      setConta("ERROR");
      setAgencia("ERROR");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
        navigate('/login');
    }
}
, []);

  const fetchCartoes = async () => {

    const token = localStorage.getItem("token");
    const response = await doRequest(
      "http://localhost:8080/api/cartao/todos",
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.status === 200) {
      setCartoes(response.data);
      let total = 0;
      response.data.map((cartao) => {
        total += cartao.limite;
      });
      setLimiteTotal(total);
    } else {
      setCartoes([]);
    }
  };

  const handleDeleteAccount = async () => { 
    const token = localStorage.getItem("token");
    const response = await doRequest(
      "http://localhost:8080/usuario/delete",
      "DELETE",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.status === 200) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      console.log("Erro ao deletar conta");
    }
  };


  useEffect(() => {
    fetchDadosBancarios();
    fetchCartoes();
    const jwt = jwtDecode(localStorage.getItem("token"));
    setNome(jwt.nome);
  }, []);

  return (
    <div className="min-h-screen">
      <ModalAdicionarSaldo
        show={showModal.deposito}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        setDataTransacao={setDataTransacao}
        setTransactionId={setTransactionId}
        setValor={setValor}
        valor={valor}
      />

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tem certeza que deseja deletar sua conta?
              </ModalHeader>
              <ModalBody>
                <p>
                  Ao deletar sua conta, você perderá todo o seu saldo e cartões juntamente com seus dados bancários e historico de transações. Essa ação é irreversível.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleDeleteAccount}>
                  Continuar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ModalSacarSaldo
        show={showModal.saque}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        setDataTransacao={setDataTransacao}
        setTransactionId={setTransactionId}
        setValor={setValor}
        valor={valor}
      />

      <ModalTransferirSaldo
        show={showModal.transferencia}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        setDataTransacao={setDataTransacao}
        setTransactionId={setTransactionId}
        setValor={setValor}
        valor={valor}
      />

      <ModalDadosTransacao
        show={showModal.dadosTransacao}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        transactionId={transactionId}
        dataTransacao={dataTransacao}
        valor={valor}
      />

      <Header />
      <Chat />
      <div className="container-apresentacao">
        <h1 className="titulo-apresentacao text-2xl font-bold text-black text-center dark:text-white mt-2">
          Bem vindo, {nome.split(" ")[0]}!
        </h1>
        <div className="dados-bancarios flex flex-row gap-4 justify-center items-center">
          <div className="agencia-dado flex flex-row items-center">
            <p className="paragrafo-agencia font-semibold">AG: {agencia}</p>
          </div>

          <div
            className="conta-dado flex flex-row items-center"
            onClick={() => navigator.clipboard.writeText(conta)}
          >
            {isDarkMode ? (
              <box-icon name="copy-alt" color="#ffff"></box-icon>
            ) : (
              <box-icon name="copy-alt"></box-icon>
            )}
            <button className="paragrafo-conta font-semibold">
              CC: {conta}
            </button>
          </div>
        </div>
      </div>

      <div className="container-saldo flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl xl:w-1/3 xl:mx-auto">
        <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
          {isDarkMode ? (
            <box-icon size="md" color="#ffff" name="dollar-circle"></box-icon>
          ) : (
            <box-icon size="md" name="dollar-circle"></box-icon>
          )}
          <h1 className="titulo text-2xl">Saldo disponivel</h1>
        </div>

        <p className="saldo text-3xl font-bold text-center">
          R$ {saldo.toFixed(2)}
        </p>
        <p className="saldo-e-limite text-center">
          Saldo + limite: {(saldo + limiteTotal).toFixed(2)}
        </p>

        <div className="botao-extrato flex flex-row justify-center items-center gap-4 mt-4">
          <Button1
            text="Extrato"
            onClick={() => navigate("/extrato")}
            color={"green"}
          />
        </div>
      </div>
      <h1 className="titulo text-2xl text-center">Ações do usuário</h1>

      <div className="container-acoes flex flex-row gap-2 overflow-auto">
        <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
          <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
            {isDarkMode ? (
              <img
                src={transferirIcon}
                alt="Transferir"
                className="invert w-8 h-8"
              />
            ) : (
              <img src={transferirIcon} alt="Transferir" className="h-8 w-8" />
            )}
          </div>
          <div className="botao-transferir flex flex-row justify-center items-center gap-4 mt-4">
            <Button1
              text="Transferir"
              onClick={() => setShowModal({ transferencia: true })}
              color="green"
            />
          </div>
        </div>

        <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
          <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
            {isDarkMode ? (
              <img
                src={adicionarIcon}
                alt="Adicionar saldo"
                className="invert w-8 h-8"
              />
            ) : (
              <img
                src={adicionarIcon}
                alt="Adicionar saldo"
                className="w-8 h-8"
              />
            )}
          </div>
          <div className="botao-cartoes flex flex-row justify-center items-center gap-4 mt-4">
            <Button1
              text="Depositar"
              onClick={() => setShowModal({ deposito: true })}
              color="green"
            />
          </div>
        </div>

        <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
          <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
            {isDarkMode ? (
              <img src={saqueIcon} alt="Sacar" className="invert w-8 h-8" />
            ) : (
              <img src={saqueIcon} alt="Sacar" className="w-8 h-8" />
            )}
          </div>
          <div className="botao-cartoes flex flex-row justify-center items-center gap-4 mt-4">
            <Button1
              text="Sacar"
              onClick={() => setShowModal({ saque: true })}
              color="green"
            />
          </div>
        </div>

        <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
          <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
            {isDarkMode ? (
              <img src={deleteIcon} alt="Sacar" className="invert w-8 h-8" />
            ) : (
              <img src={deleteIcon} alt="Sacar" className="w-8 h-8" />
            )}
          </div>
          <div className="botao-cartoes flex flex-row justify-center items-center gap-4 mt-4">
            <Button1
              text="Deletar"
              onClick={onOpen}
              color="#9e1919"
              hoverColor="#ff0000"
            />
          </div>
        </div>
      </div>

      <div
        className="container-cartoes flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl
            w-full
            h-72
            overflow-y-auto
        "
      >
        <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
          {isDarkMode ? (
            <box-icon size="md" color="#ffff" name="credit-card"></box-icon>
          ) : (
            <box-icon size="md" name="credit-card"></box-icon>
          )}
          <h1 className="titulo text-2xl mb-4">Cartões</h1>
        </div>
        <div className="cartoes flex flex-col gap-4">
          {cartoes.map((cartao) => (
            <div
              key={cartao.id}
              className="cartao flex flex-col p-4 rounded-md dark:bg-gray-700 shadow-xl
                xl:w-1/4
                xl:mx-auto
              "
            >
              <p className="numero-cartao font-bold text-xl">
                {cartao.numeroCartao}
              </p>
              <p className="nome-titular font-semibold">{cartao.nomeTitular}</p>
              <p className="bandeira font-semibold">{cartao.bandeira}</p>
              <p className="limite font-semibold">
                Limite: R$ {cartao.limite.toFixed(2)}
              </p>
              <div className="botao-gera-virtual flex flex-row justify-center items-center gap-4 mt-4">
                <Button1
                  text="Ver dados"
                  color={"green"}
                  onClick={() =>
                    navigate("/cartao", {
                      state: { cartaoId: cartao.id },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePageUser;
