"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import SectionTitle from "@/components/SectionTitle";
import { Teacher } from "@/Types";

export default function TeacherProfilePage() {
  const { user } = useAuth() as { user?: Teacher | null };

  return (
    <>
      <SectionTitle title="Manage Your Profile" />
      <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-lg shadow space-y-8">
        {/* Profile image */}
        <div className="flex flex-col items-center space-y-3">
          {user?.profileImage ? (
            <img
              src={`data:${user?.profileImage.contentType};base64,${Buffer.from(
                user?.profileImage.data
              ).toString("base64")}`}
              alt="Profile"
              className="rounded-full border h-28 w-28 object-cover border-primary"
            />
          ) : (
            <div className="rounded-full border h-28 w-28 flex items-center justify-center border-primary text-sm">
              No image
            </div>
          )}
        </div>

        {/* Basic grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input
              value={user?.name || ""}
              readOnly
              className="input input-primary w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Phone</legend>
            <input
              value={user?.phone || ""}
              className="input input-primary w-full"
              readOnly
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <p className="input input-primary w-full bg-base-100">
              {user?.email}
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Qualification</legend>
            <input
              value={user?.qualifications || ""}
              className="input input-primary w-full"
              readOnly
            />
          </fieldset>
        </div>
      </div>
    </>
  );
}
