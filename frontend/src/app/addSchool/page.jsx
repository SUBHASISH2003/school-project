"use client";

import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  School,
  MapPin,
  Phone,
  Mail,
  Building,
  Check,
  X,
  Rocket,
  Sparkles,
} from "lucide-react";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const watchedImage = watch("image");
  const particlesRef = useRef([]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const formData = new FormData();
      for (let key in data) {
        if (key === "image") {
          formData.append("image", data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, {
        method: "POST",
        body: formData,
      });


      const result = await res.json();

      if (res.ok) {
        setMessage("School added successfully!");
        setMessageType("success");
        setPreview(null);
        reset();
      } else {
        setMessage(result.message || "Error adding school");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error, please try again");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setValue("image", [file]); // update react-hook-form
      setPreview(URL.createObjectURL(file));
    }
  };

  // Preview on select
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      if (file.size > 10 * 1024 * 1024) {
        setMessage("File too large (max 10MB)");
        setMessageType("error");
        setValue("image", null);
        return;
      }
      setPreview(URL.createObjectURL(file));
    }
  }, [watchedImage, setValue]);

  // Particle Background Effect
  useEffect(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particlesRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      }));
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;
      });
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    createParticles();
    animateParticles();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-6">
      {/* Background Particles */}
      <canvas
        id="particles"
        className="absolute inset-0 pointer-events-none"
      ></canvas>

      <div className="relative z-10 w-full max-w-3xl rounded-2xl shadow-2xl bg-gradient-to-br from-purple-800/70 to-indigo-900/70 backdrop-blur-xl border border-purple-500/30 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-3 shadow-lg">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="text-purple-400" /> Add New School
          </h1>
          <p className="text-gray-300 mt-2">
            Fill out the form to register a school
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              messageType === "success"
                ? "bg-green-600/30 border border-green-400 text-green-200"
                : "bg-red-600/30 border border-red-400 text-red-200"
            }`}
          >
            {messageType === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* School Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <School className="w-4 h-4 inline mr-2 text-purple-400" />
              School Name
            </label>
            <input
              type="text"
              placeholder="Enter school name"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                errors.name ? "border-red-400" : "border-purple-400/40"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <Building className="w-4 h-4 inline mr-2 text-purple-400" />
              Address
            </label>
            <input
              type="text"
              placeholder="Enter complete address"
              {...register("address", { required: "Address is required" })}
              className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                errors.address ? "border-red-400" : "border-purple-400/40"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-purple-400" />
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                {...register("city", { required: "City is required" })}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.city ? "border-red-400" : "border-purple-400/40"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.city && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-purple-400" />
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                {...register("state", { required: "State is required" })}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.state ? "border-red-400" : "border-purple-400/40"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.state && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                <Phone className="w-4 h-4 inline mr-2 text-purple-400" />
                Contact Number
              </label>
              <input
                type="text"
                placeholder="10-digit contact number"
                {...register("contact", {
                  required: "Contact is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be a 10-digit number",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.contact ? "border-red-400" : "border-purple-400/40"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.contact && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="school@example.com"
                {...register("email_id", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.email_id ? "border-red-400" : "border-purple-400/40"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.email_id && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.email_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <Upload className="w-4 h-4 inline mr-2 text-purple-400" />
              School Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                dragActive
                  ? "border-purple-400 bg-purple-500/20"
                  : errors.image
                  ? "border-red-400 bg-red-500/20"
                  : "border-purple-400/40 bg-black/40 hover:border-purple-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                {...register("image", { required: "Image is required" })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-32 object-cover rounded-lg shadow-md mb-2"
                />
              ) : (
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              )}
              <p className="text-gray-300 mb-1">
                {watchedImage && watchedImage[0]
                  ? `Selected: ${watchedImage[0].name}`
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
            {errors.image && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 transform flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving School...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Add School
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>All information will be verified before activation</p>
        </div>
      </div>
    </div>
  );
}
