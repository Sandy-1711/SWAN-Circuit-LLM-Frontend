'use client';
import "@wokwi/elements";
import "@/components";
import React, { useEffect, useRef } from 'react';
import { coordinates } from "../../coordinates";
import isComponent from "@/utils/isComponent";
import extractPinsForComponent from "@/utils/extractPinsForComponent";
import useCanvasInteraction from "../../hooks/useCanvasInteraction";
import useD3Layout from "../../hooks/useD3Layout";

export default function NewDiagramViewer({ data }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const { updatedData, setUpdatedData } = useD3Layout(data); // mutates `data.parts` to add top/left
    
    const {
        pan,
        zoom,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onWheel,
        handleComponentMouseDown // Add this line
    } = useCanvasInteraction({ updatedData, setUpdatedData, containerRef, canvasRef });

    
    // Generate bezier path for connections
    const generateBezierPath = (start, end, isBreadboard = false) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        // Easing factor (0 < factor < 1), smaller value = more easing near start
        const easeFactor = 0;

        if (isBreadboard) {
            const controlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * easeFactor + 30;
            const cp1x = start.x + (dx > 0 ? controlOffset : -controlOffset);
            const cp1y = start.y + dy * easeFactor;
            const cp2x = start.x + (dx > 0 ? controlOffset * 1.5 : -controlOffset * 1.5);
            const cp2y = start.y + dy * 0.8;

            return `M ${start.x},${start.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}`;
        }

        // Regular (non-breadboard) ease-in curve
        const controlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * easeFactor + 50;
        const cp1x = start.x + (dx > 0 ? controlOffset : -controlOffset);
        const cp1y = start.y + dy * easeFactor;
        const cp2x = start.x + (dx > 0 ? controlOffset * 1.5 : -controlOffset * 1.5);
        const cp2y = start.y + dy * 0.8;

        return `M ${start.x},${start.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}`;
    };

    // Generate connections/wires
    const generateConnections = (updatedData) => {
        if (!updatedData?.connections || !updatedData?.parts) {
            return [];
        }

        const connections = [];
        const elementCoordinates = coordinates;

        updatedData.connections.forEach((connection, index) => {
            const [source, destination, color, segments] = connection;

            // Parse source
            const sourceId = source.split(":")[0];
            const sourcePort = source.split(":")[1];
            const sourceComponent = updatedData.parts.find(p => p.id === sourceId);

            if (!sourceComponent) {
                console.warn(`Source component ${sourceId} not found`);
                return;
            }

            // Parse destination
            const destinationId = destination.split(":")[0];
            const destinationPort = destination.split(":")[1];
            const destinationComponent = updatedData.parts.find(p => p.id === destinationId);

            if (!destinationComponent) {
                console.warn(`Destination component ${destinationId} not found`);
                return;
            }

            // Get source pin coordinates
            const sourceComponentName = sourceComponent.type;
            const sourceComponentCoordinateDetails = elementCoordinates.find(c => c.componentName === sourceComponentName);
            const isSourceCustomComponent = isComponent(sourceComponentName) === false;

            let sourcePins = sourceComponentCoordinateDetails?.pins;
            if (isSourceCustomComponent) {
                const extractedPins = extractPinsForComponent(sourceId, data.connections);
                sourcePins = extractedPins.map((pin) => ({
                    name: pin.name,
                    x: pin.x,
                    y: pin.y,
                    signals: pin.signals || [],
                }));
            }

            if (!sourcePins) {
                console.warn(`No pins found for source component ${sourceComponentName}`);
                return;
            }

            const sourcePinCoordinate = sourcePins.find(p => p.name === sourcePort);
            if (!sourcePinCoordinate) {
                console.warn(`No pin coordinate found for ${sourcePort} in ${sourceComponentName}`);
                return;
            }

            // Get destination pin coordinates
            const destinationComponentName = destinationComponent.type;
            const destinationComponentCoordinateDetails = elementCoordinates.find(c => c.componentName === destinationComponentName);
            const isDestinationCustomComponent = isComponent(destinationComponentName) === false;

            let destinationPins = destinationComponentCoordinateDetails?.pins;
            if (isDestinationCustomComponent) {
                const extractedPins = extractPinsForComponent(destinationId, data.connections);
                destinationPins = extractedPins.map((pin) => ({
                    name: pin.name,
                    x: pin.x,
                    y: pin.y,
                    signals: pin.signals || [],
                }));
            }

            if (!destinationPins) {
                console.warn(`No pins found for destination component ${destinationComponentName}`);
                return;
            }

            const destinationPinCoordinate = destinationPins.find(p => p.name === destinationPort);
            if (!destinationPinCoordinate) {
                console.warn(`No pin coordinate found for ${destinationPort} in ${destinationComponentName}`);
                return;
            }

            // Calculate actual coordinates
            const startX = (parseInt(sourceComponent.left) || 0) + sourcePinCoordinate.x;
            const startY = (parseInt(sourceComponent.top) || 0) + sourcePinCoordinate.y;
            const endX = (parseInt(destinationComponent.left) || 0) + destinationPinCoordinate.x;
            const endY = (parseInt(destinationComponent.top) || 0) + destinationPinCoordinate.y;

            // Determine connection color and type
            let fillColor = color || "#ff0000";
            const isBreadboardConnection = segments && segments.includes("$bb");

            if (isBreadboardConnection) {
                fillColor = "cyan";
            }

            // Special case for breadboard connections with no movement (v0)
            if (isBreadboardConnection && segments && segments.includes("v0")) {
                connections.push({
                    type: 'circle',
                    key: `connection-${index}`,
                    x: startX,
                    y: startY,
                    color: fillColor
                });
                return;
            }

            // Generate bezier path
            const pathData = generateBezierPath(
                { x: startX, y: startY },
                { x: endX, y: endY },
                isBreadboardConnection
            );

            connections.push({
                type: 'path',
                key: `connection-${index}`,
                path: pathData,
                color: fillColor,
                start: { x: startX, y: startY },
                end: { x: endX, y: endY }
            });
        });

        return connections;
    };

    const connections = generateConnections(updatedData);

    return (
        <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onWheel={(e) => onWheel(e, containerRef.current)}
            className="w-full h-full overflow-hidden select-none relative"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(100, 100, 100, 0.3) 1px, transparent 1px)`,
                backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
                backgroundPosition: `${pan.x % (30 * zoom)}px ${pan.y % (30 * zoom)}px`,
                cursor: 'grab'
            }}
        >
            <div
                id="draggableContainer"
                ref={canvasRef}
                className="absolute inset-0"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
            >
                {updatedData?.parts?.map((part) => {
                    const isC = isComponent(part.type)
                    let Component
                    if (isC) {
                        Component = part.type;
                    }
                    else {
                        Component = "wokwi-default"
                    }
                    const id = part.id;
                    const style = {
                        position: "absolute",
                        left: `${parseInt(part.left) || 0}px`,
                        top: `${parseInt(part.top) || 0}px`,
                        transform: part.rotate ? `rotate(${part.rotate}deg)` : undefined,
                        transformOrigin: 'top left',
                        zIndex: Component === "wokwi-breadboard" ? 5 : 10,
                        cursor: 'grab' // Add cursor style for draggable components
                    };
                    let pins = coordinates.find(c => c.componentName === Component)?.pins;
                    if (!isC) {
                        pins = extractPinsForComponent(part.id, data.connections)
                    }
                    return (
                        <div
                            key={part.id}
                            id={part.id}
                            style={style}
                            data-component-id={part.id}
                            onMouseDown={(e) => handleComponentMouseDown(e, part)} // Add this line
                        >
                            <Component color={"black"} name={!isC ? part.type : undefined} {...part.attrs} />
                        </div>
                    );
                })}

                {/* Wires/Connections */}
                {connections.length > 0 && (
                    <svg
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    >
                        <g>
                            {connections.map((connection) => {
                                if (connection.type === 'circle') {
                                    const radius = 2;
                                    return (
                                        <g key={connection.key}>
                                            <circle
                                                cx={connection.x}
                                                cy={connection.y}
                                                r={radius}
                                                fill={connection.color}
                                                stroke={connection.color}
                                                strokeWidth="1"
                                            />
                                        </g>
                                    );
                                }

                                if (connection.type === 'path') {
                                    return (
                                        <g key={connection.key}>
                                            {/* Shadow/outline */}
                                            <path
                                                d={connection.path}
                                                stroke="rgba(0,0,0,0.1)"
                                                strokeWidth="5"
                                                fill="none"
                                                transform="translate(2,2)"
                                            />
                                            {/* Main path */}
                                            <path
                                                d={connection.path}
                                                stroke={connection.color}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            {/* Connection points */}
                                            <circle cx={connection.start.x} cy={connection.start.y} r="3" fill={connection.color} />
                                            <circle cx={connection.end.x} cy={connection.end.y} r="3" fill={connection.color} />
                                        </g>
                                    );
                                }

                                return null;
                            })}
                        </g>
                    </svg>
                )}
            </div>
        </div>
    );
}