import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function useD3Layout(data) {
    const [layoutedData, setLayoutedData] = useState(null);

    useEffect(() => {
        if (!data?.parts || !data?.connections) return;

        const partMap = new Map(data.parts.map(part => [part.id, part]));

        const nodes = data.parts.map(part => ({
            id: part.id,
            type: part.type,
            attrs: part.attrs || {},
        }));

        const links = data.connections
            .map(([src, dst]) => ({
                sourceId: src.split(':')[0],
                targetId: dst.split(':')[0]
            }))
            .filter(({ sourceId, targetId }) =>
                partMap.has(sourceId) && partMap.has(targetId)
            )
            .map(({ sourceId, targetId }) => ({
                source: sourceId,
                target: targetId
            }));

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(200))
            .force('charge', d3.forceManyBody().strength(-800))
            .force('center', d3.forceCenter(600, 350))
            .force('collision', d3.forceCollide().radius(140))
            .stop();

        for (let i = 0; i < 300; i++) simulation.tick();

        const updatedParts = data.parts
            .map(part => {
                const match = nodes.find(n => n.id === part.id);
                if (!match) return null; // skip if no match
                return {
                    ...part,
                    top: match.y,
                    left: match.x
                };
            })
            .filter(Boolean); // remove nulls

        setLayoutedData({
            ...data,
            parts: updatedParts
        });
    }, [data]);


    return { updatedData: layoutedData, setUpdatedData: setLayoutedData };
}

