import { useState } from "react";
import { Form } from "@remix-run/react";
import { PlaylistPerso } from "~/types";
import { addTrack } from "~/lib/Playlist";

interface AddMenuProps {
    playlists: PlaylistPerso[];
    idTrackDeezer: string;
    onClose: () => void;
}

const AddMenu: React.FC<AddMenuProps> = ({ playlists, idTrackDeezer, onClose }) => {
    const [showModal, setShowModal] = useState(true);

    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [error, setError] = useState<string | null>(null);


    // Ferme la modale
    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPlaylist) {
            setError("Please select a playlist");
            return;
        }

        try {

            //console.log("plazylistId", selectedPlaylist, "IdTrackDeezer", idTrackDeezer)
            const idTrackString = idTrackDeezer.toString();
            const response = await addTrack(selectedPlaylist, idTrackString);

            if (!response) {
                setError(error || "An error occurred");
            }

            console.log("Track added successfully:", response?.message);
            closeModal();
            onClose();
        } catch (err) {
            setError(error || "An error occurred");
        }
    };

    return (
        <div>

            {/* Affiche la modale uniquement si `showModal` est `true` */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-white mb-6">Select a playlist</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="playlistId" className="block text-sm font-medium text-gray-300 mb-2">
                                    Playlists
                                </label>

                                {playlists.length > 0 ? (
                                    playlists.map((playlist) => (
                                        <div key={playlist.idPlaylist} className="mt-2">
                                            <input
                                                type="radio"
                                                id={playlist.idPlaylist}
                                                name="playlistId"
                                                value={playlist.idPlaylist}
                                                className="mr-2"
                                                onChange={() => setSelectedPlaylist(playlist.idPlaylist)}
                                            />
                                            <label
                                                htmlFor={playlist.idPlaylist}
                                                className="text-sm font-medium text-gray-200"
                                            >
                                                {playlist.title}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No playlists found</p>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg w-full"
                            >
                                Add Track
                            </button>
                        </form>

                        <button
                            onClick={() => { closeModal; onClose() }}
                            className="mt-4 text-sm text-gray-400 hover:text-white underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AddMenu;