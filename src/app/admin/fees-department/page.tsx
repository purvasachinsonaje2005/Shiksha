"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import toast from "react-hot-toast";
import { IconCurrencyRupee, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { Student } from "@/types/User";

const FindYear = (year: number) => {
  switch (year) {
    case 1:
      return "1st Year";
    case 2:
      return "2nd Year";
    case 3:
      return "3rd Year";
    case 4:
      return "4th Year";
    default:
      return `${year}th Year`;
  }
};

export default function FeesDepartmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [student, setStudent] = useState<Student>();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement;
        input?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = async () => {
    const res = axios.get(
      `/api/admin/students/find-student?query=${searchTerm}`
    );
    toast.promise(res, {
      loading: "Searching...",
      success: (res) => {
        setStudent(res.data.student);
        if (!res.data.student) {
          return "No student found";
        } else {
          return "Student found";
        }
      },
      error: (err) =>
        `Error: ${err.response.data.error || "Something went wrong"}`,
    });
  };

  const handleCashPayment = async () => {
    if (
      !amount ||
      Number(amount) <= 1000 ||
      Number(amount) > (student?.feeDetails?.outstandingFee || 0)
    ) {
      toast.error("Fees amount must be between ₹1000 and outstanding fee");
      return;
    }
    const res = axios.post("/api/fees/pay", {
      studentId: student?._id,
      amount: Number(amount),
      method: "Cash",
    });
    toast.promise(res, {
      loading: "Recording payment...",
      success: () => {
        window.location.reload();
        return "Payment recorded successfully";
      },
      error: (err) =>
        `Error: ${err.response.data.error || "Something went wrong"}`,
    });
  };

  return (
    <>
      <SectionTitle title="Fees Department" />
      <div className="p-4 max-w-3xl mx-auto">
        {/* Search */}
        <div className="flex gap-2 mb-4">
          <label className="input w-full">
            <IconSearch className="text-primary" size={16} />
            <input
              type="search"
              className="grow"
              placeholder="Enter Registration No / Enrollment No / Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <kbd className="kbd kbd-sm">⌘/ctrl</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
          <button className="btn btn-accent" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Student Info */}
        {student && (
          <div className="border p-4 rounded">
            <div className="card bg-base-300 w-full shadow-sm mx-auto">
              <figure className=" w-full overflow-hidden">
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="object-contain h-48 w-full"
                />
              </figure>
              <div className="card-body w-full">
                <h2 className="card-title text-center w-full flex flex-col md:flex-row gap-2 justify-between items-center">
                  <span>{student.name}</span>
                  <span>{student.email}</span>
                </h2>
                <p className="flex flex-col md:flex-row gap-2 justify-between items-center">
                  <span>
                    <strong>Registration No:</strong>{" "}
                    {student.registrationNumber}
                  </span>{" "}
                  <span>
                    <strong>Enrollment No:</strong> {student.enrollmentNumber}
                  </span>
                </p>
                <p className="flex flex-col md:flex-row gap-2 justify-between items-center">
                  <span>
                    <strong>Department:</strong>{" "}
                    {student.educationDetails?.graduation?.stream}
                  </span>
                  <span>
                    <strong>Year:</strong>{" "}
                    {FindYear(
                      Number(
                        student.educationDetails?.graduation?.currentYear
                      ) || 1
                    )}
                  </span>
                </p>
                <p className="flex flex-col md:flex-row gap-2 justify-between items-center">
                  <span>
                    <strong>Fee Per Year:</strong> ₹
                    {student.feeDetails?.feePerYear}
                  </span>
                  <span>
                    <strong>Outstanding:</strong> ₹
                    {student.feeDetails?.outstandingFee}
                  </span>
                </p>
              </div>
            </div>
            {/* Cash Payment */}
            <div className="join mt-2 w-full">
              <label className="input w-full join-item">
                <IconCurrencyRupee className="text-primary" size={16} />
                <input
                  type="number"
                  className="grow"
                  placeholder="Amount Received (Cash)"
                  min={1000}
                  max={student.feeDetails?.outstandingFee}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <button
                className="btn btn-success join-item"
                onClick={handleCashPayment}
              >
                Record Cash Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
