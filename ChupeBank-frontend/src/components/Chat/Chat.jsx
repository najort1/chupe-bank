import chatIcon from '../../assets/headset.svg';
import { useState, useEffect } from 'react';
import useDarkMode from "../../utils/useDarkMode";
import { doRequest } from "../../utils/doRequest";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("menu");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const isDarkMode = useDarkMode();
  const [stompClient, setStompClient] = useState(null);
  const [client, setClient] = useState(null); // Novo useState para o client do STOMP
  const [receiverId, setReceiverId] = useState(null);

  const navigate = useNavigate();



    const token = localStorage.getItem('token');

    if(!token){
      navigate('/login');
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

  useEffect(() => {
    if (currentPage === 'chats') {
      fetchChats();
    }
  }, [currentPage]);

  useEffect(() => {

    if (selectedChat) {
      handleSincronizarChat();
      client.subscribe(`/topic/chat/${selectedChat.roomHash}`, (message) => {
        const receivedMessage = JSON.parse(message.body);

        if(receivedMessage.senderId !== userId && receiverId === null){
          setReceiverId(receivedMessage.senderId);
        }

        if (receivedMessage.type === "CHAT") {
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }else if (receivedMessage.type === "JOIN") {
          setMessages((prevMessages) => [...prevMessages, {content: `${receivedMessage.senderId} se conectou.`}]);
        }

      });

      const payload = {
        senderId: userId,
        receiverId: receiverId,
        timestamp: new Date().toISOString(),
        roomId: selectedChat.roomHash,
        type: "JOIN"
      };
  
      stompClient.publish({
        destination: `/app/chat/${selectedChat.roomHash}`,
        body: JSON.stringify(payload),
      });

    }

  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await doRequest('http://localhost:8080/atendimento/listar', 'GET', null, {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      });
      setChats(response.data);
    } catch (error) {
      console.error('Erro ao buscar os chats:', error);
    }
  };

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
    const client = new Client({
      brokerURL: "ws://localhost:8080/chat-websocket",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Conectado ao WebSocket");
      },
      onStompError: (frame) => console.error("Erro no STOMP:", frame),
    });

    client.activate();
    setStompClient(client);
    setClient(client); // Atualiza o estado do client

    return () => {
      client.deactivate();
    };
  }, []);

  const handleSendMessage = () => {

  
    if (message.trim() && stompClient && selectedChat) {
      const payload = {
        senderId: userId,
        receiverId: receiverId,
        content: message,
        timestamp: new Date().toISOString(),
        roomId: selectedChat.roomHash,
        type: "CHAT"
      };
  
      stompClient.publish({
        destination: `/app/chat/${selectedChat.roomHash}`,
        body: JSON.stringify(payload),
      });
  
      setMessage("");
    }
  };

  const handleConnectChat = () => {

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const userNome = decodedToken.nome;
  
    if (stompClient && selectedChat) {

      const payload = {
        receiverId: receiverId,
        senderId: userId,
        content: userNome + " se conectou.",
        timestamp: new Date().toISOString(),
        roomId: selectedChat.roomHash,
        type: "CONNECT"
      };

      stompClient.publish({
        destination: `/app/chat/connect/${selectedChat.roomHash}`,
        body: JSON.stringify(payload),
      });

      setMessages([...messages, payload]);

    }



  }

  const handleIniciarNovoChat = async () => {
    try {
      const response = await doRequest('http://localhost:8080/atendimento/criar', 'POST', null, {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      });

      if (response.status === 200) {
        setSelectedChat(response.data);
        setCurrentPage('chatDetails');
      } else {
        console.error('Erro ao criar chat:', response);
      }
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const renderMenu = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Bem-vindo ao Chat!</h2>
      <div className="flex flex-col gap-4">
        <button className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600" onClick={() => setCurrentPage('chats')}>
          Exibir chats anteriores
        </button>
        <button className="py-2 px-4 rounded bg-green-500 text-white hover:bg-green-600" onClick={handleIniciarNovoChat}>
          Iniciar um novo chat
        </button>
      </div>
    </div>
  );

  const renderChatList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <button className="text-blue-500 hover:underline" onClick={() => setCurrentPage("menu")}>
          Voltar ao menu
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4">Chats Anteriores</h2>
        {chats.map((chat) => (
          <div key={chat.id} className="p-4 mb-2 rounded bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" onClick={() => {
            setSelectedChat(chat);
            setCurrentPage("chatDetails");
            handleConnectChat();
          }}>
            <p className="font-medium">Chat ID: {chat.id}</p>
            <p className="text-sm text-gray-500">Última mensagem: {chat.ultimaMensagem || "Nenhuma mensagem ainda"}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatDetails = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <button className="text-blue-500 hover:underline" onClick={() => setCurrentPage("chats")}>
          Voltar aos chats
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4">Chat ID: {selectedChat?.id}</h2>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${msg.senderId === userId ? 'bg-blue-500 text-white self-end' : 'dark:text-white bg-gray-200 dark:bg-gray-700 text-black'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex gap-2">
        <input type="text" className="flex-1 p-2 rounded border dark:bg-gray-800 dark:text-white" placeholder="Digite sua mensagem..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-0 right-0 p-4 shadow-lg rounded-full bg-white flex items-center dark:bg-gray-800">
      <img src={chatIcon} alt="Chat" className="w-12 h-12 dark:invert cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="chat-box fixed bottom-24 right-4 w-80 h-96 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          {currentPage === 'menu' ? renderMenu() : currentPage === 'chats' ? renderChatList() : renderChatDetails()}
        </div>
      )}
    </div>
  );
};

export default Chat;
