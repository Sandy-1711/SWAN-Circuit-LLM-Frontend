'use client'

import ScrollableChatScreen from "@/components/ui/ScrollableChatScreen";
import Sidebar from "@/components/ui/Sidebar";
import { ArrowUp, Mic } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import UIContext from "../../../contexts/useUIContext";

export default function Page({ }) {
    const params = useParams();
    const user = useSelector((state) => state).auth.value;
    const router = useRouter();
    const { isSidebarOpen, setIsSidebarOpen, isCanvasOpen } = useContext(UIContext);
    // useLayoutEffect(() => {
    //     if (!user) {
    //         router.push("/login");
    //     }
    // }, [user])

    return <div className="flex h-screen">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col bg-primary relative">
            <div style={{ scrollbarWidth: "thin" }} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-6 pb-0">
                <div className="max-w-4xl mx-auto w-full">
                    <ScrollableChatScreen />
                </div>
            </div>
            <div style={{ left: isSidebarOpen ? "300px" : "0px" }} className=" w-full flex justify-center px-4 pb-6 bg-transparent z-10">
                <form className="max-w-4xl w-full bg-card border border-border shadow-md rounded-2xl p-4 flex justify-start items-end gap-2">
                    <div className="flex-1">
                        <textarea className="w-full resize-none outline-none max-h-[200px] overflow-auto leading-relaxed text-base bg-transparent"
                            rows={1}
                            placeholder="Ask anything"
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                            }} />
                    </div>
                    <button
                        type="button"
                        className="bg-primary-foreground rounded-full p-1.5 flex items-center justify-center"
                    >
                        <Mic className="text-white h-6 w-6" />
                    </button>
                    <button
                        type="submit"
                        className="bg-[var(--button)] rounded-full p-1.5 flex items-center justify-center"
                    >
                        <ArrowUp className="text-secondary h-6 w-6" />
                    </button>
                </form>
            </div>
        </div>
        {isCanvasOpen && <div className="aspect-square h-full bg-white"></div>}
    </div >


}