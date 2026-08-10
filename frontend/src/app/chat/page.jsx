"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Chat() {
  const BACKEND_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  const router = useRouter();
  const searchParams = useSearchParams();

  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  const [tree, setTree] = useState(null);
  const [repository, setRepository] = useState(null);

  const [loadingTree, setLoadingTree] = useState(true);
  const [treeError, setTreeError] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm Lily. I've analyzed this repository and I'm ready to help you understand the codebase.",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  /*
  ============================
  Fetch Repository Tree
  ============================
  */

  useEffect(() => {
    if (!owner || !repo) {
      setTreeError("Missing repository information.");
      setLoadingTree(false);
      return;
    }

    const fetchTree = async () => {
      try {
        setLoadingTree(true);

        const response = await fetch(
          `${BACKEND_BASE_URL}/repo/tree?owner=${owner}&repo=${repo}`
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        setRepository({
          owner: data.owner,
          name: data.repo,
        });

        setTree(data.tree);

        console.log("Repository tree:", data);
      } catch (err) {
        console.error("Tree error:", err);
        setTreeError(err.message);
      } finally {
        setLoadingTree(false);
      }
    };

    fetchTree();
  }, [owner, repo, BACKEND_BASE_URL]);

  /*
  ============================
  Send Chat Message
  ============================
  */

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || sending) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/repo/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo,
            question: trimmedInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      let answer = data.answer;

      try {
        // Remove ```json and ``` from the response
        answer = answer
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");

        // Convert JSON string into an object
        answer = JSON.parse(answer);
      } catch (err) {
        console.error("Failed to parse AI response:", err);
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          answer?.response ||
          "I wasn't able to generate an answer for that question.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      console.log("ai response: ", data.answer)
    } catch (err) {
      console.error("Chat error:", err);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Sorry, something went wrong while analyzing the repository.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  /*
  ============================
  Keyboard Handling
  ============================
  */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /*
  ============================
  Repository Tree Renderer
  ============================
  */

  const TreeNode = ({ name, value, level = 0 }) => {
    const isFile =
      value &&
      typeof value === "object" &&
      value.type === "blob";

    const [expanded, setExpanded] = useState(level < 1);

    const isFolder =
      value &&
      typeof value === "object" &&
      !isFile;

    return (
      <div>
        <button
          onClick={() => {
            if (isFolder) {
              setExpanded((prev) => !prev);
            }
          }}
          className="
            w-full
            flex
            items-center
            gap-2
            py-1.5
            px-2
            rounded-lg
            text-left
            hover:bg-[#F3EEF0]
            transition
          "
          style={{
            paddingLeft: `${8 + level * 18}px`,
          }}
        >
          <span className="w-4 text-xs text-[#A4A7B1]">
            {isFile ? "" : expanded ? "⌄" : "›"}
          </span>

          <span className="text-sm">
            {isFile ? "📄" : "📁"}
          </span>

          <span
            className={`
              text-sm truncate
              ${
                isFile
                  ? "text-[#59616D]"
                  : "font-medium text-[#212E3D]"
              }
            `}
          >
            {name}
          </span>
        </button>

        {isFolder && expanded && (
          <div>
            {Object.entries(value).map(([childName, childValue]) => (
              <TreeNode
                key={`${level}-${childName}`}
                name={childName}
                value={childValue}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTree = (node) => {
    if (!node || typeof node !== "object") {
      return null;
    }

    return Object.entries(node).map(([name, value]) => (
      <TreeNode
        key={name}
        name={name}
        value={value}
        level={0}
      />
    ));
  };

  /*
  ============================
  Loading
  ============================
  */

  if (loadingTree) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] flex flex-col">

        <nav
          className="
            h-20
            flex
            items-center
            justify-center
            border-b
            border-[#D7D5CC]
            relative
            bg-[#FCFBF8]
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

        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#A4A7B1]">
            Loading repository...
          </p>
        </div>

      </main>
    );
  }

  /*
  ============================
  Error
  ============================
  */

  if (treeError) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] flex flex-col">

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
              Repository Unavailable
            </h1>

            <p className="text-[#A4A7B1]">
              {treeError}
            </p>
          </div>
        </section>

      </main>
    );
  }

  /*
  ============================
  Main Chat Interface
  ============================
  */

  return (
    <main className="h-screen bg-[#FCFBF8] flex flex-col overflow-hidden">

      {/* ================= Navbar ================= */}

      <nav
        className="
          h-20
          shrink-0
          flex
          items-center
          border-b
          border-[#D7D5CC]
          relative
          bg-[#FCFBF8]
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

        <div className="mx-auto flex items-center gap-3">

          <img
            src="/lily_logo.png"
            alt="Lily Logo"
            className="h-14 w-14 object-contain"
          />

          <div>
            <p className="text-xs text-[#A4A7B1]">
              Repository
            </p>

            <p className="text-sm font-semibold text-[#212E3D]">
              {repository?.owner}/{repository?.name}
            </p>
          </div>

        </div>

      </nav>


      {/* ================= Main Workspace ================= */}

      <div className="flex flex-1 min-h-0">

        {/* ================= Repository Sidebar ================= */}

        <aside
          className="
            w-[330px]
            shrink-0
            border-r
            border-[#D7D5CC]
            bg-white
            flex
            flex-col
          "
        >

          {/* Sidebar Header */}

          <div
            className="
              h-16
              shrink-0
              flex
              items-center
              justify-between
              px-5
              border-b
              border-[#E5E2DA]
            "
          >

            <div>
              <p className="text-xs text-[#A4A7B1]">
                Repository
              </p>

              <h2 className="text-lg font-serif font-semibold text-[#212E3D]">
                Files
              </h2>
            </div>

          </div>


          {/* Tree */}

          <div className="flex-1 overflow-y-auto p-3">

            {tree ? (
              renderTree(tree)
            ) : (
              <p className="text-sm text-[#A4A7B1] px-2 py-4">
                No repository files found.
              </p>
            )}

          </div>

        </aside>


        {/* ================= Chat Area ================= */}

        <section className="flex-1 min-w-0 flex flex-col">

          {/* Chat Header */}

          <div
            className="
              h-16
              shrink-0
              flex
              items-center
              px-8
              border-b
              border-[#E5E2DA]
              bg-[#FCFBF8]
            "
          >

            <div>

              <h1 className="text-lg font-serif font-semibold text-[#212E3D]">
                Lily
              </h1>

              <p className="text-xs text-[#A4A7B1]">
                AI Codebase Assistant
              </p>

            </div>

          </div>


          {/* ================= Messages ================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-8
              py-8
            "
          >

            <div className="max-w-4xl mx-auto space-y-6">

              {messages.map((message) => (

                <div
                  key={message.id}
                  className={`
                    flex
                    ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >

                  <div
                    className={`
                      max-w-[75%]
                      rounded-2xl
                      px-5
                      py-4
                      text-sm
                      leading-7
                      ${
                        message.role === "user"
                          ? "bg-[#E8EEF5] text-[#212E3D] rounded-br-md"
                          : "bg-white border border-[#E2DED6] text-[#3F4650] rounded-bl-md shadow-sm"
                      }
                    `}
                  >

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">

                        <img
                          src="/lily_logo.png"
                          alt=""
                          className="h-6 w-6 object-contain"
                        />

                        <span className="text-xs font-semibold text-[#546890]">
                          Lily
                        </span>

                      </div>
                    )}

                    <p className="whitespace-pre-wrap">
                      {message.content}
                    </p>

                  </div>

                </div>

              ))}


              {/* ================= Reusable Assistant Message Placeholder ================= */}

              {sending && (
                <div className="flex justify-start">

                  <div
                    className="
                      max-w-[75%]
                      rounded-2xl
                      rounded-bl-md
                      bg-white
                      border
                      border-[#E2DED6]
                      px-5
                      py-4
                      shadow-sm
                    "
                  >

                    <div className="flex items-center gap-2">

                      <img
                        src="/lily_logo.png"
                        alt=""
                        className="h-6 w-6 object-contain"
                      />

                      <span className="text-xs font-semibold text-[#546890]">
                        Lily
                      </span>

                    </div>

                    <div className="mt-3 flex gap-1">

                      <span className="h-2 w-2 rounded-full bg-[#A4A7B1] animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-[#A4A7B1] animate-pulse delay-100" />
                      <span className="h-2 w-2 rounded-full bg-[#A4A7B1] animate-pulse delay-200" />

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>


          {/* ================= Input ================= */}

          <div
            className="
              shrink-0
              px-8
              pb-7
              pt-3
              bg-[#FCFBF8]
            "
          >

            <div className="max-w-4xl mx-auto">

              <div
                className="
                  flex
                  items-end
                  gap-3
                  rounded-2xl
                  border
                  border-[#D7D5CC]
                  bg-white
                  px-4
                  py-3
                  shadow-sm
                  focus-within:border-[#A8B5C8]
                  focus-within:ring-2
                  focus-within:ring-[#E8EEF5]
                  transition
                "
              >

                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lily about this codebase..."
                  rows={1}
                  disabled={sending}
                  className="
                    flex-1
                    resize-none
                    bg-transparent
                    outline-none
                    text-sm
                    text-[#212E3D]
                    placeholder:text-[#A4A7B1]
                    max-h-40
                  "
                />

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-xl
                    bg-[#6FA56F]
                    text-white
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-[#5F9360]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                  aria-label="Send message"
                >
                  ↑
                </button>

              </div>

              <p className="text-center text-xs text-[#A4A7B1] mt-3">
                Lily uses the repository context to answer questions about the codebase.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
