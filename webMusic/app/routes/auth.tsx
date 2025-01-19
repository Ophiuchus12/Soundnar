import { Form, useActionData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import {
    ActionFunction,
    LoaderFunction,
    redirect,
} from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
import { verify } from "~/lib/User";
import animationData from "../../assets/dataMusic.json";
import { useLottie } from "lottie-react";


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

// export const action ActionFunction = async({ request }=> {
//     const session = await getSession(request.headers.get("Cookie"));
//     const formData = await request.formData();

//     const activetab = formData.get("activeTab") as "login" | "signup";
//     const username = formData.get("username") as string;
//     const password = formData.get("password") as string;
//     const confirmPassword = formData.get("confirmPassword") as string;

// });

export default function Auth() {

    const [isAnimationComplete, setIsAnimationComplete] = useState(true);

    const options = {
        animationData: animationData,
        loop: true,
        autoplay: true,
        //onComplete: () => setIsAnimationComplete(true),
    };

    const home = useLottie(options);

    const actionData = useActionData<typeof action>();
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        username?: string | null;
        password?: string | null;
        confirmPassword?: string | null;
        server?: string;
    }>({});

    const handleSwitchTab = (tab: "login" | "signup") => {
        setActiveTab(tab);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
    }


    const loading = actionData?.loading;

    const goHome = () => {
        window.history.back();
    }


    return (
        <div className="w-full h-full flex flex-col bg-black fade-in">
            {/* Back Button */}
            <div className="absolute">
                <button
                    onClick={goHome}
                    className="text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="w-full h-full">
                    {home.View}
                </div>
            </div>

            {/* Centered Form Container */}
            <div className="flex items-center justify-center h-full z-10">
                <div className="w-full max-w-lg bg-[#1a1a1a] rounded-lg shadow-lg p-6 text-white">
                    <h2 className="text-xl font-semibold text-center mb-4 text-white">
                        {activeTab === "login" ? "Welcome Back" : "Welcome"}
                    </h2>

                    <Form method="post" className="space-y-4">
                        <input type="hidden" name="activeTab" value={activeTab} />

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
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password}</p>
                            )}
                        </div>

                        {activeTab == "signup" && (
                            <div className="">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full p-3 rounded-md bg-[#2b2b2b] border border-[#3b3b3b] text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`flex w-full items-center justify-center px-6 py-2 text-lg font-semibold rounded border-2 mt-4 transition-all duration-300 ${username &&
                                password &&
                                (activeTab === "login" || password === confirmPassword)
                                ? "bg-[#6949FD] border-[#6949FD] text-white hover:bg-blue-700"
                                : "bg-transparent border-[#32167C] text-[#32167C] cursor-not-allowed"
                                }`}
                            disabled={
                                loading ||
                                !username ||
                                !password ||
                                (activeTab === "signup" || password === confirmPassword)
                            }
                        >
                            {activeTab === "signup" ? "Login here" : "Sign up here"}
                        </button>

                    </Form>

                    {/* Additional Options */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            Don’t have an account?{" "}
                            <button
                                onClick={() => handleSwitchTab(activeTab === "signup" ? "login" : "signup")}
                                className="text-purple-400 hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>

        </div >
    );
}
