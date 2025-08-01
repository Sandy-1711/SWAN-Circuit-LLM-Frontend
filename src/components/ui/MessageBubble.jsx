import MonacoEditor from "@monaco-editor/react";
import NewDiagramViewer from "../NewDiagramViewer";
import { useContext, useMemo, useState } from "react";
import { Fullscreen, Loader2 } from "lucide-react";
import FullCodeContext from "../../../contexts/useFullCodeDiagramContext";

export default function MessageBubble({ message, currentStatus, isLatest, tempMessageStreamingId }) {
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

    const { setCode, setOutput, setOpen } = useContext(FullCodeContext);

    if (message?.role === "user") {
        return (
            <div className="my-4 flex justify-end">
                <div className="max-w-[80%] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">
                    {message?.message}
                </div>
            </div>
        );
    }

    // Assistant message
    const isStreaming = message?.streaming;
    const hasCode = message?.code && message.code.length > 0;
    const hasOutput = message?.output && Object.keys(message.output).length > 0;
    const model = message?.model;
    return (
        <div className="my-6 flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-800 max-w-[80%] whitespace-pre-line">
                    {message?.message}
                </p>
                {isStreaming && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                )}
            </div>

            {(hasCode || hasOutput || isStreaming) && (
                <div className="max-w-full w-full md:w-full bg-white pt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex gap-2 items-center justify-between p-2">
                        <div className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md">
                            {model === "baseline" ? "Baseline 📉" : model === "chained" ? "Chained 📊" : "Rag 📈"}
                        </div>
                        <div className="flex gao-2 items-center ">
                            <button
                                className="bg-gray-700 text-white px-2 py-1 text-xs rounded hover:bg-gray-600 disabled:opacity-50"
                                onClick={() => navigator.clipboard.writeText(message?.code || "")}
                                disabled={!hasCode}
                            >
                                Copy C++
                            </button>
                            <button
                                className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(message?.output, null, 2))}
                                disabled={!hasOutput}
                            >
                                Copy JSON
                            </button>
                            <button
                                className="cursor-pointer hover:bg-[var(--primary)] p-0.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => {
                                    setCode(message?.code || "");
                                    setOutput(message?.output || {});
                                    setOpen(true);
                                }}
                                disabled={!hasCode && !hasOutput}
                            >
                                <Fullscreen className="text-[var(--button)]" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-2 gap-0">
                        {/* Code Editor */}
                        <div className="relative bg-[#1e1e1e] overflow-hidden shadow-md">
                            {/* {isStreaming && !hasCode ? (
                                <div className="h-[60vh] flex items-center justify-center">
                                    <div className="text-white flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating code...</span>
                                    </div>
                                </div>
                            ) : ( */}
                            <MonacoEditor
                                height="60vh"
                                options={{ ...editorOptions, lineNumbers: "off" }}
                                defaultLanguage="cpp"
                                theme="vs-dark"
                                value={((currentStatus === "code_progress") && isLatest) ? temporaryCodeHolder : message?.code}
                            />
                            {/* )} */}
                        </div>

                        {/* Diagram Viewer */}
                        <div className="relative border">
                            {isStreaming && !hasOutput ? (
                                <div className="h-[60vh] flex items-center justify-center">
                                    <div className="text-gray-600 flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating circuit...</span>
                                    </div>
                                </div>
                            ) : hasOutput ? (
                                <NewDiagramViewer data={message?.output} />
                            ) : (
                                <div className="h-[60vh] flex items-center justify-center">
                                    <div className="text-gray-400">
                                        Circuit diagram will appear here
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}