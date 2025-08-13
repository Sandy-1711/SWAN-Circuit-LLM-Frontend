'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import NewDiagramViewer from './NewDiagramViewer';

// Error boundary to catch runtime errors thrown by NewDiagramViewer
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: undefined };
    }
    static getDerivedStateFromError(err) {
        return { hasError: true, errorMsg: err?.message || 'Unknown error' };
    }
    componentDidCatch(_err) { }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full flex items-center justify-center bg-amber-50">
                    <div className="max-w-lg mx-auto border border-amber-200 bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle size={18} />
                            <span className="font-medium">Diagram render failed</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            The diagram component encountered a runtime error while rendering. Check your JSON structure.
                        </p>
                        {this.state.errorMsg && (
                            <pre className="mt-3 text-xs text-gray-500 whitespace-pre-wrap">{this.state.errorMsg}</pre>
                        )}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

/** Extract numeric "position" from SyntaxError message (V8-style). */
function extractPositionFromMessage(msg) {
    // Common patterns: "at position 123", "in JSON at position 123"
    const m = msg.match(/position\s+(\d+)/i);
    return m ? Number(m[1]) : null;
}

function getLineColFromIndex(text, index) {
    let line = 1, col = 1;
    for (let i = 0; i < index && i < text.length; i++) {
        if (text[i] === '\n') {
            line++;
            col = 1;
        } else {
            col++;
        }
    }
    return { line, col };
}



/**
 * Parses JSON (if data is a string) and shows a precise error with line:column on syntax issues.
 * If parsing succeeds, renders NewDiagramViewer. Also guards runtime errors via ErrorBoundary.
 */
export default function SafeDiagramViewer({ data }) {
    if (data == null) {
        return (
            <CenterNotice
                title="Nothing to render"
                detail="No diagram JSON found. Provide valid JSON to preview the diagram."
            />
        );
    }

    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return (
                <ErrorBoundary>
                    <NewDiagramViewer data={parsed} />
                </ErrorBoundary>
            );
        } catch (e) {
            const msg = String(e?.message || 'Invalid JSON');
            const pos = extractPositionFromMessage(msg);
            let lineCol = '';
            if (pos != null) {
                const { line, col } = getLineColFromIndex(data, pos);
                lineCol = ` at line ${line}, column ${col}`;
            }
            return (
                <CenterNotice
                    title="Cannot render diagram"
                    detail={`JSON syntax error${lineCol}. ${msg}`}
                />
            );
        }
    }

    // Data is already an object — render and let ErrorBoundary handle any runtime issues
    return (
        <ErrorBoundary>
            <NewDiagramViewer data={data} />
        </ErrorBoundary>
    );
}

function CenterNotice({ title, detail }) {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="max-w-md mx-auto border bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle size={18} />
                    <span className="font-medium">{title}</span>
                </div>
                {detail && <p className="mt-2 text-sm text-gray-600">{detail}</p>}
            </div>
        </div>
    );
}
