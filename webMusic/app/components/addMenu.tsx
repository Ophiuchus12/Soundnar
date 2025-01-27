import { LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {

}

export async function AddMenu(idTrackDeezer: number) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                <h2 className="text-2xl font-semibold text-white mb-6">Select playlist to add the song</h2>
                <Form method="post">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Playlists
                        </label>
                        {/* <input
                            type="text"
                            id="title"
                            name="title"
                            value={playlistTitle}
                            onChange={(e) => setplaylistTitle(e.target.value)}
                            className="mt-2 p-3 w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#7600be] focus:outline-none"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs">{errors.title}</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-6">

                        <button
                            type="submit"
                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Create your playlist
                        </button>

                        <div className="w-4" />

                        <button
                            type="button"
                            onClick={toggleForm}
                            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Cancel
                        </button> */}
                    </div>
                </Form>
            </div>
        </div>
    )
}