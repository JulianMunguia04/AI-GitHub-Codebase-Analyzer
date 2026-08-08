"use client"

import { useRouter } from "next/navigation";
import React, { useState, useRef } from 'react';

export default function Home() {

  const BACKEND_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const timeoutRef = useRef(null);

  const callSearchWithReset = (argument, delayMs) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchBackendRepositories(argument)
      timeoutRef.current = null;
    }, delayMs);
  };

  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  const searchBackendRepositories = async (query) => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setRepos(data);
      console.log(data)
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen bg-[#FAF9F6] flex flex-col">

      {/* Navbar */}
      <nav 
        className="
          h-20
          flex
          items-center
          justify-center
          border-b
          border-[#D7D5CC]
          relative
        "
      >
        <button
          onClick={() => router.push("/")}
          className="
            absolute
            left-8
            text-lg
            font-medium
            text-[#212E3D]
            hover:text-[#546890]
            transition
          "
        >
          Home
        </button>

        <img
          src="/lily_logo.png"
          alt="Lily Logo"
          className="
            h-20
            w-20
            object-contain
          "
        />
      </nav>

      {/* Hero */}
      <section className="flex-1 relative">
        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-[90%]
            w-full
            max-w-3xl
            px-6
          "
        >
          {/* Title */}
          <h1
            className="
              text-6xl
              text-center
              font-serif
              font-semibold
              text-[#212E3D]
              mb-4
            "
          >
            Lily
          </h1>

          {/* Description */}
          <p
            className="
              text-center
              text-lg
              text-[#A4A7B1]
              mb-10
            "
          >
            Search any public GitHub repository and analyze it with AI.
          </p>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search GitHub repositories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                callSearchWithReset(e.target.value, 1000);
              }}
              className="
                w-full
                rounded-2xl
                border
                border-[#D7D5CC]
                bg-white
                px-6
                py-5
                text-lg
                text-[#212E3D]
                placeholder:text-[#A4A7B1]
                shadow-lg
                outline-none
                transition
                focus:border-[#D69AA8]
                focus:ring-4
                focus:ring-[#D69AA8]/20
              "
            />

            {/* Results */}
              {!repos ?(
                null
              ) : repos.length === 0 ? (
                <div>Not Found</div>
              ) : (
                <div
                  className="
                    absolute
                    top-full
                    mt-3
                    w-full
                    rounded-2xl
                    bg-white
                    border
                    border-[#D7D5CC]
                    shadow-xl
                    overflow-y-auto
                    h-[400%]
                  "
                >
                  {repos.slice(0, 5).map((repo, index) => (
                    <button
                      key={index}
                      className="
                        w-full
                        text-left
                        px-6
                        py-4
                        hover:bg-[#F3EEF0]
                        transition
                      "
                      onClick={() => router.push(`/repo/?owner=${repo.owner}&repo=${repo.name}`)}
                    >
                      <p className="font-semibold text-[#212E3D]">
                        {repo.name}
                      </p>
                      <p className="text-sm text-[#A4A7B1]">
                        {repo.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer
        className="
          h-16
          flex
          items-center
          justify-center
          border-t
          border-[#D7D5CC]
          text-sm
          text-[#A4A7B1]
        "
      >
        © 2026 Lily AI • Built with Next.js • Flask • OpenAI • GitHub API
      </footer>
    </main>
  );
}
