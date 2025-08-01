'use client'
import { useContext, useEffect, useMemo, useState } from "react";
import FullCodeContext from "../../contexts/useFullCodeDiagramContext";
import { ExternalLink } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";
import NewDiagramViewer from "./NewDiagramViewer";

export default function FullCodeDiagramView() {
    const { open, setOpen, code, setCode, output, setOutput } = useContext(FullCodeContext);
    const [animate, setAnimate] = useState(false);
    const [activeTab, setActiveTab] = useState("diagram");
    const editorOptions = useMemo(() => ({
        minimap: { enabled: false },
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        readOnly: true,
        fontSize: 14,
    }), []);

    useEffect(() => {
        if (open) {
            // Start animation on next frame
            requestAnimationFrame(() => setAnimate(true));
        } else {
            setAnimate(false);
        }
    }, [open]);

    if (!open && !animate) return null; // Fully hidden

    return (
        <div
            className={`
                fixed left-1/2 top-1/2 z-50 bg-white rounded-xl shadow-xl
                transform -translate-x-1/2 -translate-y-1/2
                transition-all duration-700 ease-in-out
                ${animate ? "w-screen h-screen opacity-100" : "w-[80%] h-[60vh] opacity-0"}
            `}
        >
            <div className="flex border-b bg-gray-100">
                <button
                    className={`px-4 py-2 font-medium transition-all ${activeTab === "diagram"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-black"
                        }`}
                    onClick={() => setActiveTab("diagram")}
                >
                    Diagram View
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-all ${activeTab === "code"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-black"
                        }`}
                    onClick={() => setActiveTab("code")}
                >
                    JSON Code
                </button>
            </div>
            <button
                onClick={() => setOpen(false)}
                className="absolute top-4 z-50 right-4 text-gray-600 hover:text-black"
            >
                <ExternalLink />
            </button>

            <div className="grid grid-cols-1 w-full h-full md:grid-cols-2 p-0 gap-0">
                {/* Code Editor */}
                <div className="relative bg-[#1e1e1e] overflow-hidden shadow-md">
                    <MonacoEditor
                        height="100%"
                        options={{ ...editorOptions, lineNumbers: "off" }}
                        defaultLanguage="cpp"
                        theme="vs-dark"
                        defaultValue={code}
                    />

                </div>

                {/* Diagram Viewer */}
                <div className="relative border ">
                    <NewDiagramViewer data={output} />
                </div>

                {/* <div>
                    <MonacoEditor
                        height="100%"
                        options={{ ...editorOptions, lineNumbers: "off" }}
                        defaultLanguage="json"
                        theme="vs-dark"
                        defaultValue={output}
                    />
                </div> */}
            </div>
        </div>
    );
}
