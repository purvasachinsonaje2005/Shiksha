"use client";
import SectionTitle from "@/components/SectionTitle";
import { Resource } from "@/Types";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DigitalLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [author, setAuthor] = useState({
    name: "",
    bio: "",
    birthDate: undefined as Date | undefined,
    nationality: "",
  });
  const [resourceType, setResourceType] = useState<string>("");
  const [newResource, setNewResource] = useState<Resource>({
    type: "",
    title: "",
    authors: [],
    categories: [],
    coverImage: "",
    description: "",
    fileUrl: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    type: "",
    isbn: "",
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

  const handleCoverImageUpload = async (
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!newResource.title) {
      toast.error("Title of Book is required for images");
      return;
    }
    if (!coverImageFile) return;

    if (coverImageFile.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }

    const uploadPromise = axios.postForm("/api/helper/upload-img", {
      file: coverImageFile,
      name: imageName,
      folderName,
    });

    toast.promise(uploadPromise, {
      loading: "Uploading Image...",
      success: (data: AxiosResponse) => {
        setNewResource({
          ...newResource,
          [path]: data.data.path,
        });
        return "Cover image uploaded successfully!";
      },
      error: (err: unknown) => `This just happened: ${err}`,
    });
  };

  const handleResourceFileUpload = async (
    folderName: string,
    fileName: string,
    path: string
  ) => {
    if (!newResource.title) {
      toast.error("Title of Book is required for resource files");
      return;
    }
    if (!resourceFile) return;

    if (resourceFile.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }

    const uploadPromise = axios.postForm("/api/helper/upload-document", {
      file: resourceFile,
      name: fileName,
      folderName,
    });

    toast.promise(uploadPromise, {
      loading: "Uploading Resource File...",
      success: (data: AxiosResponse) => {
        setNewResource({
          ...newResource,
          [path]: data.data.path,
        });
        return "Resource file uploaded successfully!";
      },
      error: (err: unknown) => `This just happened: ${err}`,
    });
  };

  const handleSaveResource = async () => {
    if (!newResource.type || !newResource.title || !newResource.fileUrl) {
      toast.error("Please fill all required fields before saving.");
      return;
    }

    const savePromise = axios.post("/api/digital-library/add-new-resource", {
      newResource,
    });

    toast.promise(savePromise, {
      loading: "Saving Resource...",
      success: () => {
        setNewResource({
          type: "",
          title: "",
          authors: [],
          categories: [],
          coverImage: "",
          description: "",
          fileUrl: "",
          isbn: "",
          publishedYear: new Date().getFullYear(),
        });
        fetchResources();
        (
          document.getElementById("add-resource-modal") as HTMLDialogElement
        ).close();
        return "Resource saved successfully!";
      },
      error: (err: unknown) => `This just happened: ${err}`,
    });
  };

  const handleAddAuthor = () => {
    if (!author.name.trim()) {
      toast.error("Author name is required");
      return;
    }
    setNewResource({
      ...newResource,
      authors: [...newResource.authors, author],
    });
    setAuthor({ name: "", bio: "", birthDate: undefined, nationality: "" });
  };

  // ✅ Filter resources
  const filteredResources = resources.filter((r) => {
    const matchName = r.title
      .toLowerCase()
      .includes(searchTerm.name.toLowerCase());
    const matchType = r.type
      .toLowerCase()
      .includes(searchTerm.type.toLowerCase());
    const matchIsbn = r.isbn?.includes(searchTerm.isbn);
    return matchName && matchType && matchIsbn;
  });

  return (
    <>
      <SectionTitle title="Digital Library" />

      {/* Search Bar */}
      <div className="px-10 flex flex-row gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full grow">
          {["name", "type", "isbn"].map((key) => (
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

        <button
          className="btn btn-secondary btn-outline"
          onClick={() =>
            (
              document.getElementById("add-resource-modal") as HTMLDialogElement
            ).showModal()
          }
        >
          Add New Resource +
        </button>
      </div>

      {/* Resource Cards */}
      <div className="px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="mt-2">
                {res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary w-full"
                  >
                    View Resource
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      <dialog className="modal" id="add-resource-modal">
        <Toaster />
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg uppercase text-center py-2 bg-primary/10 text-primary rounded-md">
            Add New Resource
          </h3>

          <div className="px-10 py-4 bg-base-200 mt-2 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Resource Type <span className="text-error">*</span>{" "}
                </legend>
                <select
                  className="select select-primary w-full"
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                >
                  <option value="">Select resource type</option>
                  {[
                    "Book",
                    "Research Paper",
                    "Thesis",
                    "Magazine",
                    "Report",
                    "E-Book",
                    "Journal",
                  ].map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Resource Title <span className="text-error">*</span>{" "}
                </legend>
                <input
                  type="text"
                  className="input input-primary w-full"
                  placeholder="Resource Title"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                />
              </fieldset>
            </div>

            {/* Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Resource Cover Image <span className="text-error">*</span>{" "}
                </legend>
                <div className="join">
                  <input
                    type="file"
                    className="file-input file-input-primary w-full join-item"
                    onChange={(e) =>
                      setCoverImageFile(e.target.files?.[0] || null)
                    }
                  />
                  <button
                    className="btn btn-primary join-item"
                    onClick={() =>
                      handleCoverImageUpload(
                        "resources-cover-images",
                        newResource.title.replaceAll(" ", "_"),
                        "coverImage"
                      )
                    }
                  >
                    Upload <IconCloudUpload className="ml-2" />
                  </button>
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Resource File Type <span className="text-error">*</span>{" "}
                </legend>
                <select
                  className="select select-primary w-full"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="file">File</option>
                  <option value="link">Link</option>
                </select>
              </fieldset>

              {resourceType === "file" ? (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Upload File <span className="text-error">*</span>{" "}
                  </legend>
                  <div className="join">
                    <input
                      type="file"
                      className="file-input file-input-primary w-full join-item"
                      onChange={(e) =>
                        setResourceFile(e.target.files?.[0] || null)
                      }
                    />
                    <button
                      className="btn btn-primary join-item"
                      onClick={() =>
                        handleResourceFileUpload(
                          "resources-files",
                          newResource.title.replaceAll(" ", "_"),
                          "fileUrl"
                        )
                      }
                    >
                      Upload <IconCloudUpload className="ml-2" />
                    </button>
                  </div>
                </fieldset>
              ) : (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Resource Link <span className="text-error">*</span>{" "}
                  </legend>
                  <input
                    type="url"
                    className="input input-primary w-full"
                    placeholder="https://..."
                    value={newResource.fileUrl}
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        fileUrl: e.target.value,
                      })
                    }
                  />
                </fieldset>
              )}
            </div>

            {/* Authors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Author Name <span className="text-error">*</span>{" "}
                </legend>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Author Name"
                  value={author.name}
                  onChange={(e) =>
                    setAuthor({ ...author, name: e.target.value })
                  }
                />
              </fieldset>
              <fieldset className="fieldset md:col-span-2">
                <legend className="fieldset-legend">Bio</legend>
                <input
                  type="text"
                  className="input input-primary w-full"
                  placeholder="Author Bio"
                  value={author.bio}
                  onChange={(e) =>
                    setAuthor({ ...author, bio: e.target.value })
                  }
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Birth Date</legend>
                <input
                  type="date"
                  className="input input-primary"
                  value={
                    author.birthDate
                      ? new Date(author.birthDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setAuthor({
                      ...author,
                      birthDate: new Date(e.target.value),
                    })
                  }
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Nationality</legend>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Nationality"
                  value={author.nationality}
                  onChange={(e) =>
                    setAuthor({ ...author, nationality: e.target.value })
                  }
                />
              </fieldset>
              <button
                className="btn btn-secondary lg:mt-8.5"
                onClick={handleAddAuthor}
              >
                Add Author +
              </button>
            </div>
            {newResource.authors.length > 0 && (
              <table className="table table-zebra w-full mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Author Name</th>
                    <th>Bio</th>
                    <th>Birth Date</th>
                    <th>Nationality</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newResource.authors.map((a, i) => (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>{a.name}</td>
                      <td>{a.bio || "N/A"}</td>
                      <td>
                        {a.birthDate
                          ? new Date(a.birthDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td>{a.nationality || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() =>
                            setNewResource({
                              ...newResource,
                              authors: newResource.authors.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                        >
                          <IconTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Categories */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Categories</legend>
              <input
                type="text"
                className="input input-primary w-full"
                placeholder="Science, AI, History"
                value={newResource.categories?.join(", ")}
                onChange={(e) => {
                  const categories = e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0);
                  setNewResource({
                    ...newResource,
                    categories,
                  });
                }}
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-primary w-full"
                placeholder="Enter description..."
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  })
                }
              />
            </fieldset>

            {/* Footer */}
            <div className="flex gap-4 justify-end mt-4">
              <button className="btn btn-primary" onClick={handleSaveResource}>
                Save Resource
              </button>
              <button
                className="btn btn-outline"
                onClick={() =>
                  (
                    document.getElementById(
                      "add-resource-modal"
                    ) as HTMLDialogElement
                  ).close()
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
