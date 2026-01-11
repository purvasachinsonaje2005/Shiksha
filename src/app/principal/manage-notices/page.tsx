"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { Notice } from "@/Types";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ManageNoticesPage() {
  const [searchTerm, setSearchTerm] = useState({
    title: "",
    date: "",
    school: "",
  });
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newNotice, setNewNotice] = useState<Notice>({
    title: "",
    content: "",
    tempImage: null,
    principal: user?.principal || "",
    school: user?._id || "",
    date: new Date(),
    tags: "",
  });

  const schools = Array.from(
    new Set(notices.map((notice) => notice.school.name))
  );

  const fetchNotices = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content || !newNotice.principal) {
      toast.error("Please fill in all required fields");
      return;
    }
    newNotice.principal = user?.principal._id || "";
    try {
      const res = axios.postForm("/api/notices/add-notice", newNotice);
      toast.promise(res, {
        loading: "Adding Notice...",
        success: () => {
          fetchNotices();
          (
            document.getElementById("addNewNotice") as HTMLDialogElement
          )?.close();
          setNewNotice({
            title: "",
            content: "",
            principal: user?.principal || "",
            school: user?._id || "",
            date: new Date(),
            tags: [],
          });
          return "Notice Added Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      console.error("Error adding notice:", error);
      toast.error("Failed to add notice");
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) {
      return;
    }
    try {
      const res = axios.delete(`/api/notices/delete-notice?id=${id}`);
      toast.promise(res, {
        loading: "Deleting Notice...",
        success: (data: AxiosResponse) => {
          fetchNotices();
          return "Notice Deleted Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  if (loading) return <Loading />;

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
        <button
          className="btn btn-primary lg:mt-7.25"
          onClick={() =>
            (
              document.getElementById("addNewNotice") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add New Notice
        </button>
      </div>
      {/* Display Notices */}
      <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice._id} className="card bg-base-300 w-96 shadow-sm">
              <img
                src={
                  `data:${notice.image?.contentType};base64,${Buffer.from(
                    notice.image?.data || ""
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
                {notice.principal.name === user?.principal.name && (
                  <div className="mt-2">
                    <button
                      className="btn btn-error w-full"
                      onClick={() => handleDeleteNotice(notice._id!)}
                    >
                      <IconTrash size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold uppercase text-center col-span-3">
            No notices found
          </p>
        )}
      </div>
      <dialog id="addNewNotice" className="modal">
        <Toaster />
        <div className="modal-box w-11/12 max-w-5xl rounded-lg border border-primary">
          <h3 className="font-bold text-lg uppercase text-center">
            Hello! {user?.name}
          </h3>
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Title<span className="text-error">*</span>
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  value={newNotice.title || ""}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                  required
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Image (optional)</legend>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input w-full"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewNotice({
                        ...newNotice,
                        tempImage: e.target.files[0],
                      });
                    }
                  }}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Author<span className="text-error">*</span>
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  value={newNotice.principal?.name || ""}
                  disabled
                />
              </fieldset>
            </div>
            <fieldset className="fieldset mb-4">
              <legend className="fieldset-legend">
                Content<span className="text-error">*</span>
              </legend>
              <textarea
                className="textarea w-full h-32"
                value={newNotice.content || ""}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, content: e.target.value })
                }
                required
              ></textarea>
            </fieldset>
            <fieldset className="fieldset mb-4">
              <legend className="fieldset-legend">Tags (optional)</legend>
              <input
                type="text"
                className="input w-full"
                value={newNotice.tags}
                onChange={(e) =>
                  setNewNotice({
                    ...newNotice,
                    tags: e.target.value,
                  })
                }
              />
            </fieldset>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                handleAddNotice();
              }}
            >
              Add Notice
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
