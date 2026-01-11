"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SectionTitle from "@/components/SectionTitle";
import { useSearchParams } from "next/navigation";
import { School } from "@/Types";

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

export default function EditSchool() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<School | null>(null);

  const handleEditSchool = async () => {
    try {
      setLoading(true);
      const res = axios.post("/api/admin/schools/edit-school", { school });
      toast.promise(res, {
        loading: "Editing School...",
        success: () => {
          window.location.reload();
          return "School Edited Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchool = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/schools/get-school?schoolId=${schoolId}`
      );
      setSchool(res.data.school!);
    } catch (error) {
      console.error("Error fetching school:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchSchool();
    }
  }, [schoolId]);

  return (
    <>
      <SectionTitle title="Add New School" />
      <div className="max-w-7xl mx-auto px-10">
        <Title title="School Information" />
        <SubTitle title="Basic Information" />
        <div className="py-4 space-y-5">
          <GridWrapper className="lg:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                School Name <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter School Name"
                value={school?.name}
                onChange={(e) =>
                  setSchool({ ...school!, name: e.target.value })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Registration ID <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter UDISE ID"
                value={school?.registrationId}
                onChange={(e) =>
                  setSchool({ ...school!, registrationId: e.target.value })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                School Email
                <span className="text-error">*</span>
              </legend>
              <input
                type="email"
                className="input w-full"
                placeholder="Enter School Email"
                value={school?.email}
                onChange={(e) =>
                  setSchool({ ...school!, email: e.target.value.toLowerCase() })
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
                value={school?.contactNumber}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    contactNumber:
                      e.target.value.length <= 10
                        ? e.target.value
                        : school?.contactNumber,
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Board Affiliation
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Board Affiliation"
                value={school?.board}
                onChange={(e) =>
                  setSchool({ ...school!, board: e.target.value })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Principal Name <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Principal Name"
                value={school?.principal.name}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    principal: { ...school!.principal, name: e.target.value },
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Principal Email <span className="text-error">*</span>
              </legend>
              <input
                type="email"
                className="input w-full"
                placeholder="Enter Principal Email"
                value={school?.principal.email}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    principal: {
                      ...school!.principal,
                      email: e.target.value.toLowerCase(),
                    },
                  })
                }
              />
            </fieldset>
          </GridWrapper>
          <SubTitle title="Address Information" />
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Address Line 1<span className="text-error">*</span>
            </legend>
            <textarea
              className="textarea w-full"
              placeholder="Enter Street"
              rows={1}
              value={school?.address}
              onChange={(e) =>
                setSchool({ ...school!, address: e.target.value })
              }
            />
          </fieldset>
          <GridWrapper className="md:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Village
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Village"
                value={school?.village}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    village:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Taluka
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Taluka"
                value={school?.taluka}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    taluka:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                District
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter District"
                value={school?.district}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    district:
                      e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1),
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                State
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter State"
                value={school?.state || "Maharashtra"}
                disabled
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    state: "Maharashtra",
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Country
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Country"
                value={school?.country || "India"}
                disabled
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    country: e.target.value,
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Pincode
                <span className="text-error">*</span>
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Pincode"
                value={school?.pincode}
                onChange={(e) =>
                  setSchool({
                    ...school!,
                    pincode:
                      e.target.value.length <= 6
                        ? e.target.value
                        : school?.pincode,
                  })
                }
              />
            </fieldset>
          </GridWrapper>

          <button
            className={`btn btn-primary ${
              loading ? "loading" : ""
            } w-full mt-6`}
            onClick={handleEditSchool}
            disabled={loading}
          >
            {loading ? "Editing..." : "Edit School"}
          </button>
        </div>
      </div>
    </>
  );
}
