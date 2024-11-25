'use client'

import React, { useEffect, useState } from 'react';
import { logout } from "./login/actions";
import supabase from "../config/supabaseClient.js"

//components
import UserNameCard from "../components/userNameCard"
import UserInfoCard from "../components/userInfoCard"

interface User {
  id: number;
  title: string;
  role: string;
  hours: number;
}

export default function HomePage() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [users, setUser] = useState<User[] | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('test')
        .select()

        if (error) {
          setFetchError("Could not fetch user")
          setUser(null)
          console.log(error)
        }
        if (data) {
          setUser(data)
          setFetchError(null)
        }
    }
    fetchUser()
  }, [])
  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center bg-gray-100">
      <div className="block mx-auto mt-4 w-full max-w-md p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow">
        <div className="flex items-center justify-center mb-4"> 
          <p className="text-sm md:text-base font-medium text-center">
            Welcome back
          </p>
          {fetchError && (<p>{fetchError}</p>)}
            {users && (
              <div className="text-sm md:text-base font-medium text-center ml-1">
                  {users
                  .filter(user => user.id === 1)
                  .map(user => (
                    <UserNameCard key={user.id} user={user} />
                  ))}
              </div>)}
              <p className="text-sm md:text-base font-medium text-center">
                !
              </p>
            </div>
          <p className="text-sm md:text-base font-medium text-center">
            You’re successfully logged in.
          </p>
        </div>
      <div>
        {fetchError && (<p>{fetchError}</p>)}
          {users && (
            <div className="text-sm md:text-base font-medium text-center ml-1">
                {users
                .filter(user => user.id === 1)
                .map(user => (
                  <UserInfoCard key={user.id} user={user} />
                ))}
            </div>)}
      </div>
      <form>
        <button
          formAction={logout}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 active:bg-red-700 transition duration-150"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
