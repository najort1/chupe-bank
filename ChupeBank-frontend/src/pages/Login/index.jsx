import Header from "../../components/Header";
import Footer from "../../components/Footer";

import InputText from "../../components/Inputs/InputText";
import { useState } from "react";
import axios from "axios";
import {encryptAES} from "../../utils/AesUtil";
import {doRequest} from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";

const Login = () => {




    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitLogin = async (e) => {
        e.preventDefault();

        const loginData = JSON.stringify(
            {
                email: email,
                senha: senha,
            }
        )
      


        const encryptedData = encryptAES(loginData);
        const postdata = {
            "encryptedBody": encryptedData
          }

        const respostaApi = await doRequest('http://localhost:8080/auth/login', 'POST',postdata)
        let erro;

        if(!JSON.stringify(respostaApi.data).includes('token":null')){
            const token = respostaApi.data.token
            localStorage.setItem('token', token)
            navigate('/home')
        }else{
            erro = respostaApi.data.message
            if(erro === 'Bad credentials'){
                setError('Email ou senha incorretos')
            }
        }


    }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="container-login
            dark:bg-gray-800 dark:text-white bg-white text-gray-800 flex flex-col justify-around gap-4 p-4 rounded-md shadow-md
            w-[90%]
            h-[50%]
            md:w-[50%]
            xl:w-[30%]
        ">
          <div className="titulo-container text-center">
            <h1 className="titulo-container-login font-bold text-2xl">Faça login</h1>
          </div>
          <hr />
          <div className="inputs-container-login flex flex-col p-2">
            <div className="input-container flex flex-col gap-6">
              <InputText label="Email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" tipo={'text'} />
              <InputText label="Senha" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} tipo={'password'} />
              <p className="error-api font-bold text-red-400 text-center">{error}</p>
            </div>
          </div>
          <hr />
          <div className="button-container-login flex flex-col gap-4">
            <button onClick={submitLogin} className="button-login bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button>
            <button className="button-cadastro bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cadastrar-se</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Login;
