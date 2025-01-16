import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import {jwtDecode} from "jwt-decode";
import { doRequest } from "../../utils/doRequest";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Header from "../../components/Header";

const Atendimento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

    const handleSincronizarChat = async () => {
      try {
        const response = await doRequest(`http://localhost:8080/mensagem/sincronizacao`, 'GET', null, {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
        );
  
        if (response.status === 200) {
          setMessages(response.data);
        }
  
  
      } catch (error) {
        console.error('Erro ao sincronizar chat:', error);
      }
    };

  useEffect(() => {
    handleSincronizarChat();
  }, []);


  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/chat-websocket",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe(`/topic/chat/${id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);

          if (receivedMessage.senderId !== userId && receiverId === null) {
            setReceiverId(receivedMessage.senderId);
          }

          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => console.error("Erro no STOMP:", frame),
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [id, userId, receiverId]);

  const handleSendMessage = () => {
    if (message.trim() && stompClient) {
      const payload = {
        senderId: userId,
        receiverId,
        content: message,
        timestamp: new Date().toISOString(),
        roomId: id,
        type: "CHAT",
      };

      stompClient.publish({
        destination: `/app/chat/${id}`,
        body: JSON.stringify(payload),
      });

      setMessage("");
    }
  };

  const handleDarCartao = async () => {

    const postData = {
      "usuarioId": receiverId
    }

    const resposta = await doRequest(`http://localhost:8080/atendente/dar`,'POST',postData,{
        Authorization: `Bearer ${token}`
    })
    
    if(resposta.status === 200){
        alert('Cartão entregue com sucesso');
    }else{
        alert('Erro ao entregar cartão');
    }

  }


  return (

    <>
    <Header />
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
          <ModalContent>
            <ModalHeader>Ações</ModalHeader>

            <ModalBody>
              <Button
                onClick={handleDarCartao}
                auto
                type="success"
              >
                Dar cartão
              </Button>

            </ModalBody>


            <ModalFooter>
              <Button
                onClick={() => {
                  onClose();
                }}
                auto
                type="error"
              >
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <div className="flex flex-col h-screen dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                msg.senderId === userId
                  ? "bg-blue-500"
                  : "bg-gray-500 text-left"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 shadow-lg dark:bg-gray-700">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
        <button
          onClick={onOpen}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Ações
        </button>
      </div>
    </div>
    </>



  );
};

export default Atendimento;
