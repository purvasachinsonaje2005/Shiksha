"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import SectionTitle from "@/components/SectionTitle";
import { Principal, School } from "@/Types";
export default function CompanySettingsPage() {
  const { user } = useAuth() as { user: Principal };
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<{
    school: School;
    principal: Principal;
  }>({
    school: {} as School,
    principal: {} as Principal,
  });

  useEffect(() => {
    if (user) {
      console.log("Prefilling form with user data:", user);
      setFormData({
        school: {
          ...user,
        },
        principal: user.principal,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    try {
      const res = axios.put("/api/principal/update", { ...formData });
      toast.promise(res, {
        loading: "Updating Profile...",
        success: "Profile Updated Successfully",
        error: "Failed to update profile",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <>
      <SectionTitle title="Manage Your Profile" />
      <div className="max-w-7xl mx-auto p-6 bg-base-200 rounded-lg shadow space-y-3">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-3">
          {formData.school.logo && (
            <img
              src={`data:${
                formData.school.logo.contentType
              };base64,${Buffer.from(formData.school.logo.data).toString(
                "base64"
              )}`}
              alt="Profile"
              className="rounded-full border h-28 w-28 object-cover border-primary"
            />
          )}
          <div className="join">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-primary join-item w-full max-w-xs"
              onChange={(e) =>
                e.target.files && setProfileImage(e.target.files[0])
              }
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="py-2">
          <h3 className="font-semibold mb-2">School Information</h3>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* School Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">School Name</legend>
              <input
                value={formData.school.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      name: e.target.value,
                    },
                  })
                }
                placeholder="School Name"
                className="input input-primary w-full"
                required
              />
            </fieldset>
            {/* School Contact Number */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Contact Number</legend>
              <input
                value={formData.school.contactNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      contactNumber: e.target.value,
                    },
                  })
                }
                placeholder="Phone Number"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* School Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                value={formData.school.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="Email"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* School Registration ID */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">UDISE Number</legend>
              <input
                value={formData.school.registrationId || ""}
                placeholder="UDISE Number"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* Board */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Board</legend>
              <input
                value={formData.school.board || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      board: e.target.value,
                    },
                  })
                }
                placeholder="Board"
                className="input input-primary w-full"
              />
            </fieldset>
          </div>
        </div>

        {/* Address */}
        <div className="py-2">
          <h3 className="font-semibold mb-2">Address</h3>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Address Line */}
            <fieldset className="fieldset md:col-span-3">
              <legend className="fieldset-legend">Address Line</legend>
              <input
                value={formData.school.address || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      address: e.target.value,
                    },
                  })
                }
                placeholder="Address Line"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* City/Village */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">City/Village</legend>
              <input
                value={formData.school.village || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      village: e.target.value,
                    },
                  })
                }
                placeholder="City/Village"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* Taluka */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Taluka</legend>
              <input
                value={formData.school.taluka || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      taluka: e.target.value,
                    },
                  })
                }
                placeholder="Taluka"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* District */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">District</legend>
              <input
                value={formData.school.district || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      district: e.target.value,
                    },
                  })
                }
                placeholder="District"
                className="input input-primary w-full"
              />
            </fieldset>
            {/* State */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">State</legend>
              <input
                value={formData.school.state || ""}
                className="input input-primary w-full"
                readOnly
              />
            </fieldset>
            {/* Country */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Country</legend>
              <input
                value={formData.school.country || ""}
                className="input input-primary w-full"
                readOnly
              />
            </fieldset>
            {/* Pincode */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Pincode</legend>
              <input
                value={formData.school.pincode || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school: {
                      ...formData.school,
                      pincode: e.target.value,
                    },
                  })
                }
                placeholder="Pincode"
                className="input input-primary w-full"
              />
            </fieldset>
          </div>
        </div>

        {/* Principal */}
        <div className="py-2">
          <h3 className="font-semibold mb-2">Principal Information</h3>
          <hr />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Principal Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Principal Name</legend>
              <input
                value={formData.principal.name || ""}
                className="input input-primary w-full"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    principal: { ...formData.principal, name: e.target.value },
                  })
                }
              />
            </fieldset>
            {/* Principal Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Principal Email</legend>
              <input
                value={formData.principal.email || ""}
                readOnly
                className="input input-primary w-full"
              />
            </fieldset>
          </div>
        </div>

        {/* Password */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <div className="join">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={formData.principal.password || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  principal: {
                    ...formData.principal,
                    password: e.target.value,
                  },
                })
              }
              placeholder="New Password (leave blank to keep same)"
              className="input input-primary join-item w-full"
            />
            <button
              type="button"
              className="btn btn-square join-item"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <IconEyeOff size={20} />
              ) : (
                <IconEye size={20} />
              )}
            </button>
          </div>
        </fieldset>

        <button className="btn btn-primary w-full" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </>
  );
}
