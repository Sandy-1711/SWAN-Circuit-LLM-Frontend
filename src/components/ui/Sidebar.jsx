'use client'
import { AirVent, EditIcon, SearchIcon, SidebarCloseIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ open, setOpen }) {
    const chats = [
        { id: 2, chatName: "Login Page Design Request" },
        { id: 3, chatName: "Redux authSlice example" },
        { id: 4, chatName: "Delete Directory Command" },
        { id: 5, chatName: "Unique answers extraction" },
        { id: 6, chatName: "BLEU Score Analysis" },
        { id: 7, chatName: "LoRs for Top Universities" },
        { id: 8, chatName: "Mostrar concorrente" },
        { id: 9, chatName: "Weight of ASUS TUF" },
        { id: 10, chatName: "Arduino temperature control code" },
        { id: 11, chatName: "NLTK DownloadError Fix" },
        { id: 12, chatName: "CityPulse Full-Stack Design" },
        { id: 13, chatName: "40 LPA Job Roadmap" },
        { id: 14, chatName: "Windows shortcut clarification" },
        { id: 15, chatName: "Confidentiality in Terminal Output" },
        { id: 16, chatName: "Hugging Face 401 Error" },
        { id: 17, chatName: "Dataset loading fix" },
        { id: 18, chatName: "Arduino Nano DHT11 Interface" },
        { id: 19, chatName: "Unsloth SFTTrainer Issue" },
        { id: 20, chatName: "Make her bald request" },
        { id: 21, chatName: "Generate IR String Fix" },
        { id: 22, chatName: "Diagram JSON Format" },
        { id: 23, chatName: "Good Typing Speed" },
        { id: 24, chatName: "Relationship Stages Timeline" },
        { id: 25, chatName: "Next Step in Relationship" },
        { id: 26, chatName: "Kiro Clarification Request" },
        { id: 27, chatName: "Mobile UI Layout" },
        { id: 28, chatName: "Attraction vs Connection" },
        { id: 29, chatName: "Aesthetic Song Suggestions" }
    ];


    return (
        <div style={open ? { width: "280px" } : { width: "40px" }} className=" transition duration-200 relative bg-primary h-screen flex flex-col">
            <div className="flex justify-between items-center px-2 py-2">
                {open ?
                    <div className="group">
                        {/* <SidebarCloseIcon onClick={() => setOpen(!open)} className="w-6 h-6 group-hover:block hidden" /> */}
                        <AirVent className="w-6 h-6 " />
                    </div> :
                    <div className="group">
                        <SidebarCloseIcon onClick={() => setOpen(!open)} className="w-6 h-6 group-hover:block hidden" />
                        <AirVent className="w-6 h-6 group-hover:hidden block" />
                    </div>
                }
                {/* <img className="w-6 h-6" src="swan.png" alt="swan_logo" /> */}
                {open && <SidebarCloseIcon className="cursor-pointer" onClick={() => setOpen(!open)} />}
            </div>
            <div className={`flex flex-col pt-6 px-2 ${open ? "gap-1.5" : "gap-3"}`}>
                <Link
                    href={`/`}
                    className={`text-sm flex ${open ? "justify-start" : "justify-center"} items-center font-medium hover:bg-primary-foreground  ${open && "px-2 py-1"} rounded-lg`}
                >
                    <EditIcon className={` w-6 h-6 p-0.5 ${open ? "mr-1.5" : ""}`} />
                    {open &&
                        <span>
                            New Chat
                        </span>
                    }
                </Link>
                <Link
                    href={`/`}
                    className={`text-sm flex justify-start items-center font-medium hover:bg-primary-foreground ${open && "px-2 py-1"} rounded-lg`}
                >
                    <SearchIcon className={`${open && "mr-1.5"} w-6 h-6 p-0.5`} />
                    {open &&
                        <span>
                            Search Chats
                        </span>
                    }
                </Link>
            </div>
            {open && <div
                className="flex-1 overflow-y-auto py-6 pb-16 px-2"
                style={{ scrollbarWidth: "thin" }}
            >
                <h2 className="text-sm font-medium text-slate-600 mb-2 ml-2">Chat History</h2>
                <div className="flex flex-col gap-1.5">
                    {chats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/${chat.id}`}
                            className="text-sm font-medium hover:bg-primary-foreground py-1.5 px-2.5 rounded-lg"
                        >
                            {chat.chatName.length > 60
                                ? chat.chatName.slice(0, 60) + "..."
                                : chat.chatName}
                        </Link>
                    ))}
                </div>
            </div>}

            {open && <div className="text-sm border-t absolute bottom-0 left-0 bg-accent w-full flex items-center gap-2 p-2">
                <img src="swan.png" className="w-7 h-7 rounded-full" alt="sandeep.png" />
                <h2 className="font-medium">Sandeep Singh</h2>
            </div>}
        </div>
    );
}
