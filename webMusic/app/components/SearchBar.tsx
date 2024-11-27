interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="w-full max-w-lg mx-auto m-8">
            <input
                type="text"
                placeholder="Find an artist"
                className="w-full p-3 rounded-lg border-2 border-[#7600be] backdrop-blur-sm bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7600be]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}