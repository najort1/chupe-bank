import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./rotas";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const validaJwt = (jwt) => {
    try{
      const token = jwtDecode(jwt);
      const dataExpiracao = token.exp * 1000; // Converter para milissegundos
      const dataAtual = new Date().getTime();
      if (dataAtual > dataExpiracao) {
        setIsSessionExpired(true);
        setUsuarioLogado(false);
        localStorage.clear();
        return false;
      } else {
        setIsSessionExpired(false);
        return true;
      }
    }catch{
      return true;
    }

  };

  const elementoSessaoExpirada = () => {
    return (
      <>
        <div
          className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50
      "
        >
          <div
            className="modal-content  p-4 rounded-lg shadow-md w-[70%] h-[20%] dark:bg-gray-800 bg-white
                        md:w-[40%] md:h-[15%] lg:w-[20%] lg:h-[20%] lg:flex lg:flex-col lg:justify-around
                    "
          >
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl text-red-500 font-bold mb-2">
                Sessão expirada
              </h1>
              <p className="text-center">
                Sua sessão expirou, por favor faça login novamente.
              </p>

              <button
                className="bg-blue-500 text-white p-2 rounded-md mt-4"
                onClick={() => (window.location.href = "/login")}
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      let JwtValido = validaJwt(localStorage.getItem("token"));

      if (!JwtValido) {
        setUsuarioLogado(false);
        setIsSessionExpired(true);
      } else if (!localStorage.getItem("token")) {
        setUsuarioLogado(false);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      {isSessionExpired && elementoSessaoExpirada()}
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
