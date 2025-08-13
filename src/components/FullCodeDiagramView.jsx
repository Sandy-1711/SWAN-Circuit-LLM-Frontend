'use client'
import { useContext, useEffect, useMemo, useState, useRef, useCallback } from "react";
import FullCodeContext from "../../contexts/useFullCodeDiagramContext";
import { ExternalLink, Save } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import NewDiagramViewer from "./NewDiagramViewer";
import SafeDiagramViewer from "./SafeDiagramViewer";
import { useAxios } from "../../hooks/useAxios";

export default function FullCodeDiagramView({ }) {
    const { open, setOpen, code, setCode, output, setOutput, prompt, setPrompt, msgId, setMsgId } = useContext(FullCodeContext);
    const [animate, setAnimate] = useState(false);
    const [currentField, setCurrentField] = useState('code');
    const [isLoading, setIsLoading] = useState(false);
    const editorRef = useRef(null);
    const timeoutRef = useRef(null);
    const axios = useAxios();

    const editorOptions = useMemo(() => ({
        minimap: { enabled: false },
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        selectOnLineNumbers: true,
        roundedSelection: false,
        cursorStyle: 'line',
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

    // Update editor content when field changes or context data changes
    useEffect(() => {
        if (!editorRef.current) return;

        let content = '';

        if (currentField === 'code') {
            content = code || '';
        } else if (currentField === 'output') {
            if (output && typeof output === 'object') {
                content = JSON.stringify(output, null, 2);
            } else {
                content = output || '';
            }
        }

        // Only update if content actually changed
        if (editorRef.current.getValue() !== content) {
            const pos = editorRef.current.getPosition();
            editorRef.current.setValue(content);
            if (pos) editorRef.current.setPosition(pos);
        }
    }, [currentField, code, output]);

    // Debounced editor change handler
    const handleEditorChange = useCallback((value) => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Debounce the update
        timeoutRef.current = setTimeout(() => {
            if (currentField === 'code') {
                setCode(value || '');
            } else if (currentField === 'output') {
                try {
                    // Try to parse as JSON if it's the output field
                    const parsed = JSON.parse(value || '{}');
                    setOutput(parsed);
                } catch (e) {
                    // If JSON is invalid, store as string
                    setOutput(value || '');
                }
            }
        }, 300); // 300ms debounce
    }, [currentField, setCode, setOutput]);

    // Function to handle updating the backend
    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put('/user/feedback', {
                code, output, prompt, msgId
            });

            if (response.status === "ok") {
                console.log('Successfully updated backend');
                setCode('');
                setMsgId(undefined);
                setOutput(null);
                setPrompt("");
                setOpen(false);
            } else {
                console.error('Failed to update backend');
            }
        } catch (error) {
            console.error('Error updating backend:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get current editor language based on active field
    const language = useMemo(() => {
        if (currentField === 'output') return 'json';
        if (currentField === 'code') return 'cpp';
        return 'plaintext';
    }, [currentField]);

    const handleFieldChange = useCallback((field) => {
        setCurrentField(field);
    }, []);

    const handleEditorDidMount = useCallback((editor) => {
        editorRef.current = editor;
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!open && !animate) return null; // Fully hidden

    return (
        <div
            className={`
                fixed left-1/2 top-1/2 z-50 bg-white rounded-xl shadow-xl
                transform -translate-x-1/2 -translate-y-1/2
                transition-all duration-700 ease-in-out
                flex flex-col
                ${animate ? "w-screen h-screen opacity-100" : "w-[80%] h-[60vh] opacity-0"}
            `}
        >
            {/* Header with update button */}
            <div className="flex justify-between items-center border-b bg-gray-100">
                <div className="flex items-center">
                    <h2 className="px-4 py-2 font-medium text-gray-700">Code Diagram Editor</h2>
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={() => setOpen(false)}
                className="absolute top-4 z-50 right-4 text-gray-600 hover:text-black transition-colors"
            >
                <ExternalLink size={20} />
            </button>

            {/* Content area - Split layout */}
            <div className="flex w-full flex-1   overflow-hidden">
                {/* Left side - Single Monaco Editor with field switching */}
                <div className="w-1/3 flex flex-col border-r">
                    {/* Field switcher header (like tabs but styled like your reference) */}
                    <div className="bg-[#1e1e1e] border-b border-gray-600 justify-between items-center flex p-2 gap-2">
                        <div className="flex items-center gap-2">
                            {['code', 'output'].map((field) => (
                                <button
                                    key={field}
                                    onClick={() => handleFieldChange(field)}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${field === currentField
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {field === 'code' ? 'Code Editor' : 'JSON Output'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className={`
                                px-3 py-1 text-sm rounded transition-all flex items-center gap-1
                            ${isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }
                        `}
                        >
                            <Save size={14} />
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>

                    {/* Single Monaco Editor that changes content based on current field */}
                    <div className="flex-1 min-h-0">
                        <Editor
                            ref={editorRef}
                            theme="vs-dark"
                            onMount={handleEditorDidMount}
                            language={language}
                            onChange={handleEditorChange}
                            options={editorOptions}
                            loading={<div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>}
                        />
                    </div>
                </div>

                {/* Right side - Diagram Viewer */}
                <div className="flex-1 bg-white">
                    <div className="h-full">
                        {/* <NewDiagramViewer data={output} /> */}
                        <SafeDiagramViewer data={output} />

                    </div>
                </div>
            </div>
        </div>
    );
}