"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { ScholarshipApplication } from "@/Types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScholarshipPage() {
  const [scholarshipApplications, setScholarshipApplications] = useState<
    ScholarshipApplication[]
  >([]);
  const [searchParams, setSearchParams] = useState({
    reason: "",
    status: "",
    dateFrom: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScholarshipApplications = async () => {
    try {
      const response = await fetch("/api/scholarships/student");
      const data = await response.json();
      setScholarshipApplications(data);
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
    const matchesReason = application.reasonForScholarship
      .toLowerCase()
      .includes(searchParams.reason.toLowerCase());
    const matchesStatus = searchParams.status
      ? application.status === searchParams.status
      : true;
    return matchesReason && matchesStatus;
  });

  return (
    <>
      <SectionTitle title="Scholarship Applications" />
      <div className="flex flex-row gap-4 px-10">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Scholarship Reason <span className="text-error">*</span>
          </legend>
          <input
            type="text"
            placeholder="Enter Reason"
            value={searchParams.reason}
            onChange={(e) =>
              setSearchParams({ ...searchParams, reason: e.target.value })
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
        <Link
          href={"/student/scholarships/apply-scholarship"}
          className="btn btn-primary lg:mt-8.25"
        >
          Apply for Scholarship
        </Link>
      </div>
      <div className="overflow-x-auto px-10 mb-10 mt-6">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Reason</th>
              <th>Annual Family Income</th>
              <th>Principal Review</th>
              <th>Admin Review</th>
              <th>Status</th>
              <th>Granted</th>
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
                          application.granted.date
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
