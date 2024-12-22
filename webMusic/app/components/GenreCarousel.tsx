import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Genre } from '../types';

interface GenreCarouselProps {
    genres: Genre[];
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({ genres }) => {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);

    const scroll = (direction: 'left' | 'right'): void => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
            <h2 className="text-white text-3xl font-semibold text-center mb-6">Genres</h2>

            <div className="relative flex items-center max-w-[1400px] mx-auto">
                <button
                    onClick={() => scroll('left')}
                    className="flex-none z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 mr-2"
                    aria-label="Scroll left"
                >
                    <FaChevronLeft size={24} />
                </button>

                <div
                    ref={scrollRef}
                    className="w-full overflow-hidden"
                >
                    <div className="flex gap-4 w-max">
                        {genres.map((genre) => (
                            <div
                                key={genre.id}
                                className="w-[200px] flex-none text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-40 h-40">
                                    <img
                                        className="w-full h-full object-cover rounded-lg border-2 border-opacity-40 border-white mb-2"
                                        src={genre.picture}
                                        alt={genre.name}
                                    />
                                </div>
                                <p className="font-bold whitespace-nowrap mt-2">{genre.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="flex-none z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 ml-2"
                    aria-label="Scroll right"
                >
                    <FaChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default GenreCarousel;