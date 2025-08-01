export default function extractPinsForComponent(componentId, connections) {
    const pins = [];
    const addedPins = new Set();

    const pinSpacing = 20;
    const pinOffset = 20;

    for (const [source, destination] of connections) {
        const [srcComponent, srcPin] = source.split(':');
        const [destComponent, destPin] = destination.split(':');

        if (srcComponent === componentId && !addedPins.has(srcPin)) {
            pins.push({
                name: srcPin,
                x: pins.length * pinSpacing + pinOffset,
                y: pinOffset,
                signals: [null],
            });
            addedPins.add(srcPin);
        }

        if (destComponent === componentId && !addedPins.has(destPin)) {
            pins.push({
                name: destPin,
                x: pins.length * pinSpacing + pinOffset,
                y: pinOffset,
                signals: [null],
            });
            addedPins.add(destPin);
        }
    }

    return pins;
}
