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

    useEffect(() => {
        createThread();
        if (textAreaRef.current === null) return;
        textAreaRef.current.focus();
    }, []);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
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
                    dispatch(addMessage(data))
                });

            dispatch(setPrompt(''));
        }
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
                dispatch(addMessage(data))
            });

        dispatch(setPrompt(''));

    }

    async function createThread() {
        setIsLoading(true);
        axios.get('/api/thread')
            .then(response => response.data)
            .then((data) => {
                setIsLoading(false);
                setThreadId(data.response);
            });
    }

    return (
        <div className="mt-1 relative rounded-md shadow-sm">
            {messages.length === 0 ? (
                <button  disabled={isLoading} onClick={sendFirstMessage} className="flex flex-col w-full h-full px-5 py-4 transition border-2 border-accents-3 rounded-lg hover:border-gray-500">
                    <h3 className="font-medium">Vamos Começar</h3>
                </button>
            ) :
                <Textarea
                    ref={textAreaRef}
                    rows={1}
                    name="comment"
                    id="comment"
                    className="px-4 py-3 bg-accents-1 focus:outline-none block w-full text-white rounded-md resize-none"
                    placeholder={isLoading ? 'Aguarde a resposta ...' : 'Escreva uma mensagem e clique enter ...'}
                    defaultValue={''}
                    value={prompt}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => dispatch(setPrompt(e.currentTarget.value))}
                    disabled={isLoading || messages.length === 0}
                />
            }
            {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ChatTextarea;
