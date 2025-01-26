import { LoaderFunction } from '@remix-run/node'
import { useNavigate } from '@remix-run/react';
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server'


export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("authToken");
  let userId: string = "";
  let userName: string = "";



  if (!token) {
    return { isAuthenticated: false, error: null, token: null };
  } else {
    const response = await getMe(token);
    if (response && response.user) {
      userId = response.user.id.toString();
      userName = response.user.username;
    }
  }


  const isValid = await verify(token);
  if (!isValid) {
    return { isAuthenticated: false, error: null, token: null };
  }


  console.log("param", params)
  console.log("request", request)

  return { isAuthenticated: true, error: null, token: token, userId: userId, userName: userName };

}
export default function PlaylistDetails() {

  const navigate = useNavigate();
  return (
    <div className='w-full h-full min-h-screen flex flex-col mt-10 bg-black fade-in'>
      <div className=" flex ml-8">
        <button
          onClick={() => navigate(-1)}
          className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
          aria-label="Go back to home"
        >
          <FaArrowLeft />
        </button>

      </div>
      <p>playlistDetails</p>
    </div>
  )
}
