"use client";
import SectionTitle from "@/components/SectionTitle";
import { Notice } from "@/Types";
import { useEffect, useState } from "react";

export default function Notices() {
  const [searchTerm, setSearchTerm] = useState({
    title: "",
    date: "",
    school: "",
  });
  const [notices, setNotices] = useState<Notice[]>([]);

  const schools = Array.from(
    new Set(notices.map((notice) => notice.school.name))
  );

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices);
      } else {
        console.error("Failed to fetch notices");
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.title.toLowerCase()) &&
      notice.school.name
        .toLowerCase()
        .includes(searchTerm.school.toLowerCase()) &&
      (searchTerm.date
        ? new Date(notice.date!).toDateString() ===
          new Date(searchTerm.date).toDateString()
        : true)
  );

  return (
    <>
      <SectionTitle title="Manage Notices" />
      <div className="px-10 flex lg:flex-row flex-col justify-center items-center gap-4 mx-auto w-full">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Search Notice by Title<span className="text-error">*</span>
          </legend>
          <input
            type="text"
            placeholder="Enter notice title"
            className="input input-primary w-full"
            value={searchTerm.title}
            onChange={(e) =>
              setSearchTerm({ ...searchTerm, title: e.target.value })
            }
          />
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Search Notice by School
            <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={searchTerm.school}
            onChange={(e) =>
              setSearchTerm({ ...searchTerm, school: e.target.value })
            }
          >
            <option value="">All Schools</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Search Notice by Date
            <span className="text-error">*</span>
          </legend>
          <input
            type="date"
            className="input input-primary w-full"
            value={searchTerm.date}
            onChange={(e) =>
              setSearchTerm({ ...searchTerm, date: e.target.value })
            }
          />
        </fieldset>
      </div>
      {/* Display Notices */}
      <div className="px-10 my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice._id} className="card bg-base-300 w-96 shadow-sm">
              <img
                src={
                  `data:${notice.image?.contentType};base64,${Buffer.from(
                    notice.image?.data!
                  ).toString("base64")}` ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ799fyQRixe5xOmxYZc3kAy6wgXGO-GHpHSA&s"
                }
                alt={notice.title}
                className="mt-4 w-full h-56 object-contain"
              />
              <div className="card-body">
                <h3 className="card-title">{notice.title}</h3>
                <p className="text-base-content/80">{notice.content}</p>
                <p className="text-sm text-base-content/70">
                  By {notice.principal.name} |{" "}
                  {new Date(notice?.date!).toLocaleDateString()}
                </p>
                <p>
                  School: <strong>{notice.school.name}</strong>
                </p>
                <div className="tags mt-2">
                  {(typeof notice.tags === "string"
                    ? notice.tags.split(", ")
                    : notice.tags
                  )?.map((tag, index) => (
                    <span key={index} className="badge badge-primary mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold uppercase text-center col-span-3">
            No notices found
          </p>
        )}
      </div>
    </>
  );
}
