import useDarkMode from "../../utils/useDarkMode";
import InputText from "../../components/Inputs/Input";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import boxicons from "boxicons";
import Button1 from "../../components/Buttons/Button1";


const ModalAdicionarSaldo = ({ show, handleClose, saldo, setSaldo, setTransactionId, setDataTransacao,valor,setValor}) => {


    const [erro, setErro] = useState("");
    const [erroInput, setErroInput] = useState("");
    const isDarkMode = useDarkMode();



    const adicionarSaldo = async () => {
        const token = localStorage.getItem("token");

        if (valor <= 0) {
            setErroInput("Valor inválido");
            return;
        }else if(valor > 10000){
            setErroInput("Valor máximo de depósito é de R$ 10.000,00");
            return;
        }

        const response = await doRequest(
            "http://localhost:8080/api/bank/depositar",
            "POST",
            {
                valor: parseFloat(valor),
            },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status === 200) {
            setSaldo(response.data.saldo);
            setErro("Depósito realizado com sucesso");
            setValor(response.data.valor);
            setTransactionId(response.data.transactionId);
            setDataTransacao(response.data.dataTransacao);
            setErroInput("");
            handleClose(true)
        } else {
            setErro(response.data.message);
        }
    };


    return (
        <>
            {show ? (
                <div className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">

                    <div className="modal-content  p-4 rounded-lg shadow-md w-[80%] dark:bg-gray-800 bg-white
                        md:w-[40%] lg:w-[30%] lg:flex lg:flex-col lg:justify-between
                    ">

                        <div className="fechar-modal flex justify-end mb-4">
                            
                            <button onClick={
                                () => {handleClose(false)}
                            }>{isDarkMode ? (<box-icon name='window-close' color='#ffff' ></box-icon>) : (<box-icon name='window-close'   ></box-icon>)}</button>
                        </div>

                        <div className="input-modal">
                            <InputText
                                type="number"
                                label={"Digite o valor a ser depositado"}
                                onChange={(e) => setValor(e.target.value)}
                                value={valor}
                            />
                            {erroInput && <p className="text-red-600 text-center flex justify-center items-center font-bold mt-2">{erroInput}</p>}
                        </div>

                        <div className="button-modal flex justify-center mt-3">
                            <Button1 text="Depositar" color="#2ba8fb" onClick={adicionarSaldo} />

                        </div>
                        {erro && <p className={`${erro == "Depósito realizado com sucesso" ? ("text-green-600") : ("text-red-600")} text-center font-bold flex justify-center items-center`}>{erro}</p>}


                    </div>
                </div>
            ) : null}

        </>

    )


}


export default ModalAdicionarSaldo;