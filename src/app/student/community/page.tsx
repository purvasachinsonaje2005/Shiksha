"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { FAQ } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CommunityPage() {
  const [newQuestion, setNewQuestion] = useState("");
  const [filter, setFilter] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faq");
      const data = await res.json();
      setFaqs(data.faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewQuestion = async () => {
    if (!newQuestion) {
      toast.error("Please enter a question");
      return;
    }

    const response = axios.post(`/api/faq/add-new-question`, {
      question: newQuestion,
    });

    toast.promise(response, {
      loading: "Adding question...",
      success: () => {
        fetchFAQs();
        setNewQuestion("");
        return "Question added successfully!";
      },
      error: "Error adding question",
    });
  };

  const handleAddAnswer = async (id: string) => {
    if (!newAnswers[id]) {
      toast.error("Please enter an answer");
      return;
    }

    const response = axios.post(`/api/faq/add-answer?oid=${id}`, {
      response: newAnswers[id],
    });

    toast.promise(response, {
      loading: "Adding answer...",
      success: () => {
        setNewAnswers((prev) => ({ ...prev, [id]: "" }));
        fetchFAQs();
        return "Answer added successfully!";
      },
      error: "Error adding answer",
    });
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFAQs = faqs.filter((item) =>
    item.question.toLowerCase().includes(filter.toLowerCase())
  );
  if (loading) return <Loading />;

  return (
    <>
      <SectionTitle title="Community Forum" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-10">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Search Questions</legend>
          <input
            type="text"
            placeholder="🔍 Search FAQ"
            className="input input-primary w-full"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Ask a New Question</legend>
          <input
            type="text"
            placeholder="❓ Ask a new question"
            className="input input-primary w-full"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
        </fieldset>
        <button
          className="btn btn-primary md:mt-8.25"
          onClick={handleAddNewQuestion}
        >
          Submit
        </button>
      </div>
      <div className="mt-6 px-5 md:px-10">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <div
                key={item._id}
                className="collapse collapse-arrow bg-base-200 shadow-md border border-base-300 rounded-lg"
              >
                <input type="checkbox" />
                <div className="collapse-title font-semibold text-lg">
                  {item.question}
                </div>
                <div className="collapse-content text-sm space-y-3">
                  {item.answers.length > 0 ? (
                    item.answers.map((ans, idx) => (
                      <div
                        key={idx}
                        className="bg-base-100 border border-base-content shadow-md rounded-xl p-5 mb-4 hover:shadow-lg transition-shadow duration-200"
                      >
                        {/* Response */}
                        <h2 className="text-lg font-semibold text-base-content mb-2">
                          {ans.response}
                        </h2>

                        <hr className="my-3 border-base-content" />

                        {/* User Section */}
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300/40 transition-colors">
                          <img
                            src={"/default-avatar.png"}
                            alt={ans.responder.name}
                            className="w-10 h-10 rounded-full border border-base-300 shadow-sm"
                          />

                          <div className="flex flex-col">
                            <span className="font-medium capitalize">
                              {ans.responder.name}
                            </span>
                            <span className="text-sm opacity-70">
                              Role: {ans.role}
                            </span>

                            <a
                              href={`mailto:${ans.responder.email}`}
                              className="text-primary text-sm font-medium hover:underline"
                            >
                              Send Email
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="italic text-base-content/70">
                      No responses yet
                    </p>
                  )}

                  {/* Add Answer Section */}
                  <div className="flex flex-col md:flex-row gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="✍️ Your answer"
                      className="input input-primary w-full"
                      value={newAnswers[item._id as string] || ""}
                      onChange={(e) =>
                        setNewAnswers((prev) => ({
                          ...prev,
                          [item._id as string]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddAnswer(item._id!)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xl text-center font-semibold">
            No FAQs available
          </p>
        )}
      </div>
    </>
  );
}
