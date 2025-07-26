'use client'
import { createContext, useState } from "react";
const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCanvasOpen, setIsCanvasOpen] = useState(true);
    return (
        <UIContext.Provider value={
            {
                isSidebarOpen,
                setIsSidebarOpen,
                isCanvasOpen,
                setIsCanvasOpen
            }
        }>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext