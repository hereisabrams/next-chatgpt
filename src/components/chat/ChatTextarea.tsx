import React, { useEffect, useRef, useState } from 'react';
import Textarea from "react-textarea-autosize";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, selectMessages, selectPrompt, setPrompt } from "@/redux/reducers/chatSlice";
import { Button } from 'react-scroll';

const ChatTextarea = () => {
    const dispatch = useDispatch();
    const prompt = useSelector(selectPrompt);
    const messages = useSelector(selectMessages);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [threadId, setThreadId] = useState<string>("");
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        dispatch(addMessage({
            role: 'user',
            content: "Vamos começar o questionário!"
        }))

        createThread();
        if (textAreaRef.current === null) return;
        textAreaRef.current.focus();
    }, []);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const isMobile = width <= 768;
        if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
            e.preventDefault();
            if (isLoading) return;
            if (prompt.trim() === '') return;
            setIsLoading(true);
            dispatch(addMessage({
                role: 'user',
                content: prompt
            }))

            axios.post('/api/chat', {
                threadId,
                prompt,
                messages
            })
                .then(response => response.data)
                .then((data) => {
                    setIsLoading(false);
                    dispatch(addMessage(data.message))
                });

            dispatch(setPrompt(''));
        }
    }

    function sendMessage() {
        if (prompt.length <= 0) return;
        if (isLoading) return;
        if (prompt.trim() === '') return;
        setIsLoading(true);
        dispatch(addMessage({
            role: 'user',
            content: prompt
        }))

        axios.post('/api/chat', {
            threadId,
            prompt,
            messages
        })
            .then(response => response.data)
            .then((data) => {
                setIsLoading(false);
                dispatch(addMessage(data.message))
            });

        dispatch(setPrompt(''));

    }

    function sendFirstMessage() {
        setIsLoading(true);
        dispatch(addMessage({
            role: 'user',
            content: "Vamos começar o questionário!"
        }))
        

        axios.post('/api/chat', {
            threadId,
            prompt: "Vamos começar o questionário!",
            messages
        })
            .then(response => response.data)
            .then((data) => {
                setIsLoading(false);
                dispatch(addMessage(data.message))
            });

        dispatch(setPrompt(''));

    }

    async function createThread() {
        setIsLoading(true);
        const thread = await axios.get('/api/thread')
            .then(response => response.data)
            .then(async (data) => {
                setThreadId(data.response);
                return data.response;
            });

        await axios.post('/api/chat', {
            threadId: thread,
            prompt: "Vamos começar o questionário!",
            messages
        })
            .then(response => response.data)
            .then((data) => {
                setIsLoading(false);
                dispatch(addMessage(data.message))
            });

        dispatch(setPrompt(''));

    }

    return (
        <div className="mt-1 relative rounded-md shadow-sm">
            {messages.length == 0 ? (
                <button disabled={isLoading} onClick={sendFirstMessage} className="flex flex-col w-full px-5 py-4 transition border-2 border-accents-3 rounded-lg hover:border-gray-500">
                    <h3 className="font-medium">{isLoading ? "Espere um momento ..." : "Vamos Começar"}</h3>
                </button>
            ) :
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }} className=' h-[105px]'>
                    <Textarea
                        ref={textAreaRef}
                        rows={1}
                        name="comment"
                        id="comment"
                        style={{color:"white", backgroundColor: "#393939"}}
                        className="px-4 py-3 focus:outline-none block rounded-md resize-none h-[45px]"
                        placeholder={isLoading ? 'Aguarde a resposta ...' : 'Escreva aqui a sua mensagem ...'}
                        defaultValue={''}
                        value={prompt}
                        onKeyDown={handleKeyDown}
                        onInput={(e) => dispatch(setPrompt(e.currentTarget.value))}
                        disabled={isLoading || messages.length === 0}
                    />
                    <button disabled={isLoading || prompt.length <= 0} onClick={sendMessage} className=" h-[50px] flex flex-col px-5 py-3 transition border-2 border-accents-3 rounded-lg hover:border-gray-500 al" style={{ textAlign: "center" }}>
                        {isLoading ?
                            <svg className="animate-spin h-2 h-[20px] text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            :
                            isLoading ? ">" : ">"
                        }
                    </button>
                </div>
            }
        </div>
    );
};

export default ChatTextarea;
