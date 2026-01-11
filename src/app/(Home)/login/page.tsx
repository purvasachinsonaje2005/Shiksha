"use client";
import {
  IconBrandInstagram,
  IconEye,
  IconEyeOff,
  IconSchool,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    password: "",
    captchaInput: "",
  });
  const genereateCaptcha = () => {
    const randomCaptcha = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setCaptcha(randomCaptcha);
  };
  useEffect(() => {
    genereateCaptcha();
  }, []);

  const handleSubmit = () => {
    try {
      if (formData.captchaInput !== captcha) {
        toast.error("Captcha does not match. Please try again.");
        return;
      }
      if (
        formData.email.trim() === "" ||
        formData.password.trim() === "" ||
        formData.role.trim() === ""
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
      const res = axios.post("/api/auth/login", {
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });
      toast.promise(res, {
        loading: "Logging in...",
        success: (data) => {
          console.log(data);
          router.push(data.data.route);
          return "Login successful!";
        },
        error: (err) => err.response.data.message || "Login failed!",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <section className="h-[calc(100vh-9rem)] flex items-center justify-center bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 p-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl px-10 py-8 rounded-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <IconSchool size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-base-content/70">Login to your Shiksha account</p>
        </div>
        <div className="space-y-4">
          {/* Email Field */}
          <fieldset className="fieldset">
            <legend className="legend font-bold">
              Email <span className="text-error">*</span>
            </legend>
            <input
              type="email"
              name="email"
              placeholder="student@company.com"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </fieldset>
          {/* Role Field */}
          <fieldset className="fieldset">
            <legend className="legend font-bold">
              Role <span className="text-error">*</span>
            </legend>
            <select
              className="select select-bordered w-full"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="principal">Principal</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </fieldset>
          {/* Password Field */}
          <fieldset className="fieldset">
            <legend className="legend font-bold">
              Password <span className="text-error">*</span>
            </legend>
            <div className="join">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="input input-bordered join-item w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                className="btn btn-square join-item"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </fieldset>

          {/* Captcha Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Captcha</legend>
            <div className="flex flex-row gap-2">
              <div className="join">
                <div className="bg-base-300 text-center px-4 py-1 text-xl font-mono tracking-widest join-item">
                  {captcha}
                </div>
                <button
                  type="button"
                  className="btn btn-neutral join-item px-4 py-2"
                  aria-label="Regenerate Captcha"
                  onClick={genereateCaptcha}
                >
                  &#x21bb;
                </button>
              </div>
              <input
                type="text"
                className="input"
                value={formData.captchaInput}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    captchaInput: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Enter Captcha"
              />
            </div>
          </fieldset>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            className="btn btn-primary w-full"
            disabled={
              formData.captchaInput !== captcha ||
              !formData.email ||
              !formData.password
            }
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
}
