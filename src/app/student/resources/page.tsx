"use client";
import SectionTitle from "@/components/SectionTitle";
import { Resource } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DigitalLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    type: "",
    categories: "",
  });

  const fetchResources = async () => {
    try {
      const res = await axios.get("/api/digital-library/get-all-resources");
      setResources(res.data.resources || []);
    } catch (err) {
      toast.error("Failed to fetch resources");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);
  const filteredResources = resources.filter((r) => {
    if (
      searchTerm.name === "" &&
      searchTerm.type === "" &&
      searchTerm.categories === ""
    ) {
      return true;
    }

    const matchName = r.title
      .toLowerCase()
      .includes(searchTerm.name.toLowerCase());
    const matchType = r.type
      .toLowerCase()
      .includes(searchTerm.type.toLowerCase());
    const matchCategories =
      r.categories?.includes(searchTerm.categories) ?? true;
    return matchName && matchType && matchCategories;
  });
  return (
    <>
      <SectionTitle title="Digital Library" />

      {/* Search Bar */}
      <div className="px-10 flex flex-row gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full flex-grow">
          {["name", "type", "categories"].map((key) => (
            <input
              key={key}
              type="text"
              className="input input-primary w-full"
              placeholder={`Search by ${key}...`}
              value={(searchTerm as any)[key]}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, [key]: e.target.value })
              }
            />
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="px-10 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res, idx) => (
          <div
            key={idx}
            className="card bg-base-200 shadow-lg hover:shadow-xl transition-all"
          >
            <figure className="h-56 bg-base-300">
              {res.coverImage ? (
                <img
                  src={res.coverImage}
                  alt={res.title}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center text-sm text-base-content/50 h-full">
                  No Cover Image
                </div>
              )}
            </figure>
            <div className="card-body">
              <h2 className="card-title">{res.title}</h2>
              <p className="text-sm text-base-content/70">
                {res.authors.map((a) => a.name).join(", ")}
              </p>
              <p className="text-xs text-base-content/50">
                {res.publishedYear} • {res.type}
              </p>
              <p className="text-sm mt-2 line-clamp-3">
                {res.description || "No description available"}
              </p>
              <div className="card-actions justify-end mt-2">
                {res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    View Resource
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
