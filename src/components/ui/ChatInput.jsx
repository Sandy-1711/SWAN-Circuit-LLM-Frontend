import { useState } from "react";
import { ArrowUp, LucideSettings2, Mic } from "lucide-react";
import Wrapper from "./Wrapper";
import { useEffect, useRef } from "react";
import Loader from "./loader";

export default function ChatInput({ onSubmit, modelType, setModelType }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!input.trim()) return;
        await onSubmit(input.trim());
        setLoading(false);
        setInput("");
    };
    const [open, setOpen] = useState(false);
    const parentRef = useRef(null);


    function ChangeModelDialog() {
        const dialogRef = useRef(null);

        useEffect(() => {
            if (!open) return;

            function handleClickOutside(event) {
                const clickedOutsideDialog = dialogRef.current && !dialogRef.current.contains(event.target);
                const clickedOutsideParent = parentRef?.current && !parentRef.current.contains(event.target);

                if (clickedOutsideDialog && clickedOutsideParent) {
                    setOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [open, setOpen, parentRef]);

        const options = [
            { label: "Rag 📈", value: "rag" },
            { label: "Chained 📊", value: "chained" },
            { label: "Baseline 📉", value: "baseline" },
        ];

        return (
            <div
                ref={dialogRef}
                style={{ display: open ? "flex" : "none" }}
                className="p-3 min-w-[150px] cursor-auto bg-white  flex flex-col justify-start items-center gap-1.5 rounded-2xl absolute bottom-12 shadow-lg translate-x-1/2 right-1/2"
            >
                {options.map((opt, index) => (
                    <div
                        key={index}
                        onClick={() => { setModelType(opt.value); setOpen(false); }}
                        className={`text-base ${modelType !== opt.value && "hover:bg-primary"} p-1 font-medium rounded px-2 cursor-pointer w-full text-left text-[var(--text)] ${modelType === opt.value ? "bg-[var(--primary-foreground)]" : " bg-white"} `}
                    >
                        {opt.label}
                    </div>
                ))
                }
            </div >
        );
    }



    return (
        <Wrapper>
            <form onSubmit={handleSubmit} className="w-full relative mx-auto bg-card border border-border shadow-md rounded-2xl p-4 px-6 flex justify-start items-end gap-2">
                <div className="flex-1">
                    <textarea className="w-full resize-none outline-none max-h-[200px] overflow-auto leading-relaxed text-base bg-transparent"
                        rows={1}
                        placeholder="Ask anything"
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                        }}
                        onChange={(e) => setInput(e.target.value)}
                    />

                </div>
                <button ref={parentRef} onClick={() => setOpen(!open)} type="button" className="bg-primary relative cursor-pointer rounded-full py-2 p-1.5 px-3 flex items-center gap-2 justify-center">
                    <ChangeModelDialog />
                    <LucideSettings2 className="text-[var(--text)] h-5 w-5" />
                    <p className="text-sm text-[var(--text)]">
                        {modelType === "rag" ? "Rag" : modelType === "chained" ? "Chained" : "Baseline"}
                    </p>
                </button>
                <button
                    type="button"
                    className="bg-primary-foreground rounded-full p-1.5 flex cursor-pointer items-center justify-center"
                >
                    <Mic className="text-white h-6 w-6" />
                </button>
                <button
                    type="submit"
                    className="cursor-pointer bg-[var(--button)] rounded-full p-1.5 flex items-center justify-center"
                >
                    {loading ? <Loader />
                        :
                        <ArrowUp className="text-secondary h-6 w-6" />
                    }
                </button>
            </form>
        </Wrapper>
    );
}

