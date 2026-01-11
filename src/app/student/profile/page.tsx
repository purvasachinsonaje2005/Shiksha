"use client";

import { useAuth } from "@/context/AuthContext";
import SectionTitle from "@/components/SectionTitle";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Student } from "@/Types";
import Loading from "@/components/Loading";

function toDateInputValue(date?: string | Date | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function StudentProfilePage() {
  const { user } = useAuth() as { user?: Student | null };
  const [loadingSave, setLoadingSave] = useState(false);

  const handleChange = (field: keyof Student, value: any) => {
    if (!user) return;
    (user as any)[field] = value;
  };

  const handleNested = (fields: string[], value: any) => {
    if (!user) return;
    let obj: any = user;
    for (let i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  };

  if (!user) {
    return (
      <>
        <SectionTitle title="My Profile" />
        <div className="p-6 max-w-3xl mx-auto">
          <p className="text-center text-base-content/50">
            No user found. Please login.
          </p>
        </div>
      </>
    );
  }

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      await axios.put(`/api/students/update?id=${user._id}`, { user });
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoadingSave(false);
    }
  };

  if (loadingSave) return <Loading />;

  return (
    <>
      <SectionTitle title="My Profile" />
      <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-lg shadow space-y-6">
        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center space-y-3">
          {user.profileImage ? (
            <img
              src={`data:${user.profileImage.contentType};base64,${Buffer.from(
                user.profileImage.data
              ).toString("base64")}`}
              alt="Profile"
              className="rounded-full border h-28 w-28 object-cover border-primary"
            />
          ) : (
            <div className="rounded-full border h-28 w-28 flex items-center justify-center border-primary text-lg">
              No Image
            </div>
          )}

          {/* Upload new image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("profileImage", e.target.files?.[0])}
            className="file-input file-input-primary w-full max-w-xs"
          />
        </div>

        {/* Identification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Student ID</legend>
            <p className="input input-primary w-full bg-base-100">
              {user.studentId}
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <p className="input input-primary w-full bg-base-100">
              {user.email}
            </p>
          </fieldset>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Full Name</legend>
            <input
              value={user.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Phone</legend>
            <input
              value={user.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Date of Birth</legend>
            <input
              type="date"
              value={toDateInputValue(user.dateOfBirth)}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="input input-primary w-full"
            />
          </fieldset>

          {/* Gender (ENUM) */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <select
              value={user.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="select select-primary w-full"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </fieldset>
        </div>

        {/* ENUM FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Address (Urban/Rural)</legend>
            <select
              value={user.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="select select-primary w-full"
            >
              <option value="U">Urban</option>
              <option value="R">Rural</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Reason for Choosing School
            </legend>
            <select
              value={user.reasonForChoosingSchool}
              onChange={(e) =>
                handleChange("reasonForChoosingSchool", e.target.value)
              }
              className="select select-primary w-full"
            >
              <option value="course">Course</option>
              <option value="home">Close to Home</option>
              <option value="reputation">Reputation</option>
              <option value="other">Other</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Guardian</legend>
            <select
              value={user.guardian}
              onChange={(e) => handleChange("guardian", e.target.value)}
              className="select select-primary w-full"
            >
              <option value="mother">Mother</option>
              <option value="father">Father</option>
              <option value="other">Other</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Parental Status</legend>
            <select
              value={user.parentalStatus}
              onChange={(e) => handleChange("parentalStatus", e.target.value)}
              className="select select-primary w-full"
            >
              <option value="T">Together</option>
              <option value="A">Apart</option>
            </select>
          </fieldset>

          {/* yes/no enums */}
          {[
            "attendedNursery",
            "extraPaidClasses",
            "familySupport",
            "internetAccess",
            "extraCurricularActivities",
            "inRelationship",
          ].map((field) => (
            <fieldset className="fieldset capitalize" key={field}>
              <legend className="fieldset-legend">
                {field.replace(/([A-Z])/g, " $1")}
              </legend>
              <select
                value={user[field]}
                onChange={(e) => handleChange(field as any, e.target.value)}
                className="select select-primary w-full"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </fieldset>
          ))}

          {/* Family Size */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Family Size</legend>
            <select
              value={user.familySize}
              onChange={(e) => handleChange("familySize", e.target.value)}
              className="select select-primary w-full"
            >
              <option value="GT3">Greater than 3</option>
              <option value="LE3">3 or Less</option>
            </select>
          </fieldset>
        </div>

        {/* Numeric ML Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "finalGrade",
            "grade2",
            "grade1",
            "numberOfFailures",
            "familyRelationship",
            "freeTime",
            "goingOut",
            "age",
            "weekdayAlcoholConsumption",
            "weekendAlcoholConsumption",
            "motherEducation",
            "fatherEducation",
            "healthStatus",
            "studyTime",
            "travelTime",
          ].map((field) => (
            <fieldset className="fieldset capitalize" key={field}>
              <legend className="fieldset-legend">
                {field.replace(/([A-Z])/g, " $1")}
              </legend>
              <input
                type="number"
                value={(user as any)[field] ?? ""}
                onChange={(e) =>
                  handleChange(field as any, Number(e.target.value))
                }
                className="input input-primary w-full"
              />
            </fieldset>
          ))}
        </div>

        {/* Parent Details */}
        <div>
          <h3 className="font-semibold mb-2">Parent Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Father */}
            {["name", "email", "occupation", "educationLevel"].map((key) => (
              <fieldset className="fieldset" key={"father-" + key}>
                <legend className="fieldset-legend">Father - {key}</legend>
                <input
                  type={key === "educationLevel" ? "number" : "text"}
                  value={user.father[key] ?? ""}
                  onChange={(e) =>
                    handleNested(
                      ["father", key],
                      key === "educationLevel"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                  className="input input-primary w-full"
                />
              </fieldset>
            ))}

            {/* Mother */}
            {["name", "email", "occupation", "educationLevel"].map((key) => (
              <fieldset className="fieldset" key={"mother-" + key}>
                <legend className="fieldset-legend">Mother - {key}</legend>
                <input
                  type={key === "educationLevel" ? "number" : "text"}
                  value={user.mother[key] ?? ""}
                  onChange={(e) =>
                    handleNested(
                      ["mother", key],
                      key === "educationLevel"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                  className="input input-primary w-full"
                />
              </fieldset>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={loadingSave}
          >
            {loadingSave ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
