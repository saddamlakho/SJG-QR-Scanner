"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    router.push("/login"); 
  };

  useEffect(() => {
  
    const token = localStorage.getItem("token");

    if (!token) {
   
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
   
      <button
        onClick={handleLogout} 
        className="bg-red-500 text-white p-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
