"use client";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { School } from "@/Types";
import { IconEdit } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManageSchoolsPage() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    village: "",
    taluka: "",
    district: "",
  });
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/schools");
      setSchools(res.data.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  if (isLoading) return <Loading />;

  const filteredSchools = schools.filter((school) => {
    return (
      school.name.includes(searchParams.name) &&
      school.village?.includes(searchParams.village) &&
      school.taluka?.includes(searchParams.taluka) &&
      school.district?.includes(searchParams.district)
    );
  });

  return (
    <>
      <SectionTitle title="Manage Schools" />
      <div className="flex flex-row gap-4 px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              School Name <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              placeholder="Enter School Name"
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams({ ...searchParams, name: e.target.value })
              }
              className="input input-primary w-full"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Village <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              placeholder="Enter Village"
              value={searchParams.village}
              onChange={(e) =>
                setSearchParams({ ...searchParams, village: e.target.value })
              }
              className="input input-primary w-full"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Taluka <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              placeholder="Enter Taluka"
              value={searchParams.taluka}
              onChange={(e) =>
                setSearchParams({ ...searchParams, taluka: e.target.value })
              }
              className="input input-primary w-full"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              District <span className="text-error">*</span>
            </legend>
            <input
              type="text"
              placeholder="Enter District"
              value={searchParams.district}
              onChange={(e) =>
                setSearchParams({ ...searchParams, district: e.target.value })
              }
              className="input input-primary w-full"
            />
          </fieldset>
        </div>
        <Link
          href={"/admin/manage-schools/add-school"}
          className="btn btn-primary lg:mt-8"
        >
          Add New School
        </Link>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg px-10">
        <table className="table table-zebra w-full bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>School Name</th>
              <th>Village</th>
              <th>Taluka</th>
              <th>District</th>
              <th>Principal Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No schools found.
                </td>
              </tr>
            ) : (
              filteredSchools.map((school, index) => (
                <tr key={school._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          {/* Buffer to base64 string */}
                          <img
                            src={`data:${
                              school.logo?.contentType
                            };base64,${Buffer.from(school.logo?.data!).toString(
                              "base64"
                            )}`}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{school.name}</div>
                        <div className="text-sm opacity-50">
                          {school.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{school.village}</td>
                  <td>{school.taluka}</td>
                  <td>{school.district}</td>
                  <td>{school.principal.name}</td>
                  <td>{school.contactNumber}</td>
                  <td>
                    <Link
                      href={`/admin/manage-schools/edit-school?schoolId=${school._id}`}
                      className="btn btn-sm btn-primary btn-outline"
                    >
                      <IconEdit className="mr-2" />
                      Edit
                    </Link>
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
