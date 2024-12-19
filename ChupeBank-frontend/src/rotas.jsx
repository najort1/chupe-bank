import Principal from "./pages/Principal";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import HomePageUser from "./pages/Home";
import Cartao from "./pages/Cartao";


const routes = [
    { path: "/", element: <Principal /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Cadastro /> },
    { path: "/home", element: <HomePageUser /> },
    { path: "/cartao", element: <Cartao /> },
  ];
  
export default routes;
  