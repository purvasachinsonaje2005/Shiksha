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

  return (
    <>
      <SectionTitle title="My Profile" />
      <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-lg shadow space-y-6 mb-10">
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
            readOnly
            type="file"
            accept="image/*"
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
              readOnly
              value={user.name}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Phone</legend>
            <input
              readOnly
              value={user.phone}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Date of Birth</legend>
            <input
              readOnly
              type="date"
              value={toDateInputValue(user.dateOfBirth)}
              className="input input-primary w-full"
            />
          </fieldset>

          {/* Gender (ENUM) */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <input
              readOnly
              value={user.gender}
              className="input input-primary w-full"
            />
          </fieldset>
        </div>

        {/* ENUM FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Address (Urban/Rural)</legend>
            <input
              readOnly
              value={user.address}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Reason for Choosing School
            </legend>
            <input
              readOnly
              value={user.reasonForChoosingSchool}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Guardian</legend>
            <input
              readOnly
              value={user.guardian}
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Parental Status</legend>
            <input
              readOnly
              value={user.parentalStatus}
              className="input input-primary w-full"
            />
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
              <input
                readOnly
                value={(user as any)[field]}
                className="input input-primary w-full"
              />
            </fieldset>
          ))}

          {/* Family Size */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Family Size</legend>
            <input
              readOnly
              value={user.familySize}
              className="input input-primary w-full"
            />
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
                readOnly
                type="number"
                value={(user as any)[field] ?? ""}
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
                  readOnly
                  type={key === "educationLevel" ? "number" : "text"}
                  value={user.father[key as keyof typeof user.father] ?? ""}
                  className="input input-primary w-full"
                />
              </fieldset>
            ))}

            {/* Mother */}
            {["name", "email", "occupation", "educationLevel"].map((key) => (
              <fieldset className="fieldset" key={"mother-" + key}>
                <legend className="fieldset-legend">Mother - {key}</legend>
                <input
                  readOnly
                  type={key === "educationLevel" ? "number" : "text"}
                  value={user.mother[key as keyof typeof user.mother] ?? ""}
                  className="input input-primary w-full"
                />
              </fieldset>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
