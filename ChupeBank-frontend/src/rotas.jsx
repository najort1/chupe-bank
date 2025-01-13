import Principal from "./pages/Principal";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import HomePageUser from "./pages/Home";
import Cartao from "./pages/Cartao";
import Extrato from "./pages/Extrato";
import AlterarSenhaCartao from "./pages/AlterarSenha";
import HomeAtendentes from "./pages/HomeAtendentes";
import Atendimento from "./pages/ChatAtendimento";

const routes = [
    { path: "/", element: <Principal /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Cadastro /> },
    { path: "/home", element: <HomePageUser /> },
    { path: "/cartao", element: <Cartao /> },
    { path: "/extrato", element: <Extrato /> },
    { path: "/alterar-senha", element: <AlterarSenhaCartao /> },
    { path: "/home-atendentes", element: <HomeAtendentes /> },
    { path: "/atendimento/:id", element: <Atendimento /> },
  ];
  
export default routes;
  