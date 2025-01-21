import { NavLink } from "@remix-run/react";
import { PiMicrophoneStageFill, PiPlaylistBold } from "react-icons/pi";
import { GiCompactDisc } from "react-icons/gi";
import { IoAlbumsOutline, IoPersonOutline } from "react-icons/io5";
import { useState } from "react";





export default function Sidebar() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };


    return (
        <div className="w-64 h-full bg-transparent p-2 fixed left-0 top-0 z-100 rounded-tr-3xl mr-4 border-purple-500/50 mt-">
            <div className="flex justify-center mb-2">
                <img
                    className="w-45 h-25 rounded-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    src="../assets/logo.png"
                    alt="Logo"
                />
            </div>
            <nav>
                <ul className="text-white space-y-4">
                    <li>
                        <div className="space-between">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center gap-x-3 w-full p-3 rounded transition-colors ${isActive ? "bg-[#7600be]" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                <GiCompactDisc className="text-xl" />
                                Home
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <div className="space-between">
                            <NavLink
                                to="/artists"
                                className={({ isActive }) =>
                                    `flex items-center gap-x-3 w-full p-3 rounded transition-colors ${isActive ? "bg-[#7600be]" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                <PiMicrophoneStageFill className="text-xl" />
                                Artists
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <div className="space-between">
                            <NavLink
                                to="/albums"
                                className={({ isActive }) =>
                                    `flex items-center gap-x-3 w-full p-3 rounded transition-colors ${isActive ? "bg-[#7600be]" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                <IoAlbumsOutline className="text-xl" />
                                Albums
                            </NavLink>
                        </div>
                    </li>

                    <li>
                        <div className="space-between">
                            <NavLink
                                to="/playlists"
                                className={({ isActive }) =>
                                    `flex items-center gap-x-3 w-full p-3 rounded transition-colors ${isActive ? "bg-[#7600be]" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                <PiPlaylistBold className="text-xl" />
                                Playlists
                            </NavLink>
                        </div>
                    </li>
                </ul>

            </nav>
        </div>
    );
}