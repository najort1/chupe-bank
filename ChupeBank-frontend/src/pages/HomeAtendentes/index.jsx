import useDarkMode from "../../utils/useDarkMode";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { doRequest } from "../../utils/doRequest";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const HomeAtendentes = () => {
  const isDarkMode = useDarkMode();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

  const handleRedirectAndEnterRoom = async (roomHash) => {

    const resposta = await doRequest(`http://localhost:8080/atendimento/entrar/${roomHash}`,'POST',null,{
        Authorization: `Bearer ${token}`
    })
    
    if(resposta.status === 200){
        navigate(`/atendimento/${roomHash}`);
    }else{
        alert('Erro ao entrar na sala de atendimento');
    }

}

  const fetchChats = async () => {
    const resposta = await doRequest(
      "http://localhost:8080/atendimento/listar-todos",
      "get",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (resposta.status === 200) {
      setChats(resposta.data);
    } else {
      setChats([]);
    }
  };

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    onOpen();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Usuários Aguardando Atendimento
        </h1>
        {chats.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Nenhum usuário aguardando atendimento no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                    {chat.titulo}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chat.descricao}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    <strong>Cliente:</strong> {chat.nome}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                    <strong>Última Mensagem:</strong>{" "}
                    {chat.ultimaMensagem || "Nenhuma mensagem ainda."}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  {chat.usuario2Id ? (
                    <>
                      <p className="text-sm text-red-600 font-medium">
                        Já sendo atendido
                      </p>
                      <Button
                        size="sm"
                        color="success"
                        onPress={() => handleOpenChat(chat)}
                      >
                        Atender
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      color="success"
                      onPress={() => handleOpenChat(chat)}
                    >
                      Atender
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedChat && (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
          <ModalContent>
            <ModalHeader>
              <h2>Atendimento: {selectedChat.roomHash}</h2>
            </ModalHeader>
            <ModalBody>
              <p>
                <strong>Descrição:</strong> {selectedChat.descricao}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedChat.nome}
              </p>
              <p>
                <strong>Última Mensagem:</strong>{" "}
                {selectedChat.ultimaMensagem || "Nenhuma mensagem ainda."}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Fechar
              </Button>
              <Button color="success" onPress={() => handleRedirectAndEnterRoom(selectedChat.roomHash)}>
                Iniciar Atendimento
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Footer />
    </>
  );
};

export default HomeAtendentes;
