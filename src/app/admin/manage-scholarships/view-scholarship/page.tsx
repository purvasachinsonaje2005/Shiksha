"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { ScholarshipApplication } from "@/Types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScholarshipPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [applicationDetails, setApplicationDetails] =
    useState<ScholarshipApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplicationDetails = async () => {
    try {
      const response = await fetch(
        `/api/scholarships?applicationId=${applicationId}`
      );
      const data = await response.json();
      setApplicationDetails(data.application);
    } catch (error) {
      console.error("Error fetching application details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) fetchApplicationDetails();
  }, [applicationId]);

  if (loading || !applicationDetails) return <Loading />;

  const app = applicationDetails;

  return (
    <>
      <SectionTitle title="Scholarship Application Details" />

      <div className="p-4 md:p-6 space-y-6">
        {/* General Info */}
        <fieldset className="fieldset border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend font-semibold text-lg">
            Application Info
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
            <div>
              <p className="font-semibold">Student:</p>
              <p>{app.student?.name || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">School:</p>
              <p>{`${app.school?.name} ${app.school?.address}` || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">Class:</p>
              <p>{app.class?.name || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">Status:</p>
              <p className="badge badge-primary">{app.status}</p>
            </div>
          </div>
        </fieldset>

        {/* Scholarship Details */}
        <fieldset className="fieldset border border-base-300 p-4 rounded-box text-base">
          <legend className="fieldset-legend font-semibold text-lg">
            Scholarship Details
          </legend>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-semibold">Reason for Scholarship:</p>
              <p>{app.reasonForScholarship}</p>
            </div>

            <div>
              <p className="font-semibold">Annual Family Income:</p>
              <p>₹ {app.annualFamilyIncome.toLocaleString()}</p>
            </div>
          </div>
        </fieldset>

        {/* Supporting Documents */}
        <fieldset className="fieldset border border-base-300 p-4 rounded-box text-base">
          <legend className="fieldset-legend font-semibold text-lg">
            Supporting Documents
          </legend>

          {app.supportingDocuments?.length > 0 ? (
            <ul className="space-y-2">
              {app.supportingDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{doc.fileType}</span>
                  <a
                    href={doc.url}
                    target="_blank"
                    className="btn btn-sm btn-outline"
                  >
                    View Document
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded.</p>
          )}
        </fieldset>

        {/* Principal Review */}
        {app.principalReview?.reviewedBy && (
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend font-semibold text-lg">
              Principal Review
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Reviewed By:</p>
                <p>{app.principalReview.reviewedBy.name}</p>
              </div>

              <div>
                <p className="font-semibold">Date:</p>
                <p>{new Date(app.principalReview.date).toLocaleString()}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold">Remarks:</p>
                <p>{app.principalReview.remarks}</p>
              </div>
            </div>
          </fieldset>
        )}

        {/* Admin Review */}
        {(app.adminReview?.remarks || app.adminReview?.date) && (
          <fieldset className="fieldset border border-base-300 p-4 rounded-box text-base">
            <legend className="fieldset-legend font-semibold text-lg">
              Admin Review
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Date:</p>
                <p>
                  {app.adminReview.date
                    ? new Date(app.adminReview.date).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold">Remarks:</p>
                <p>{app.adminReview.remarks || "N/A"}</p>
              </div>
            </div>
          </fieldset>
        )}

        {/* Grant Details */}
        {app.granted?.isGranted && (
          <fieldset className="fieldset border border-base-300 p-4 rounded-box text-base">
            <legend className="fieldset-legend font-semibold text-lg">
              Granted Details
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Amount Granted:</p>
                <p>₹ {app.granted.amountGranted?.toLocaleString()}</p>
              </div>

              <div>
                <p className="font-semibold">Grant Date:</p>
                <p>{new Date(app.granted.date).toLocaleString()}</p>
              </div>
            </div>
          </fieldset>
        )}
      </div>
    </>
  );
}
