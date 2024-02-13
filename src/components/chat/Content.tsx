import React from 'react';
import UserMessage from "@/components/chat/UserMessage";
import SystemMessage from "@/components/chat/SystemMessage";
import NoSSR from "@/components/NoSSR";
import ScrollToBottom from "react-scroll-to-bottom";
import {useSelector} from "react-redux";
import {selectMessages} from "@/redux/reducers/chatSlice";

const Content = () => {
    const messages = useSelector(selectMessages);
    return (
        <div className="relative h-[80%]">
            <NoSSR>
                {messages.length > 0 ? (
                    <ScrollToBottom
                        initialScrollBehavior="auto"
                        followButtonClassName="scroll-to-last-message"
                        className="!absolute top-0 flex flex-col w-full overflow-x-hidden overflow-y-auto"
                    >
                        {messages.map((message, index) =>
                            message.role === "user" ?
                                <UserMessage key={index} message={message.content} />
                                : <SystemMessage key={index} message={message as unknown as string} />
                        )}
                    </ScrollToBottom>
                ) : (
                    <div style={{textAlign: "center"}} className="flex flex-col items-center my-16">
                        <h1 className="text-3xl font-bold">Memoria Justificativa Da Ação - GPT</h1>
                        <p className="text-gray-400 mt-2">Este assistente irá ajudar-te a escrever o Anexo 2 para a Medida Cheque-Formação + Digital</p>
                    </div>
                )}
            </NoSSR>
        </div>
    );
};

export default Content;
