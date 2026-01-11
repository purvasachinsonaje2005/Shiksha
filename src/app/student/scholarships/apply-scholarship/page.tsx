"use client";
import SectionTitle from "@/components/SectionTitle";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ScholarshipPage() {
  const [reasonForScholarship, setReasonForScholarship] = useState("");
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSupportingDocuments(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleSubmitApplication = async () => {
    try {
      const formData = new FormData();
      formData.append("reasonForScholarship", reasonForScholarship);
      formData.append("annualFamilyIncome", annualFamilyIncome);
      supportingDocuments.forEach((doc, idx) => {
        formData.append(`supportingDocument_${idx}`, doc);
      });
      setLoading(true);
      const response = await axios.post("/api/scholarships/apply", formData);
      toast.success("Scholarship application submitted successfully");
    } catch (error) {
      console.error("Error submitting scholarship application:", error);
      toast.error("Failed to submit scholarship application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionTitle title="Apply for Scholarship" />
      <div className="px-10">
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-lg font-semibold">
            Reason for Scholarship
          </legend>
          <textarea
            className="textarea textarea-primary w-full"
            placeholder="Explain the reason for applying"
            value={reasonForScholarship}
            onChange={(e) => setReasonForScholarship(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-lg font-semibold">
            Annual Family Income
          </legend>
          <input
            type="number"
            className="input input-primary w-full"
            placeholder="Enter annual family income"
            value={annualFamilyIncome}
            onChange={(e) => setAnnualFamilyIncome(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-lg font-semibold">
            Supporting Documents
          </legend>
          <input
            type="file"
            className="file-input file-input-primary w-full"
            multiple
            onChange={handleFileUpload}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {supportingDocuments.map((doc, idx) => (
              <div key={idx} className="border p-2 rounded-lg text-center">
                {doc.name}
              </div>
            ))}
          </div>
        </fieldset>

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmitApplication}
        >
          Submit Application
        </button>
      </div>
    </>
  );
}
