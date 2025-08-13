'use client'
import { createContext, useState } from "react";
const FullCodeContext = createContext();

export const FullCodeContextProvider = ({ children }) => {
    const [code, setCode] = useState("");
    const [open, setOpen] = useState(false);
    const [msgId, setMsgId] = useState("");
    const [prompt, setPrompt] = useState("");
    const [output, setOutput] = useState({});
    return (
        <FullCodeContext.Provider value={
            {
                code, setCode, output, setOutput, open, setOpen, prompt, setPrompt, msgId, setMsgId
            }
        }>
            {children}
        </FullCodeContext.Provider>
    )
}

export default FullCodeContext