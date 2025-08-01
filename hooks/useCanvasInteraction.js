import { useState, useCallback, useRef, useEffect } from 'react';

export default function useCanvasInteraction({
    minZoom = 0.6,
    maxZoom = 2,
    updatedData,
    setUpdatedData,
    containerRef,
    canvasRef
} = {}) {
    // Original pan/zoom state
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(null); // null, 'canvas', or 'component'
    const [start, setStart] = useState({ x: 0, y: 0 });

    // Component dragging state
    const [componentDragged, setComponentDragged] = useState(null);
    const [componentDragOffset, setComponentDragOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false);

    // Refs for dragging
    const draggedElementRef = useRef(null);
    const draggingPosition = useRef(null);

    // Helper function to get mouse position relative to canvas
    const getCanvasMousePosition = useCallback((e) => {
        if (!canvasRef?.current || !containerRef?.current) return { x: 0, y: 0 };

        const containerRect = containerRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - containerRect.left - pan.x) / zoom;
        const canvasY = (e.clientY - containerRect.top - pan.y) / zoom;
        return { x: canvasX, y: canvasY };
    }, [pan, zoom, containerRef, canvasRef]);

    // Handle component mouse down
    const handleComponentMouseDown = useCallback((e, component) => {
        e.stopPropagation();
        // console.log("Component mouse down:", component.id);

        const canvasPos = getCanvasMousePosition(e);

        if (updatedData && updatedData.parts) {
            let componentData = updatedData.parts.find(p => p.id === component.id);

            if (componentData) {
                const componentX = parseFloat(componentData.left) || 0;
                const componentY = parseFloat(componentData.top) || 0;

                setIsDragging("component");
                setComponentDragged(componentData.id);

                const offset = {
                    x: canvasPos.x - componentX,
                    y: canvasPos.y - componentY
                };

                setComponentDragOffset(offset);
                draggedElementRef.current = e.currentTarget;
                setDragStart({ x: componentX, y: componentY });
                setHasDragged(false);
            }
        }
    }, [getCanvasMousePosition, updatedData]);

    // Canvas mouse down (for panning)
    const onMouseDown = useCallback((e) => {
        const target = e.target;
        const canvasPos = getCanvasMousePosition(e);

        // Check if clicking on a component
        const componentElement = target.closest('[data-component-id]');
        if (componentElement) {
            return; // Let component handle its own mouse down
        }

        // Canvas panning
        setIsDragging("canvas");
        setStart({
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        });

        // console.log("Canvas mouse down");
        e.preventDefault();
    }, [pan, getCanvasMousePosition]);

    // Mouse move handler
    const onMouseMove = useCallback((e) => {
        const canvasPos = getCanvasMousePosition(e);

        if (isDragging === "canvas") {
            setPan({
                x: e.clientX - start.x,
                y: e.clientY - start.y,
            });
        } else if (isDragging === "component" && componentDragged) {
            setHasDragged(true);

            const newX = canvasPos.x - componentDragOffset.x;
            const newY = canvasPos.y - componentDragOffset.y;

            draggingPosition.current = { x: newX, y: newY };

            if (draggedElementRef.current) {
                draggedElementRef.current.style.left = `${newX}px`;
                draggedElementRef.current.style.top = `${newY}px`;
                draggedElementRef.current.style.transform = '';
            }
        }
    }, [isDragging, start, componentDragged, componentDragOffset, getCanvasMousePosition, zoom, pan]);

    // Mouse up handler
    const onMouseUp = useCallback(() => {
        // console.log("Mouse up, isDragging:", isDragging);

        if (isDragging === "component" && componentDragged && draggingPosition.current) {
            const { x, y } = draggingPosition.current;

            // Update the data with new component position
            if (setUpdatedData && updatedData) {
                setUpdatedData(prev => ({
                    ...prev,
                    parts: prev.parts.map(part =>
                        part.id === componentDragged
                            ? { ...part, left: x, top: y }
                            : part
                    )
                }));
            }

            // console.log(`Updated component ${componentDragged} position to:`, { x, y });

            // Reset visual transform
            if (draggedElementRef.current) {
                draggedElementRef.current.style.transform = '';
            }
        }

        // Reset all dragging state
        setIsDragging(null);
        setComponentDragged(null);
        setComponentDragOffset({ x: 0, y: 0 });
        setHasDragged(false);
        draggedElementRef.current = null;
        draggingPosition.current = null;
    }, [isDragging, componentDragged, setUpdatedData, updatedData]);

    // Wheel handler for zooming
    const onWheel = useCallback((e) => {
        // e.preventDefault();
        if (containerRef?.current?.contains(e.target)) {
            e.preventDefault();
        }
        
        if (!containerRef?.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * delta));
        const zoomFactor = newZoom / zoom;

        setPan({
            x: mouseX - (mouseX - pan.x) * zoomFactor,
            y: mouseY - (mouseY - pan.y) * zoomFactor,
        });
        setZoom(newZoom);
    }, [zoom, minZoom, maxZoom, pan, containerRef]);

    // Add event listeners
    useEffect(() => {
        const container = containerRef?.current;

        if (container) {
            container.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            container.addEventListener('wheel', onWheel, { passive: false });

            return () => {
                container.removeEventListener('mousedown', onMouseDown);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                container.removeEventListener('wheel', onWheel);
            };
        }
    }, [onMouseDown, onMouseMove, onMouseUp, onWheel, containerRef]);

    // Get component style with proper positioning
    const getComponentStyle = useCallback((component) => {
        const baseStyle = {
            position: 'absolute',
            left: `${(component.left || 0) * zoom + pan.x}px`,
            top: `${(component.top || 0) * zoom + pan.y}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            cursor: isDragging === "component" ? 'grabbing' : 'grab',
            zIndex: componentDragged === component.id ? 1000 : 1,
        };

        return baseStyle;
    }, [zoom, pan, isDragging, componentDragged]);

    return {
        // Original properties
        pan,
        zoom,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onWheel,

        // Component dragging properties
        handleComponentMouseDown,
        isDragging,
        componentDragged,
        hasDragged,
        getComponentStyle,

        // Utility functions
        getCanvasMousePosition,
    };
}