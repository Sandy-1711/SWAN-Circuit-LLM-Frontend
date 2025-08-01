'use client'
import { createContext, useState } from "react";
const FullCodeContext = createContext();

export const FullCodeContextProvider = ({ children }) => {
    const [code, setCode] = useState("");
    const [open, setOpen] = useState(false);
    const [output, setOutput] = useState({});
    return (
        <FullCodeContext.Provider value={
            {
                code, setCode, output, setOutput, open, setOpen
            }
        }>
            {children}
        </FullCodeContext.Provider>
    )
}

export default FullCodeContext