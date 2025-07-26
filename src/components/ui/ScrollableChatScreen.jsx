'use client'
import { useEffect, useRef } from 'react';

const mockMessages = [
    { id: 1, role: 'user', content: 'What is the capital of France?' },
    { id: 2, role: 'assistant', content: 'The capital of France is Paris.' },
    { id: 3, role: 'user', content: 'What is the population of India?' },
    { id: 4, role: 'assistant', content: 'As of 2023, India has a population of over 1.4 billion people.' },
    { id: 5, role: 'user', content: 'Explain black holes in simple terms.' },
    { id: 6, role: 'assistant', content: 'A black hole is a region in space where gravity is so strong that nothing—not even light—can escape from it.' },
    { id: 7, role: 'user', content: 'What is the capital of France?' },
    { id: 8, role: 'assistant', content: 'The capital of France is Paris.' },
    { id: 9, role: 'user', content: 'What is the population of India?' },
    { id: 10, role: 'assistant', content: 'As of 2023, India has a population of over 1.4 billion people.' },
    { id: 11, role: 'user', content: 'Explain black holes in simple terms.' },
    { id: 12, role: 'assistant', content: 'A black hole is a region in space where gravity is so strong that nothing—not even light—can escape from it.' },
    { id: 13, role: 'assistant', content: 'As of 2023, India has a population of over 1.4 billion people.' },
    { id: 14, role: 'user', content: 'Explain black holes in simple terms.' },
    { id: 15, role: 'assistant', content: 'A black hole is a region in space where gravity is so strong that nothing—not even light—can escape from it.' },
    { id: 16, role: 'assistant', content: 'As of 2023, India has a population of over 1.4 billion people.' },
    { id: 17, role: 'user', content: 'Explain black holes in simple terms.' },
    { id: 18, role: 'assistant', content: 'A black hole is a region in space where gravity is so strong that nothing—not even light—can escape from it.' }
];

export default function ScrollableChatScreen() {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mockMessages.length]);

    return (
        <div className="flex flex-col pb-20 gap-4">
            {mockMessages.map((msg) => (
                <div
                    key={msg.id}
                    className={`px-4 py-3 rounded-xl text-sm whitespace-pre-wrap w-fit max-w-[90%] ${msg.role === 'user'
                        ? 'self-end bg-primary-foreground text-white'
                        : 'self-start bg-muted text-black'
                        }`}
                >
                    {msg.content}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
