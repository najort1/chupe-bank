import boxicons from "boxicons";
import chatIcon from '../../assets/headset.svg'
import { div } from "framer-motion/client";

import { useState,useEffect } from "react";
import useDarkMode from "../../utils/useDarkMode";
import { Client } from "@stomp/stompjs";
import InputText from "../Inputs/Input";
import ChatBox from "./ChatBox";


const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        'Olá, tudo bem? Como posso te ajudar?',
        'Estou com um problema no meu cartão',
        'Qual o problema?',
        'Não estou conseguindo fazer compras',
        'Vamos tentar resolver isso',
    ]);
    const [message, setMessage] = useState('');
    const [client, setClient] = useState(null);

    const isDarkMode = useDarkMode();
    

    const chatBox = () => {
        return (
            <div className="chat-box fixed bottom-24 right-1 rounded-lg bg-white dark:bg-gray-800 dark:text-white">

                <ChatBox isOpen={isOpen} setIsOpen={setIsOpen} messages={messages} setMessages={setMessages} message={message} setMessage={setMessage}/>

            </div>

        )
    }
    useEffect(() => {
      const client = new Client({
        brokerURL: 'ws://localhost:8080/websocket', // URL do seu WebSocket
        onConnect: () => {
          console.log('Conectado ao WebSocket');
          client.subscribe('/topic/chat', (message) => {
            console.log('Mensagem recebida:', message.body);
          });
        },
        onStompError: (frame) => {
          console.error('Erro no STOMP:', frame.headers['message']);
          console.error('Detalhes:', frame.body);
        },
      });

      client.activate();
      setClient(client);
      
      }, []);


  return (
    <div className="fixed bottom-0 right-0 p-4 shadow-lg rounded-full bg-white flex items-center
        dark:bg-gray-800 dark:text-white
    ">
        <img src={chatIcon} alt="Chat" className="w-12 h-12 dark:invert" onClick={() => setIsOpen(!isOpen)} />
        {isOpen && chatBox()}
    </div>



  );
};

export default Chat;
