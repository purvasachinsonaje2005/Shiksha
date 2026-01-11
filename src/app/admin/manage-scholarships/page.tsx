"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { ScholarshipApplication } from "@/Types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ScholarshipPage() {
  const [scholarshipApplications, setScholarshipApplications] = useState<
    ScholarshipApplication[]
  >([]);
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    studentName: "",
    schoolName: "",
    status: "",
    dateFrom: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const schoolNames = Array.from(
    new Set(
      scholarshipApplications.map((application) => application.school.name)
    )
  );

  const fetchScholarshipApplications = async () => {
    try {
      const response = await fetch("/api/scholarships/admin");
      const data = await response.json();
      setScholarshipApplications(data.scholarships);
    } catch (error) {
      console.error("Error fetching scholarship applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarshipApplications();
  }, []);

  if (loading) return <Loading />;

  const filteredApplications = scholarshipApplications.filter((application) => {
    const matchesStudentName = application.student.name
      .toLowerCase()
      .includes(searchParams.studentName.toLowerCase());
    const matchesStatus = searchParams.status
      ? application.status === searchParams.status
      : true;
    return matchesStudentName && matchesStatus;
  });

  const handleActionChange = async (applicationId: string, action: string) => {
    if (!applicationId) return;
    if (action === "Admin Review") {
      router.push(
        `/admin/manage-scholarships/view-scholarship?applicationId=${applicationId}`
      );
    } else {
      const review = prompt("Enter remarks for " + action + ":");
      const amount =
        action === "Granted" ? prompt("Enter amount granted:") : null;
      if (!review || (action === "Granted" && !amount)) return;
      try {
        await axios.post("/api/scholarships/admin/review", {
          applicationId,
          action,
          remarks: review,
          amountGranted: amount,
        });
        toast.success("Action submitted successfully");
        fetchScholarshipApplications();
      } catch (error) {
        console.error("Error submitting action:", error);
        toast.error("Failed to submit action");
      }
    }
  };

  return (
    <>
      <SectionTitle title="Manage Scholarship Applications" />
      <div className="flex flex-row gap-4 px-10">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            School Name <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={searchParams.schoolName}
            onChange={(e) =>
              setSearchParams({ ...searchParams, schoolName: e.target.value })
            }
          >
            <option value="">Select School</option>
            {schoolNames.map((schoolName) => (
              <option key={schoolName} value={schoolName}>
                {schoolName}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Student Name <span className="text-error">*</span>
          </legend>
          <input
            type="text"
            placeholder="Enter Student Name"
            value={searchParams.studentName}
            onChange={(e) =>
              setSearchParams({ ...searchParams, studentName: e.target.value })
            }
            className="input input-primary w-full"
          />
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Application Status <span className="text-error">*</span>
          </legend>
          <select
            className="select select-primary w-full"
            value={searchParams.status}
            onChange={(e) =>
              setSearchParams({ ...searchParams, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            {[
              "Submitted",
              "Principal Review",
              "Principal Approved",
              "Principal Rejected",
              "Admin Review",
              "Admin Approved",
              "Admin Rejected",
              "Granted",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      <div className="overflow-x-auto px-10 mb-10 mt-6">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Reason</th>
              <th>Annual Family Income</th>
              <th>Principal Review</th>
              <th>Admin Review</th>
              <th>Status</th>
              <th>Granted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No scholarship applications found.
                </td>
              </tr>
            ) : (
              filteredApplications.map((application, index) => (
                <tr key={application._id}>
                  <th>{index + 1}</th>
                  <td>{application.student.name}</td>
                  <td>{application.class?.name}</td>
                  <td>{application.reasonForScholarship}</td>
                  <td>{application.annualFamilyIncome}</td>
                  <td>
                    {application.principalReview?.remarks || "No remarks"}
                  </td>
                  <td>{application.adminReview?.remarks || "No remarks"}</td>
                  <td>{application.status}</td>
                  <td>
                    {application.granted.isGranted ? (
                      <span>
                        {application.granted.amountGranted} on{" "}
                        {new Date(
                          application.granted.grantDate
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td>
                    {application.adminReview ? (
                      <span>Reviewed</span>
                    ) : (
                      <select
                        className="select select-primary w-full"
                        onChange={(e) =>
                          handleActionChange(application._id!, e.target.value)
                        }
                      >
                        <option value="">Take Action</option>
                        {["Admin Review", "Admin Rejected", "Granted"].map(
                          (action) => (
                            <option key={action} value={action}>
                              {action}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
