import useDarkMode from "../../utils/useDarkMode";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InputText from "../../components/Inputs/Input";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import boxicons from "boxicons";
import Button1 from "../../components/Buttons/Button1";

const ModalAdicionarSaldo = ({ show, handleClose }) => {
    const [valor, setValor] = useState(0);
    
    const navigate = useNavigate();


    const adicionarSaldo = async () => {
        const token = localStorage.getItem("token");
        const response = await doRequest(
            "http://localhost:8080/api/bank/adicionar",
            "POST",
            {
                valor: valor,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (response.status === 200) {
            fetchDadosBancarios();
            handleClose();
        } else {
            console.log(response);
        }
    };

}

