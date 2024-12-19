import useDarkMode from "../../utils/useDarkMode";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button1 from "../../components/Buttons/Button1";

import transferirIcon from '../../assets/send-dollars.svg';
import adicionarIcon from '../../assets/money-withdraw.svg';
import saqueIcon from '../../assets/savings-dollar.svg';

import ModalAdicionarSaldo from "../../components/Modals/AdicionarSaldo";
import ModalSacarSaldo from "../../components/Modals/SacarSaldo";
import ModalTransferirSaldo from "../../components/Modals/TransferirSaldo";


const HomePageUser = () => {
  const [saldo, setSaldo] = useState(0);
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [nome, setNome] = useState("");
  const [cartoes, setCartoes] = useState([]);
  const [limiteTotal, setLimiteTotal] = useState(0);
    const [showModal, setShowModal] = useState({
        deposito: false,
        saque: false,
        transferencia: false,
    });

  const isDarkMode = useDarkMode();
  const navigate = useNavigate();

  const handleModalClose = () => {
    setShowModal({
      deposito: false,
      saque: false,
      transferencia: false,
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

  const fetchCartoes = async () => {
    // [
    //     {
    //         "id": "b74997cc-8b53-42ff-8c38-bc12f585a7c3",
    //         "numeroCartao": "**** **** **** 5739",
    //         "nomeTitular": "EDUARDO OLIVEIRA DA SILVA",
    //         "bandeira": "MasterCard",
    //         "cvv": "***",
    //         "dataExpiracao": "2027-12-17 16:47:13.365",
    //         "limite": 1000.0
    //     }
    // ]

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

  useEffect(() => {
    fetchDadosBancarios();
    fetchCartoes();
    const jwt = jwtDecode(localStorage.getItem("token"));
    setNome(jwt.nome);
  }, []);

  return (
    <>
        <ModalAdicionarSaldo 
        show={showModal.deposito}
        handleClose={handleModalClose} 
        saldo={saldo} 
        setSaldo={setSaldo} />

        <ModalSacarSaldo
        show={showModal.saque}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        />

        <ModalTransferirSaldo
        show={showModal.transferencia}
        handleClose={handleModalClose}
        saldo={saldo}
        setSaldo={setSaldo}
        />

      <Header />

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
      <div className="acoes-usuario flex flex-col gap-4 overflow-y-auto">
        <div className="container-acoes flex flex-row gap-2 justify-center items-center">
          <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
            <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
              {isDarkMode ? (
                <img src={transferirIcon} alt="Transferir" className="invert w-8 h-8" />
              ) : (
                <img src={transferirIcon} alt="Transferir" className="h-8 w-8"/>
              )}
            </div>
            <div className="botao-transferir flex flex-row justify-center items-center gap-4 mt-4">
              <Button1
                text="Transferir"
                onClick={() => setShowModal({transferencia: true})}
                color="green"
              />
            </div>
          </div>

          <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
            <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
              {isDarkMode ? (
                <img src={adicionarIcon} alt="Adicionar saldo" className="invert w-8 h-8" />
              ) : (
                <img src={adicionarIcon} alt="Adicionar saldo" className="w-8 h-8"/>
              )}
            </div>
            <div className="botao-cartoes flex flex-row justify-center items-center gap-4 mt-4">
              <Button1
                text="Depositar"
                onClick={() => setShowModal({deposito: true})}
                color="green"
              />
            </div>
          </div>

          <div className="acao flex flex-col p-4 my-4 rounded-md dark:bg-gray-800 shadow-xl w-1/2">
            <div className="titulo-e-simbolo flex flex-row gap-2 justify-center">
                {isDarkMode ? (
                    <img src={saqueIcon} alt="Sacar" className="invert w-8 h-8" />
                ) : (
                    <img src={saqueIcon} alt="Sacar" className="w-8 h-8"/>
                )}
            </div>
            <div className="botao-cartoes flex flex-row justify-center items-center gap-4 mt-4">
              <Button1
                text="Sacar"
                onClick={() => setShowModal({saque: true})}
                color="green"
              />
            </div>
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
    </>
  );
};

export default HomePageUser;
