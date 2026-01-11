"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Conversation, Student } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function StudentMessagePage() {
  const { user } = useAuth() as { user: Student };
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState("");

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations/teacher");
      const data = await res.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !messageInput.trim()) return;

    try {
      await axios.post(
        `/api/conversations/teacher/messages?conversationId=${selectedConversation._id}`,
        {
          content: messageInput,
        }
      );

      setSelectedConversation({
        ...selectedConversation,
        messages: [
          ...selectedConversation.messages,
          { content: messageInput, sender: { _id: user, model: "Teacher" } },
        ],
      });

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Messages" />
      <div className="px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-15rem)] border rounded-xl overflow-hidden">
          <div className="bg-base-200 border-r overflow-y-auto">
            <div className="p-4 bg-base-200 border-b">
              <h2 className="text-lg font-semibold">Shiksha Conversations</h2>
            </div>
            {conversations.map((c) => (
              <div
                key={c._id}
                onClick={() => setSelectedConversation(c)}
                className={`p-4 cursor-pointer hover:bg-base-300 ${
                  selectedConversation?._id === c._id ? "bg-base-300" : ""
                }`}
              >
                <h3 className="font-semibold">
                  {c.groupInfo?.name || "Private Chat"}
                </h3>

                <p className="text-sm opacity-70">
                  {c.messages.length > 0
                    ? c.messages[c.messages.length - 1].content
                    : "No messages yet"}
                </p>
              </div>
            ))}
          </div>

          <div className="col-span-2 flex flex-col">
            <div className="p-4 bg-base-200 border-b">
              <h2 className="text-lg font-semibold">
                {selectedConversation?.groupInfo?.name ||
                  selectedConversation?.participants
                    .filter((p) => p._id._id !== user._id)
                    .map((p) => p._id.name)
                    .join(", ") ||
                  "Select a conversation"}
              </h2>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConversation ? (
                selectedConversation.messages
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt!).getTime() -
                      new Date(b.createdAt!).getTime()
                  )
                  .map((msg, i) => (
                    <div
                      key={i}
                      className={`chat ${
                        msg.sender.model === "Teacher"
                          ? "chat-end"
                          : "chat-start"
                      }`}
                    >
                      <div className="chat-header">
                        {msg.sender._id.name}
                        <time className="text-xs opacity-50">
                          {new Date(msg.createdAt!).toLocaleTimeString()}
                        </time>
                      </div>
                      <div className="chat-bubble">{msg.content}</div>
                    </div>
                  ))
              ) : (
                <div className="opacity-60">
                  Select a conversation to view messages
                </div>
              )}
            </div>

            {/* INPUT AREA */}
            {selectedConversation && (
              <div className="p-4 border-t bg-base-200 flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message"
                  className="input input-bordered w-full"
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
