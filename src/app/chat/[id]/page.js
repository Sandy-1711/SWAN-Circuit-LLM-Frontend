'use client'
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UIContext from "../../../../contexts/useUIContext";
import Wrapper from "@/components/ui/Wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "@/components/ui/MessageBubble";
import ChatInput from "@/components/ui/ChatInput";
import { Info } from "lucide-react";
import { useAxios } from "../../../../hooks/useAxios";

export default function ChatPage({ }) {
    const { id } = useParams();
    const [modelType, setModelType] = useState("chained"); // could be chained, baseline, graph
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState("");
    const [chatName, setChatName] = useState("");
    const axios = useAxios();
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);
    const user = useSelector((state) => state).auth.value;
    const loggedIn = useSelector((state) => state).auth.loggedIn;
    const router = useRouter();
    const bottomRef = useRef(null);
    useEffect(() => {
        if (id !== "new") {
            setChatId(id);
            fetchChat(id);
        }
    }, [])

    const abortControllerRef = useRef(null);
    async function fetchChat(id) {
        try {
            const { data } = await axios.get(`/user/chat?id=${id}`);

            if (data?.messages && Array.isArray(data.messages)) {

                let updated_data = data?.messages?.map((m) => {
                    let newJSON = {}
                    console.log(m.output);
                    try {
                        newJSON = JSON.parse(m.output)
                    }
                    catch (err) {
                    }
                    return {
                        ...m,
                        output: newJSON
                    }
                })
                setMessages(updated_data);
                // setMessages(
                //     data.messages.map((m) => {

                //         // Extract only {{parts:[],connections:[]}}
                //         // const regex = /\{\{.*?parts.*?connections.*?\}\}/s;
                //         // const match = m.output.match(regex);

                //         // if (!match) return null;

                //         // Convert {{ }} to valid JSON
                //         // const jsonLike = match[0].replace(/^\{\{|\}\}$/g, '{');
                //         // const validJson = jsonLike.replace(/(\w+):/g, '"$1":');

                //         // return JSON.parse(validJson); // Only object, not whole message
                //         return JSON.parse(m.output);
                //     }).filter(Boolean) // Remove nulls
                // );
            }

        } catch (err) {
            console.log(err);
            // alert("Something went wrong!!")
        }
    }



    useEffect(() => {
        if (!user?.access_token || !loggedIn) {
            router.push('/login')
        }
    }, [user])


    async function handleSubmit(e) {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const abortController = new AbortController();
        abortControllerRef.current = abortController
        try {
            // 1. Add user's message
            setMessages(prev => [...prev, {
                role: "user",
                message: e
            }]);

            if (id === "new") {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/new_chat?model=${modelType}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: e }),
                    signal: abortController.signal
                });
                if (!response.ok || !response.body) {
                    throw new Error("Failed to connect to stream");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";
                let code = ""
                let chat_id = -1;
                let msg_id = -1;
                let jsonOutput = ""
                let chat_name = ""
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    let lines = buffer.split("\n");

                    // Keep last incomplete line in buffer
                    buffer = lines.pop();
                    for (const line of lines) {
                        if (!line.trim()) continue;

                        try {
                            const parsed = JSON.parse(line);
                            console.log(parsed);
                            if (parsed.status === "abort" || parsed.status === "error") {
                                alert(parsed.reason);
                                return
                            }
                            if (parsed.stage === "code_progress") {
                                code += parsed.token

                            }
                            if (parsed.stage === "json_progress") {
                                jsonOutput += parsed.token
                            }
                            if (parsed.stage === "json_done") {
                                jsonOutput = parsed.output
                            }
                            // Do something with the chunk, e.g., update state
                            // updateUI(parsed)
                            if (parsed.status === "user_message_saved") {
                                msg_id = parsed.msg_id;
                                chat_id = parsed.chat_id
                            }
                            if (parsed.status === "saved" && parsed.chat_name) {
                                chat_name = parsed.chat_name
                            }
                            if (parsed.status === "done") {
                                let finalOutput = {}
                                try {
                                    finalOutput = JSON.parse(jsonOutput)
                                } catch (e) {
                                    console.error("JSON parse error:", jsonOutput)
                                }
                                setMessages(prev => [...prev, {
                                    role: "assistant",
                                    id: parsed.msg_id,
                                    message: parsed?.response,
                                    code: code,
                                    output: jsonOutput
                                }]);
                                setChatId(chat_id);
                                setChatName(chat_name);
                                router.replace(`/chat/${chat_id}`);
                            }
                        } catch (err) {
                            console.warn("Failed to parse chunk:", line, err);
                        }
                    }
                }

            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/chat_stream?model=${modelType}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: e, chat_id: id }),
                    signal: abortController.signal
                });
                if (!response.ok || !response.body) {
                    throw new Error("Failed to connect to stream");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";
                let code = ""
                let msg_id = -1;
                let jsonOutput = ""
                let final_message = ""
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    let lines = buffer.split("\n");
                    buffer = lines.pop();
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const parsed = JSON.parse(line);
                            console.log(parsed);
                            if (parsed.status === "abort" || parsed.status === "error") {
                                alert(parsed.reason);
                                return
                            }
                            if (parsed.stage === "code_progress") {
                                code += parsed.token

                            }
                            if (parsed.stage === "json_progress") {
                                jsonOutput += parsed.token
                            }
                            if (parsed.status === "user_message_saved") {
                                msg_id = parsed.msg_id;
                            }

                            if (parsed.status === "saved") {
                                final_message = parsed.final_message
                            }
                            if (parsed.status === "done") {
                                setMessages(prev => [...prev, {
                                    role: "assistant",
                                    id: parsed.msg_id,
                                    message: final_message,
                                    code: code,
                                    output: modelType === "baseline" ? jsonOutput : JSON.parse(jsonOutput)
                                }]);
                            }
                        } catch (err) {
                            console.warn("Failed to parse chunk:", line, err);
                        }
                    }
                }

            }
        } catch (err) {
            // console.log(err);
            if (err.name === "AbortError") console.log("Aborted");
            else {
                console.log(err);
            }

        } finally {
            abortControllerRef.current = null;
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function cancelRequest() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }


    if (id !== "new") {
        return <div className="flex flex-col max-h-screen">
            <div className="bg-[var(--sidebar-bg)] relative  w-full py-3">
                <Wrapper className={"flex justify-between items-center"}>
                    <div className="">
                        <img className="h-12 w-12 rounded-full" src="/swan.png" />
                    </div>
                    <div>
                        <h2 className="text-2xl text-[var(--text)] font-medium">{chatName}</h2>
                    </div>
                    <div>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </Wrapper>
            </div>
            <div className="flex-1 flex flex-col relative overflow-hidden pb-20">
                <div style={{ scrollbarWidth: "thin" }} className="flex-1 overflow-y-scroll px-4 sm:px-6 lg:px-10 pt-6 pb-0">
                    <Wrapper>
                        <div className="flex-1 overflow-y-auto ">
                            {messages.map((msg, idx) => (
                                <MessageBubble key={idx} message={msg} />
                            ))}
                            <div ref={bottomRef}></div>
                        </div>
                    </Wrapper>
                </div>
            </div>
            <div className="absolute bottom-6 w-full">
                <ChatInput cancelRequest={cancelRequest} onSubmit={handleSubmit} modelType={modelType} setModelType={setModelType} />
            </div>
        </div>
    }
    return <div className="flex flex-col min-h-screen relative max-h-screen">
        <div className="bg-[var(--sidebar-bg)] relative  w-full py-3">
            <Wrapper className={"flex justify-between items-center"}>
                <div className="">
                    <img className="h-12 w-12 rounded-full" src="/swan.png" />
                </div>
                <div>
                    <h2 className="text-2xl text-[var(--text)] font-medium">{"Welcome to SWAN AI"}</h2>
                </div>
                <div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </Wrapper>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[90%] sm:w-[80%] md:w-[70%] lg:w-[40%]">
            <ChatInput cancelRequest={cancelRequest} modelType={modelType} setModelType={setModelType} onSubmit={handleSubmit} />
        </div>
        <div className="flex fixed bottom-0 w-full flex-col py-4">
            <div className="flex  justify-center gap-1.5 items-center">
                <h2 className="text-sm text-[var(--text-muted)] text-center font-medium">Disclaimer
                </h2>
                <Info className="w-4 h-4 mt-0.5 text-[var(--text-muted)]" />
            </div>
            <div><p className="text-sm font-light text-center text-[var(--text-muted)]">The information provided by SWAN AI is for informational purposes only and may not be accurate.</p></div>
        </div>
    </div>
}