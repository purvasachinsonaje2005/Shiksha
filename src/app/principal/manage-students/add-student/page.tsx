"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SectionTitle from "@/components/SectionTitle";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Class } from "@/Types";

const Title = ({ title }: { title: string }) => (
  <div className="bg-primary/30 p-4 rounded-t-lg mt-8 mb-0">
    <h3 className="text-lg font-semibold uppercase">{title}</h3>
    <hr />
  </div>
);

const SubTitle = ({ title }: { title: string }) => (
  <h4 className="text-md font-semibold border-b text-center pt-2 bg-primary/20">
    {title}
  </h4>
);

const Grid = ({ children, cols = 3 }: any) => (
  <div className={`grid grid-cols-1 lg:grid-cols-${cols} gap-4 py-2`}>
    {children}
  </div>
);

const dropdown = (value: string, setter: any, options: any[]) => (
  <select
    className="select select-primary w-full capitalize"
    value={value}
    onChange={(e) => setter(e.target.value)}
  >
    <option value="">Select</option>
    {options.map((v) => (
      <option key={v} value={v}>
        {v}
      </option>
    ))}
  </select>
);

export default function AddStudent() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [student, setStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    age: 0,
    fatherName: "",
    fatherEmail: "",
    fatherOccupation: "",
    fatherEducationLevel: "",
    motherName: "",
    motherEmail: "",
    motherOccupation: "",
    motherEducationLevel: "",
    finalGrade: "",
    grade2: "",
    grade1: "",
    guardian: "",
    parentalStatus: "",
    attendedNursery: "",
    familySupport: "",
    extraPaidClasses: "",
    numberOfFailures: "",
    wantsHigherEducation: "",
    familyRelationship: "",
    freeTime: "",
    goingOut: "",
    weekdayAlcoholConsumption: "",
    weekendAlcoholConsumption: "",
    reasonForChoosingSchool: "",
    gender: "",
    internetAccess: "",
    extraCurricularActivities: "",
    inRelationship: "",
    familySize: "",
    image: null,
    class: "",
  });

  const validateStudent = () => {
    const requiredFields = [
      "studentId",
      "name",
      "email",
      "phone",
      "dateOfBirth",
      "password",
      "gender",
      "address",
      "reasonForChoosingSchool",
      "internetAccess",
      "extraCurricularActivities",
      "inRelationship",
      "familySize",
      "wantsHigherEducation",
      "finalGrade",
      "grade2",
      "grade1",
      "age",
      "studyTime",
      "travelTime",
      "freeTime",
      "goingOut",
      "weekdayAlcoholConsumption",
      "weekendAlcoholConsumption",
      "healthStatus",
      "fatherName",
      "fatherOccupation",
      "motherName",
      "motherOccupation",
      "guardian",
      "parentalStatus",
      "attendedNursery",
      "familySupport",
      "extraPaidClasses",
      "class",
    ];

    for (let field of requiredFields) {
      // @ts-ignore
      if (!student[field]) {
        toast.error(`Missing required field: ${field}`);
        return false;
      }
    }

    if (student.phone.length !== 10) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleAddStudent = async () => {
    if (!validateStudent()) {
      return;
    }
    try {
      setLoading(true);
      const res = axios.postForm(
        "/api/principal/students/add-student",
        student
      );
      toast.promise(res, {
        loading: "Adding Student...",
        success: () => {
          window.location.reload();
          return "Student Added Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/principal/classes");
      setClasses(res.data.classes);
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <>
      <SectionTitle title="Add New Student" />
      <div className="max-w-7xl mx-auto px-10 pb-4">
        {/* BASIC INFORMATION */}
        <Title title="Student Information" />
        <SubTitle title="Basic Information" />
        <Grid>
          {/* Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Student Name <span className="text-error">*</span>
            </legend>
            <input
              className="input input-primary w-full"
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
            />
          </fieldset>

          {/* Student ID */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Student ID <span className="text-error">*</span>
            </legend>
            <input
              className="input input-primary w-full"
              value={student.studentId}
              onChange={(e) =>
                setStudent({ ...student, studentId: e.target.value })
              }
            />
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Email <span className="text-error">*</span>
            </legend>
            <input
              type="email"
              className="input input-primary w-full"
              value={student.email}
              onChange={(e) =>
                setStudent({
                  ...student,
                  email: e.target.value.toLowerCase(),
                })
              }
            />
          </fieldset>

          {/* Phone */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Phone <span className="text-error">*</span>
            </legend>
            <input
              className="input input-primary w-full"
              value={student.phone}
              onChange={(e) =>
                setStudent({
                  ...student,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
            />
          </fieldset>

          {/* DOB */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Date of Birth <span className="text-error">*</span>
            </legend>
            <input
              type="date"
              className="input input-primary w-full"
              value={student.dateOfBirth}
              onChange={(e) => {
                setStudent({ ...student, dateOfBirth: e.target.value });
                // Calculate age and set
                const birthDate = new Date(e.target.value);
                const ageDifMs = Date.now() - birthDate.getTime();
                const ageDate = new Date(ageDifMs);
                const age = Number(Math.abs(ageDate.getUTCFullYear() - 1970));
                setStudent({ ...student, dateOfBirth: e.target.value, age });
              }}
            />
          </fieldset>

          {/* Gender */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Gender <span className="text-error">*</span>
            </legend>
            <select
              value={student.gender}
              onChange={(e) =>
                setStudent({ ...student, gender: e.target.value })
              }
              className="select select-primary w-full"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </fieldset>
        </Grid>

        {/* PASSWORD */}
        <SubTitle title="Login Credentials" />
        <Grid cols={2}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Password <span className="text-error">*</span>
            </legend>

            <div className="join">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="input input-primary w-full"
                value={student.password}
                onChange={(e) =>
                  setStudent({ ...student, password: e.target.value })
                }
              />
              <button
                type="button"
                className="btn join-item btn-square"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </fieldset>

          {/* Image */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Profile Image</legend>
            <input
              type="file"
              className="file-input file-input-primary w-full"
              onChange={(e) =>
                setStudent({
                  ...student,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
            />
          </fieldset>
        </Grid>

        {/* PARENT INFO */}
        <Title title="Parent Information" />
        <SubTitle title="Father" />

        <Grid>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Name <span className="text-error">*</span>
            </legend>
            <input
              className="input input-primary w-full"
              value={student.fatherName}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherName: e.target.value,
                })
              }
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Occupation <span className="text-error">*</span>
            </legend>
            <select
              value={student.fatherOccupation}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherOccupation: e.target.value,
                })
              }
              className="select select-primary w-full"
            >
              <option value="">Select Occupation</option>
              <option value="at_home">At Home</option>
              <option value="teacher">Teacher</option>
              <option value="services">Services</option>
              <option value="health">Health Care</option>
              <option value="teacher">Teacher</option>
              <option value="other">Other</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              className="input input-primary w-full"
              value={student.fatherEmail}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherEmail: e.target.value,
                })
              }
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Education Level (0–4)</legend>
            {dropdown(
              student.fatherEducationLevel,
              (v: any) =>
                setStudent({
                  ...student,
                  fatherEducationLevel: v,
                }),
              ["0", "1", "2", "3", "4"]
            )}
          </fieldset>
        </Grid>

        <SubTitle title="Mother" />
        <Grid>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Name <span className="text-error">*</span>
            </legend>
            <input
              className="input input-primary w-full"
              value={student.motherName}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherName: e.target.value,
                })
              }
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Occupation <span className="text-error">*</span>
            </legend>
            <select
              value={student.motherOccupation}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherOccupation: e.target.value,
                })
              }
              className="select select-primary w-full"
            >
              <option value="">Select Occupation</option>
              <option value="at_home">At Home</option>
              <option value="teacher">Teacher</option>
              <option value="services">Services</option>
              <option value="health">Health Care</option>
              <option value="teacher">Teacher</option>
              <option value="other">Other</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              className="input input-primary w-full"
              value={student.motherEmail}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherEmail: e.target.value,
                })
              }
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Education Level (0–4)</legend>
            {dropdown(
              student.motherEducationLevel,
              (v: any) =>
                setStudent({
                  ...student,
                  motherEducationLevel: v,
                }),
              ["0", "1", "2", "3", "4"]
            )}
          </fieldset>
        </Grid>

        <SubTitle title="Family Details" />
        <Grid cols={2}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Guardian <span className="text-error">*</span>
            </legend>
            <select
              className="select select-primary w-full"
              value={student.guardian}
              onChange={(e) =>
                setStudent({ ...student, guardian: e.target.value })
              }
            >
              <option value="">Select Guardian</option>
              <option value="mother">Mother</option>
              <option value="father">Father</option>
              <option value="other">Other</option>
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Parental Status <span className="text-error">*</span>
            </legend>
            <select
              className="select select-primary w-full"
              value={student.parentalStatus}
              onChange={(e) =>
                setStudent({ ...student, parentalStatus: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="T">Together</option>
              <option value="A">Apart</option>
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Attended Nursery <span className="text-error">*</span>
            </legend>
            {dropdown(
              student.attendedNursery,
              (v: any) => setStudent({ ...student, attendedNursery: v }),
              ["yes", "no"]
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Family Support <span className="text-error">*</span>
            </legend>
            {dropdown(
              student.familySupport,
              (v: any) => setStudent({ ...student, familySupport: v }),
              ["yes", "no"]
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Extra Paid Classes <span className="text-error">*</span>
            </legend>
            {dropdown(
              student.extraPaidClasses,
              (v: any) => setStudent({ ...student, extraPaidClasses: v }),
              ["yes", "no"]
            )}
          </fieldset>
        </Grid>
        {/* ACADEMIC INFO */}
        <Title title="Academic Information" />

        <Grid>
          {[
            { grade1: "Grade 1 (0–20)" },
            { grade2: "Grade 2 (0–20)" },
            { finalGrade: "Final Grade (0–20)" },
          ].map((g, index) => (
            <fieldset key={index} className="fieldset">
              <legend className="fieldset-legend">
                {Object.values(g)[0]} <span className="text-error">*</span>
              </legend>
              <input
                type="number"
                className="input input-primary w-full"
                value={(student as any)[Object.keys(g)[0]]}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    [Object.keys(g)[0]]: e.target.value,
                  })
                }
              />
            </fieldset>
          ))}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Number of Failures (0 - 4){" "}
            </legend>
            <input
              type="number"
              className="input input-primary w-full"
              value={student.numberOfFailures}
              onChange={(e) =>
                setStudent({ ...student, numberOfFailures: e.target.value })
              }
            />
          </fieldset>
        </Grid>

        {/* BEHAVIOR INFO */}
        <Title title="Behavior & Lifestyle" />

        <Grid>
          {/* YES/NO */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Wants Higher Education *
            </legend>
            {dropdown(
              student.wantsHigherEducation,
              (v: any) => setStudent({ ...student, wantsHigherEducation: v }),
              ["yes", "no"]
            )}
          </fieldset>

          {/* Enum dropdowns 1–5 */}
          {[
            ["familyRelationship", "Family Relationship (1–5) Rate"],
            ["freeTime", "Free Time (1–5) Rate"],
            ["goingOut", "Going Out (1–5) Rate"],
            ["weekdayAlcoholConsumption", "Weekday Alcohol (1–5) Rate"],
            ["weekendAlcoholConsumption", "Weekend Alcohol (1–5) Rate"],
            ["healthStatus", "Health Status (1–5) Rate"],
          ].map(([key, label]) => (
            <fieldset key={key} className="fieldset">
              <legend className="fieldset-legend">{label}</legend>
              {dropdown(
                (student as any)[key],
                (v: any) => setStudent({ ...student, [key]: v }),
                ["1", "2", "3", "4", "5"]
              )}
            </fieldset>
          ))}

          {/* 1–4 dropdowns */}
          {[
            ["studyTime", "Study Time (1–4) Hours"],
            ["travelTime", "Travel Time (1–4) Hours"],
          ].map(([key, label]) => (
            <fieldset key={key} className="fieldset">
              <legend className="fieldset-legend">{label}</legend>
              {dropdown(
                (student as any)[key],
                (v: any) => setStudent({ ...student, [key]: v }),
                ["1", "2", "3", "4"]
              )}
            </fieldset>
          ))}
        </Grid>

        {/* EXTRA INFO */}
        <Title title="Additional Information" />

        <Grid>
          {/* Dropdown enums */}
          {[
            ["address", "Address (Urban/Rural)", ["U", "R"]],
            [
              "reasonForChoosingSchool",
              "Reason For Choosing School",
              ["course", "home", "reputation", "other"],
            ],
            ["internetAccess", "Internet Access", ["yes", "no"]],
            [
              "extraCurricularActivities",
              "Extra Curricular Activities",
              ["yes", "no"],
            ],
            ["inRelationship", "In Relationship", ["yes", "no"]],
            [
              "familySize",
              "Family Size (Greater Than 3 / Less or Equal to 3)",
              ["GT3", "LE3"],
            ],
          ].map(([key, label, opts]: any) => (
            <fieldset className="fieldset" key={key}>
              <legend className="fieldset-legend">
                {label} <span className="text-error">*</span>
              </legend>
              {dropdown(
                (student as any)[key],
                (v: any) => setStudent({ ...student, [key]: v }),
                opts
              )}
            </fieldset>
          ))}
        </Grid>

        {/* CLASS */}
        <Title title="Class Assignment" />
        <Grid cols={2}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Assign Class <span className="text-error">*</span>
            </legend>
            <select
              className="select select-primary w-full"
              value={student.class}
              onChange={(e) =>
                setStudent({ ...student, class: e.target.value })
              }
            >
              <option value="">Select Class</option>
              {classes.map((cls: any) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </fieldset>
        </Grid>

        <button
          className={`btn btn-primary ${loading ? "loading" : ""} w-full mt-8`}
          onClick={handleAddStudent}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </>
  );
}
