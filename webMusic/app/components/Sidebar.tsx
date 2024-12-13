import { NavLink } from "@remix-run/react";
import { PiMicrophoneStageFill, PiPlaylistBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa6";
import { GiCompactDisc } from "react-icons/gi";

export default function Sidebar() {


    return (
        <div className="w-64 h-full bg-gray-800 p-2 fixed left-0 top-0 z-100">
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
                        <div className="space-between ">
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
                        <div className="space-between ">
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
                        <div className="space-between ">
                            <NavLink
                                to="/search"
                                className={({ isActive }) =>
                                    `flex items-center gap-x-3 w-full p-3 rounded transition-colors ${isActive ? "bg-[#7600be]" : "hover:bg-gray-700"
                                    }`
                                }
                            >
                                <FaEye className="text-xl" />
                                Search
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <div className="space-between ">
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