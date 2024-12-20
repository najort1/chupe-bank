import useDarkMode from "../../utils/useDarkMode";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import boxicons from "boxicons";
import Button1 from "../../components/Buttons/Button1";

import animSucesso from "../../assets/Sucesso.webm";

const ModalDadosTransacao = ({
  show,
  handleClose,
  saldo,
  setSaldo,
  transactionId,
  dataTransacao,
  valor,
}) => {
  const isDarkMode = useDarkMode();

  const [data, setData] = useState();
  const [hora, setHora] = useState();

  const formatDate = (date) => {
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Meses começam do zero
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");

    return {
      data: `${dia}/${mes}/${ano}`,
      hora: `${hora}:${minuto}`,
    };
  };

  return (
    <>
      {show ? (
        <div className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div
            className="modal-content  p-4 rounded-lg shadow-md w-[80%] dark:bg-gray-800 bg-white
                        md:w-[40%] lg:w-[30%] lg:flex lg:flex-col lg:justify-between
                    "
          >
            <div className="fechar-modal flex justify-center mb-4 flex-col items-center">
              <video
                src={animSucesso}
                alt="Erro"
                className="w-20 h-20 flex justify-center items-center"
                autoPlay
                playsInline
              />
              <h1 className="text-2xl font-bold text-green-800 dark:text-white text-center">
                Transação realizada com sucesso!
              </h1>

                <div className="flex flex-row items-center gap-2 justify-center">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-500 text-center w-full mt-3">{transactionId}</p>
                    <button onClick={() => navigator.clipboard.writeText(transactionId)} className="text-green-800 dark:text-white mt-3">
                    {isDarkMode ? (
                    <box-icon name="copy-alt" size='sm' color="#ffff"></box-icon>
                    ) : (
                    <box-icon name="copy-alt"></box-icon>
                    )}

                    </button>
                </div>

            </div>




            <div className="flex flex-col items-start justify-start">
              <div className="item-info-transacao flex flex-row w-full">
                <div className="flex items-start justify-start w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    Saldo final:
                  </p>
                </div>
                <div className="flex items-end justify-end w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    {saldo}
                  </p>
                </div>
              </div>
            

              <div className="item-info-transacao flex flex-row w-full">
                <div className="flex items-start justify-start w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    Valor:
                  </p>
                </div>
                <div className="flex items-end justify-end w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    {valor}
                  </p>
                </div>
              </div>
              <div className="item-info-transacao flex flex-row w-full">
                <div className="flex items-start justify-start w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    Data: 
                  </p>
                </div>
                <div className="flex items-end justify-end w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    {formatDate(dataTransacao).data}
                  </p>
                </div>
              </div>
              <div className="item-info-transacao flex flex-row w-full">
                <div className="flex items-start justify-start w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    Hora:
                  </p>
                </div>
                <div className="flex items-end justify-end w-full">
                  <p className="text-lg font-bold text-green-800 dark:text-white">
                    {formatDate(dataTransacao).hora}
                  </p>
                </div>
              </div>
            </div>

            

            <div className="flex justify-center">
              <Button1
                text="Fechar"
                onClick={() => handleClose(false)}
                corFundo="bg-green-800"
                corTexto="text-white"
                tamanho="w-1/2"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalDadosTransacao;
