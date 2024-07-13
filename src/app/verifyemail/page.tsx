'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {

  const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyEmail = async () => {
    try {
      setLoading(true)
      await axios.post("/api/users/verifyemail", {token});
      setVerified(true)
      router.push("/login");
      setLoading(false);
      toast.success("Email verified");

    } catch (error: any) {
      console.log("Email verification failed", error.message);
      toast.error(error.message);
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   const urlToken = window.location.search.split("=")[1]
  //   setToken(urlToken || "")
  // },[]);

  // useEffect(() => {
  //   if (token.length > 0) {
  //     // verifyEmail();
  //   }
  // }, [token])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      {/* <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2> */}
      <label htmlFor="username">Enter Token</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id='token'
        type='text'
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder='Token'

      />

      <button
        onClick={verifyEmail}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Verify</button>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">
            Login
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Error</h2>
        </div>
      )}

    </div>
  )
}

