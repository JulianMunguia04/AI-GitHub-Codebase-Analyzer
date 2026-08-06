"use client";

export default function Home() {
  async function askRepo() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/repo/chat`;

    console.log("URL:", url);

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: "LadLadder",
          question: "How are players scored",
        }),
      });

      console.log("POST completed");
      console.log("Status:", response.status);

      const text = await response.text();
      console.log("Raw response:", text);

    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  return (
    <button onClick={askRepo}>
      Ask Repo
    </button>
  );
}