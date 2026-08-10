"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Repo() {
  const BACKEND_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  const router = useRouter();
  const searchParams = useSearchParams();

  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  const [repository, setRepository] = useState(null);
  const [tree, setTree] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * ============================
   * Fetch Repository
   * ============================
   */

  useEffect(() => {
    if (!owner || !repo) {
      setError("Missing repository information.");
      setLoading(false);
      return;
    }

    const fetchRepository = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BACKEND_BASE_URL}/repo?owner=${encodeURIComponent(
            owner
          )}&repo=${encodeURIComponent(repo)}`
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        setRepository(data.repository);
        setTree(data.tree);

        console.log(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [owner, repo, BACKEND_BASE_URL]);

  /*
   * ============================
   * Analyze Repository
   * ============================
   */

  const analyzeRepository = async () => {
    try {
      // Placeholder for the future embedding route
      const response = await fetch(
        `${BACKEND_BASE_URL}/repo/chunks?owner=${owner}&repo=${repo}`
      );
      
      const text = await response.json()

      if (text){
        router.push(`/chat/?owner=${owner}&repo=${repo}`)
      }

      console.log("Test", text);

    } catch (err) {
      console.error("Analyze error:", err);
    }
  };

  /*
   * ============================
   * Tree Renderer
   * ============================
   */

  const renderTree = (node, level = 0) => {
    if (!node || typeof node !== "object") {
      return null;
    }

    return Object.entries(node).map(([name, value]) => {
      const isFile =
        value &&
        typeof value === "object" &&
        value.type === "blob";

      return (
        <div key={`${level}-${name}`}>
          <div
            className="
              flex
              items-center
              gap-3
              py-2
              px-4
              rounded-lg
              hover:bg-[#F3EEF0]
              transition
            "
            style={{
              paddingLeft: `${16 + level * 24}px`,
            }}
          >
            <span className="text-sm">
              {isFile ? "📄" : "📁"}
            </span>

            <span
              className={`
                text-sm
                ${
                  isFile
                    ? "text-[#4D5663]"
                    : "font-medium text-[#212E3D]"
                }
              `}
            >
              {name}
            </span>
          </div>

          {!isFile && renderTree(value, level + 1)}
        </div>
      );
    });
  };

  /*
   * ============================
   * Loading
   * ============================
   */

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#212E3D]">

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
            className="h-20 w-20 object-contain"
          />
        </nav>

        {/* Loading */}
        <section className="flex-1 flex items-center justify-center">
          <p className="text-lg text-[#A4A7B1]">
            Loading repository...
          </p>
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

  /*
   * ============================
   * Error
   * ============================
   */

  if (error) {
    return (
      <main className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#212E3D]">

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
            className="h-20 w-20 object-contain"
          />
        </nav>

        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-[#212E3D] mb-3">
              Repository Not Found
            </h1>

            <p className="text-[#A4A7B1]">
              {error}
            </p>
          </div>
        </section>

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

  /*
   * ============================
   * Repository Page
   * ============================
   */

  return (
    <main className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#212E3D]">

      {/* ================= Navbar ================= */}

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


      {/* ================= Repository Content ================= */}

      <section className="w-full max-w-6xl mx-auto px-8 py-12">

        {/* Repository Header */}

        <div className="border-b border-[#D7D5CC] pb-8">

          <div className="flex items-start justify-between gap-8">

            <div>

              <p className="text-sm text-[#A4A7B1] mb-2">
                {repository.owner}
              </p>

              <h1
                className="
                  text-5xl
                  font-serif
                  font-semibold
                  text-[#212E3D]
                "
              >
                {repository.name}
              </h1>

              <p className="mt-4 max-w-3xl text-lg text-[#7D828C]">
                {repository.description ||
                  "No description provided."}
              </p>

            </div>

            {/* Analyze Button */}

            <button
              onClick={analyzeRepository}
              className="
                shrink-0
                rounded-2xl
                bg-[#6FA56F]
                px-8
                py-4
                text-lg
                font-semibold
                text-white
                shadow-lg
                transition
                hover:bg-[#5F9360]
                hover:shadow-xl
                active:scale-[0.98]
              "
            >
              Analyze Repository
            </button>

          </div>

        </div>


        {/* ================= Metadata ================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">

          <div
            className="
              rounded-2xl
              border
              border-[#D7D5CC]
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-[#A4A7B1]">
              Language
            </p>

            <p className="mt-2 text-lg font-semibold text-[#212E3D]">
              {repository.language || "Unknown"}
            </p>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#D7D5CC]
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-[#A4A7B1]">
              Stars
            </p>

            <p className="mt-2 text-lg font-semibold text-[#212E3D]">
              ⭐ {repository.stars?.toLocaleString() || 0}
            </p>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#D7D5CC]
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-[#A4A7B1]">
              Forks
            </p>

            <p className="mt-2 text-lg font-semibold text-[#212E3D]">
              {repository.forks?.toLocaleString() || 0}
            </p>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#D7D5CC]
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-[#A4A7B1]">
              Default Branch
            </p>

            <p className="mt-2 text-lg font-semibold text-[#212E3D]">
              {repository.default_branch}
            </p>
          </div>

        </div>


        {/* ================= Topics ================= */}

        {repository.topics &&
          repository.topics.length > 0 && (

            <div className="mb-10">

              <h2
                className="
                  text-2xl
                  font-serif
                  font-semibold
                  text-[#212E3D]
                  mb-4
                "
              >
                Topics
              </h2>

              <div className="flex flex-wrap gap-3">

                {repository.topics.map((topic) => (

                  <span
                    key={topic}
                    className="
                      rounded-full
                      bg-[#E8EEF5]
                      px-4
                      py-2
                      text-sm
                      text-[#546890]
                    "
                  >
                    {topic}
                  </span>

                ))}

              </div>

            </div>

          )}


        {/* ================= Repository Tree ================= */}

        <div>

          <div className="mb-5">

            <h2
              className="
                text-3xl
                font-serif
                font-semibold
                text-[#212E3D]
              "
            >
              Repository Files
            </h2>

            <p className="mt-2 text-[#A4A7B1]">
              Browse the structure of this repository.
            </p>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#D7D5CC]
              bg-white
              p-4
              shadow-sm
              overflow-hidden
            "
          >

            {tree ? (
              renderTree(tree)
            ) : (
              <p className="p-4 text-[#A4A7B1]">
                No repository files found.
              </p>
            )}

          </div>

        </div>

      </section>


      {/* ================= Footer ================= */}

      <footer
        className="
          mt-auto
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