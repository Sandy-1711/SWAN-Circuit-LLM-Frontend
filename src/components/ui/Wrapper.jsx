export default function Wrapper({ className = "", children }) {
    return (
        <div
            className={`
                w-full
                mx-auto
                px-4 sm:px-6 lg:px-8
                max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-7xl
                ${className}
            `}
        >
            {children}
        </div>
    );
}
