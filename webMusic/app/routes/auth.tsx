import { Form, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import {
    ActionFunction,
    LoaderFunction,
    redirect,
} from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
import { verify } from "~/lib/User";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookies"));
    const token = session.get("authToken");

    if (token) {
        const isValid = await verify(token);

        if (isValid) {
            return redirect("/");
        } else {
            session.unset("authToken");
        }

        const headers = new Headers({
            "Set-Cookie": await commitSession(session),
        });
        return redirect("/auth", { headers });
    }
    return null;
};

export const action ActionFunction = async({ request }=> {
    const session = await getSession(request.headers.get("Cookies"));
})

export default function Auth() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="w-full h-full flex flex-col bg-black fade-in">
            {/* Back Button */}
            <div className="absolute">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>
            </div>

            {/* Centered Form Container */}
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-lg bg-[#1a1a1a] rounded-lg shadow-lg p-6 text-white">
                    <h2 className="text-xl font-semibold text-center mb-4 text-white">
                        Welcome Back
                    </h2>

                    <Form method="post" className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-400 mb-1"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#3b3b3b] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-400 mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#3b3b3b] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-500 transition-all"
                        >
                            Log In
                        </button>
                    </Form>

                    {/* Additional Options */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            Don’t have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-purple-400 hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
