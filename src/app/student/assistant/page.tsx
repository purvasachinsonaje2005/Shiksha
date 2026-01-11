"use client";

import React, { useState } from "react";
import axios from "axios";
import { IconSend, IconBrandGithubCopilot } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Markdown from "react-markdown";

type Message = { role: "user" | "assistant"; text: string; id?: string };

const AiChatter = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pushMessage = (msg: Message) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const askAi = async (text: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/helper/gemini", { input: text });
      const aiText: string =
        res.data?.output ?? "Sorry, I couldn't get an answer.";
      pushMessage({ role: "assistant", text: aiText });
    } catch (err) {
      console.error("AI request error:", err);
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    pushMessage({ role: "user", text });
    await askAi(text);
  };

  return (
    <div className="flex flex-col h-full pb-5 bg-base-200 border-l border-base-300">
      {/* Header */}
      <div
        className="p-4 border-b border-t border-base-content flex items-center gap-3 bg-base-300"
        role="banner"
      >
        <IconBrandGithubCopilot size={22} className="text-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Shiksha AI Assistant</h3>
          <p className="text-xs text-base-content/70">
            Ask about managing your courses, assignments, and more.
          </p>
        </div>
      </div>

      {messages.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-base-100">
          {" "}
          <IconBrandGithubCopilot
            size={48}
            className="mb-4 text-base-content"
          />{" "}
          <h1 className="text-2xl font-semibold mb-2 text-center">
            {" "}
            Hello {user?.name || "User"}! How can I assist you today?{" "}
          </h1>{" "}
          <p className="text-center text-base-content">
            You can ask me questions about your courses, assignments, schedules,
            and more. Just type your question below and hit send!{" "}
          </p>{" "}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat ${m.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={m.role === "user" ? "You" : "AI"}
                  src={
                    m.role === "user"
                      ? `data:${
                          user?.profileImage?.contentType
                        };base64,${Buffer.from(
                          user?.profileImage?.data || ""
                        ).toString("base64")}`
                      : "/bot-avatar.jpg"
                  }
                />
              </div>
            </div>
            <div
              className={`chat-bubble max-w-[80%] ${
                m.role === "user"
                  ? "bg-primary text-primary-content"
                  : "bg-base-300 text-base-content"
              }`}
            >
              <Markdown>{m.text}</Markdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="AI" src="/bot-avatar.jpg" />
              </div>
            </div>
            <div className="chat-bubble bg-base-300">
              <span className="loading loading-dots loading-md"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input / Controls */}
      <div className="p-3 border-t border-base-content bg-base-300">
        <div className="join w-full">
          <input
            className="input input-bordered input-primary w-full join-item"
            placeholder="Type a question or press the mic to record"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            className="btn btn-primary join-item"
            disabled={loading}
          >
            <IconSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatter;
