import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InputText from "../../components/Inputs/Input";
import { useState } from "react";
import { doRequest } from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";
import { encryptAES } from "../../utils/AesUtil";

const Cadastro = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitCadastro = async (e) => {
        e.preventDefault();

        const cadastroData = JSON.stringify({
            email,
            senha,
            nome,
            cpf,
            telefone
        })
        const encryptedData = encryptAES(cadastroData);
        const postdata = { encryptedBody: encryptedData };

        try {
            const respostaApi = await doRequest('http://localhost:8080/auth/cadastrar', 'POST', postdata);
            const { token, message } = respostaApi.data;

            if (token) {
                localStorage.setItem('token', token);
                navigate('/home');
            } else if (message === 'Bad credentials') {
                setError('Email ou senha incorretos');
            }else{
                setError('Erro ao realizar cadastro: '+message + '. Tente novamente.');
            }
        } catch (error) {
            setError('Erro ao realizar cadastro. Tente novamente.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="container-login dark:bg-gray-800 dark:text-white bg-white text-gray-800 flex flex-col justify-around gap-4 p-4 rounded-md shadow-md w-[90%] h-[50%] md:w-[50%] xl:w-[30%]">
                    <div className="titulo-container text-center">
                        <h1 className="titulo-container-login font-bold text-2xl">Faça seu cadastro</h1>
                    </div>
                    <hr />
                    <div className="inputs-container-login flex flex-col p-2">
                        <div className="input-container flex flex-col gap-6">
                            <InputText label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} id="nome" tipo="text" />
                            <InputText label="Email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" tipo="text" />
                            <InputText label="Senha" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} tipo="password" />
                            <InputText label="CPF" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} tipo="text" />
                            <InputText label="Telefone" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} tipo="text" />
                            <p className="error-api font-bold text-red-400 text-center">{error}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="button-container-login flex flex-col gap-4">
                        <button onClick={submitCadastro} className="button-login bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Cadastrar</button>
                        <button onClick={() => navigate('/login')} className="button-cadastro bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Cadastro;