import useDarkMode from "../../utils/useDarkMode";
import InputText from "../../components/Inputs/Input";
import { useState } from "react";
import { doRequest } from "../../utils/doRequest";
import { encryptAES } from "../../utils/AesUtil";
import Button1 from "../../components/Buttons/Button1";

const ModalTransferirSaldo = ({ show, handleClose, saldo, setSaldo, setTransactionId, setDataTransacao,valor,setValor}) => {
  const [erro, setErro] = useState("");
  const [erroInput, setErroInput] = useState({
    erroValor: "",
    erroChave: "",
    erroSenha: "",
  });
  const [chave, setChave] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoChave, setTipoChave] = useState("CPF");
  const isDarkMode = useDarkMode();
  const transferirSaldo = async () => {
    const token = localStorage.getItem("token");
    const regexHex = /^[0-9A-Fa-f]+$/;

    const validacaoErro = validarTransferencia(
      valor,
      chave,
      senha,
      tipoChave,
      saldo,
      regexHex
    );
    if (validacaoErro) {
      setErroInput(validacaoErro);
      return;
    }

    const postdata = {
        valor: parseFloat(valor),
        chave: chave,
        senha: encryptAES(senha),
        tipo_chave: tipoChave,
    }

    const response = await doRequest(
      "http://localhost:8080/api/bank/transferir",
      "POST",
        postdata,
      { Authorization: `Bearer ${token}` }
    );

    const respostaString = JSON.stringify(response.data);

    if (response.status === 200) {
      setSaldo(response.data.saldo);
      setTransactionId(response.data.transactionId);
      setDataTransacao(response.data.dataTransacao);
      setValor(response.data.valor);
      setErro("Transferência realizada com sucesso");
      setErroInput({ erroValor: "", erroChave: "", erroSenha: "" });
      handleClose(true)

    }else if(respostaString.includes('Você não pode transferir para você mesmo')){
        setErro("Você não pode transferir para você mesmo");
        setErroInput({ erroValor: "", erroChave: "", erroSenha: "" });
    }else if(respostaString.includes('Senha inválida')){
        setErro("Senha inválida");
        setErroInput({ erroValor: "", erroChave: "", erroSenha: "" });
    }
    
    else {
      setErroInput({ erroValor: "", erroChave: "", erroSenha: "" });
      setErro(response.data.message);
    }
  };
  const validarTransferencia = (
    valor,
    chave,
    senha,
    tipoChave,
    saldo,
    regexHex
  ) => {
    const erros = {
      erroValor: "",
      erroChave: "",
      erroSenha: "",
    };
  
    if (valor <= 0) {
      erros.erroValor = "Valor inválido";
    } else if (valor > saldo) {
      erros.erroValor = "Saldo insuficiente";
    }
  
    if (tipoChave === "CPF" && chave.length !== 11) {
      erros.erroChave = "CPF inválido";
    } else if (tipoChave === "EMAIL" && !chave.includes("@")) {
      erros.erroChave = "Email inválido";
    } else if (tipoChave === "NUMERO_CONTA" && (chave.length !== 10 || !regexHex.test(chave))) {
      erros.erroChave = "Número de conta inválido";
    }
  
    if (senha.length < 4 || senha.length > 4) {
      erros.erroSenha = "Senha inválida";
    }
  
    if (erros.erroValor || erros.erroChave || erros.erroSenha) {
      return erros;
    }
  
    return null;
  };

  const tiposChaves = ["CPF", "EMAIL", "NUMERO_CONTA"];

  return (
    <>
      {show ? (
        <div className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div
            className="modal-content  p-4 rounded-lg shadow-md w-[80%] dark:bg-gray-800 bg-white
                        md:w-[50%] lg:w-[30%] lg:flex lg:flex-col lg:justify-between
                    "
          >
            <div className="fechar-modal flex justify-end mb-4">
              <button onClick={() => handleClose(false)}>
                {isDarkMode ? (
                  <box-icon name="window-close" color="#ffff"></box-icon>
                ) : (
                  <box-icon name="window-close"></box-icon>
                )}
              </button>
            </div>

            <div className="input-modal flex flex-col gap-6">
              <label className="font-bold">Tipo de chave</label>
              <select
                className="border-2 border-gray-300 rounded-md p-2"
                onChange={(e) => setTipoChave(e.target.value)}
              >
                {tiposChaves.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>

              <div className="inputs-item-input flex flex-col">
                <InputText
                  tipo="number"
                  label={"Digite o valor a ser sacado"}
                  onChange={(e) => setValor(e.target.value)}
                  value={valor}
                />
                {erroInput.erroValor && (
                  <p className="erro-valor text-red-600 text-center flex justify-center items-center font-bold mt-2">
                    {erroInput.erroValor}
                  </p>
                )}
              </div>

              <div className="inputs-item-input flex flex-col">
                <InputText
                  tipo="text"
                  label={"Digite a chave do destinatário"}
                  onChange={(e) => setChave(e.target.value)}
                  value={chave}
                />
                {erroInput.erroChave && (
                  <p className="erro-chave text-red-600 text-center flex justify-center items-center font-bold mt-2">
                    {erroInput.erroChave}
                  </p>
                )}
              </div>

              <div className="inputs-item-input flex flex-col">
                <InputText
                  tipo="password"
                  label={"Digite sua senha"}
                  onChange={(e) => setSenha(e.target.value)}
                  value={senha}
                />
                {erroInput.erroSenha && (
                  <p className="erro-senha text-red-600 text-center flex justify-center items-center font-bold mt-2">
                    {erroInput.erroSenha}
                  </p>
                )}
              </div>
            </div>

            <div className="button-modal flex justify-center mt-3">
              <Button1
                text="Transferir"
                color="#2ba8fb"
                onClick={transferirSaldo}
              />
            </div>
            {erro && (
              <p
                className={`${
                  erro == "Transferência realizada com sucesso"
                    ? "text-green-600"
                    : "text-red-600"
                } text-center font-bold flex justify-center items-center`}
              >
                {erro}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalTransferirSaldo;
