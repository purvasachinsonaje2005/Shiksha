"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SectionTitle from "@/components/SectionTitle";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

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

const GridWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => <div className={`grid grid-cols-1 ${className} gap-4`}>{children}</div>;

export default function AddTeacher() {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    image: null as File | null,
    password: "",
    qualifications: "",
  });

  const handleAddTeacher = async () => {
    if (
      !teacher.name ||
      !teacher.email ||
      !teacher.phone ||
      !teacher.password ||
      !teacher.image
    ) {
      toast.error(
        `Remaining Fields: ${!teacher.name ? "teacher Name, " : ""}${
          !teacher.email ? "Email, " : ""
        }${!teacher.phone ? "Phone, " : ""}${
          !teacher.password ? "Password, " : ""
        }${!teacher.image ? "teacher Image" : ""}
        }`.slice(0, -2)
      );
      return;
    }
    try {
      setLoading(true);
      const res = axios.postForm(
        "/api/principal/teachers/add-teacher",
        teacher
      );
      toast.promise(res, {
        loading: "Adding Teacher...",
        success: () => {
          window.location.reload();
          return "Teacher Added Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionTitle title="Add New teacher" />
      <div className="max-w-7xl mx-auto px-10">
        <Title title="teacher Information" />
        <SubTitle title="Basic Information" />
        <div className="py-4 space-y-5">
          <GridWrapper className="lg:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Teacher Name <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Teacher Name"
                value={teacher.name}
                onChange={(e) =>
                  setTeacher({ ...teacher, name: e.target.value })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Teacher Email
                <span className="text-error">*</span>
              </legend>
              <input
                type="email"
                className="input w-full"
                placeholder="Enter Teacher Email"
                value={teacher.email}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    email: e.target.value.toLowerCase(),
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Contact Number
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Contact Number"
                value={teacher.phone}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    phone:
                      e.target.value.length <= 10
                        ? e.target.value
                        : teacher.phone,
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Teacher Qualification <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Teacher Qualification"
                value={teacher.qualifications}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    qualifications: e.target.value,
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Teacher Password <span className="text-error">*</span>
              </legend>
              <div className="join">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  className="input w-full"
                  placeholder="Enter Teacher Password"
                  value={teacher.password}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-square join-item"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Teacher Profile Image <span className="text-error">*</span>
              </legend>
              <input
                type="file"
                className="file-input file-input-bordered join-item w-full"
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    image: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
            </fieldset>
          </GridWrapper>
          <button
            className={`btn btn-primary ${
              loading ? "loading" : ""
            } w-full mt-6`}
            onClick={handleAddTeacher}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Teacher"}
          </button>
        </div>
      </div>
    </>
  );
}
