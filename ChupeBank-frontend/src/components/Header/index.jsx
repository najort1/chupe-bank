import logo from "../../assets/logo.webp";
import userDefault from "../../assets/user-3296.svg";
import boxicons from "boxicons";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import useDarkMode from '../../utils/useDarkMode';
import { jwtDecode } from "jwt-decode";
import { doRequest } from "../../utils/doRequest";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";



import { useState,useEffect } from "react";

const Header = () => {
    const isDarkMode = useDarkMode();
    const [logged, setLogged] = useState(false);
    const [nome,setNome] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            setLogged(true);
            const { sub } = jwtDecode(token);
            setNome(sub);
        }
    }, []);

    useEffect(() => {
        

    }, [logged]);



    const navigate = useNavigate();

    const transformaAterndente = async () => {

        try {
          const response = await doRequest('http://localhost:8080/usuario/mudar', 'POST', null, {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          });

          if(response.status === 200){
            navigate('/home-atendentes');
          }else{
            console.log('Erro ao criar atendente');
          }
          

        } catch (error) {
          console.error('Erro ao buscar os chats:', error);
        }

    }


  return (
    <header className="site-header h-12 shadow-md flex flex-row justify-between items-center p-
      xl:h-16
      dark:bg-gray-800
    ">
      <div className="logo-container flex flex-row items-center p-2 cursor-pointer"
        onClick={ () => !logged ? navigate('/') : navigate('/home')}
      >
        <h1 className="titulo-banco font-bold text-xl
            dark:text-white
            xl:text-2xl
        ">Chupe<span className="subtitulo text-green-800 font-bold">Bank</span></h1>
      </div>
      
      <div className="ativar-modo-escuro">
        <ThemeSwitcher />
      </div>

      <div className="usuario-container mr-4">
            {!logged ? (
                        <Dropdown>
                        <DropdownTrigger>
                          <Avatar
                            isBordered
                            as="button"
                            
                            size="md"
                            className="transition-transform"
                          />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            
                            <DropdownItem 
                              onPress={() => navigate('/login')}
                              textValue="Faça login ou cadastre-se"
                            key='info'>
                                <div className="dropdown-item-no-user flex flex-row justify-center">
                                    <p className="w-48 text-center text-green-800 font-bold
                                        dark:text-white
                                    ">Faça login ou cadastre-se</p>
                                </div>
                            </DropdownItem>

                          <DropdownItem 
                            onPress={() => navigate('/login')}
                            textValue="Entrar"
                          key="settings">
                            <div className="dropdown-item-no-user flex flex-row items-center w-full cursor-pointer">
                                {isDarkMode ? <box-icon color='#ffff' name='door-open'></box-icon> : <box-icon name='door-open'></box-icon>}
                                <p className="ml-2">Entrar</p>
                            </div>

                          </DropdownItem>
                          <DropdownItem 
                          textValue="Cadastrar-se"
                            onPress={() => navigate('/cadastro')}
                          key="team_settings">
                            <div className="dropdown-item-no-user flex flex-row items-center w-full cursor-pointer">
                                {isDarkMode ? <box-icon color='#ffff' name='user-plus'></box-icon> : <box-icon name='user-plus'></box-icon>}
                                <p className="ml-2">Cadastrar-se</p>
                            </div>

                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
            ) : (
                <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                              textValue="Logado com o email:"
                              onPress={() => navigate('/home')}
                              key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Logado com o email:</p>
                    <p className="font-semibold">{nome}</p>
                  </DropdownItem>
                  <DropdownItem 
                    textValue="Home"
                    onPress={() => {setLogged(false);localStorage.clear();navigate('/');}} key="logout" color="danger">Sair da conta
                  </DropdownItem>
                  <DropdownItem 
                    textValue="Atendente"
                    onPress={() => {transformaAterndente();}} key="atendente" color="success">Mudar tipo de conta
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
      </div>
    </header>
  );
};

export default Header;
