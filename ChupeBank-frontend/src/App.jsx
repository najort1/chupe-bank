import { useState } from 'react';
import axios from 'axios';
import { encryptAES } from './utils/AesUtil';

function App() {
  const [email, setUsername] = useState('');
  const [senha, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Cria um objeto com os dados de login
      const loginData = JSON.stringify({ email, senha });

      // Criptografa os dados
      const encryptedData = encryptAES(loginData);
      
      const postdata = {
        "encryptedBody": encryptedData
      }

      // Envia os dados criptografados para o backend
      const response = await axios.post('http://localhost:8080/auth/login', postdata, {
      });

      // Processa a resposta (descriptografar se necessário)
      if (response.data) {
        console.log('Resposta do servidor:', response.data);
        // Redirecione o usuário ou processe a resposta conforme necessário
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>EMAIL:</label>
        <input type="text" value={email} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>SENHA:</label>
        <input type="password" value={senha} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Logar</button>
    </form>
  );
}

export default App
