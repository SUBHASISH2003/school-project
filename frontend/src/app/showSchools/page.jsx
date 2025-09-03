"use client";

import { useEffect, useState, useRef } from "react";
import { School, MapPin, Loader2, X, Sparkles, Building } from "lucide-react";

function ParticleBackground() {
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // fix blurry scaling
    }

    function createParticles() {
      particlesRef.current = Array.from({ length: 40 }, () => ({
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
        ctx.fillStyle = "rgba(255,255,255,0.4)";
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
    <canvas
      id="particles"
      className="absolute inset-0 pointer-events-none z-0"
    ></canvas>
  );
}

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`);
        const data = await res.json();

        setSchools(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white px-4 sm:px-6 lg:px-12 py-10 overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-purple-400 w-8 h-8" /> Schools Directory
        </h1>
        <p className="text-gray-300 mt-3 text-sm sm:text-base">
          Explore all registered schools in the system
        </p>
      </div>

      {/* Loader / Empty State */}
      {loading ? (
        <div className="flex justify-center items-center h-40 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="ml-3 text-lg">Loading schools...</span>
        </div>
      ) : schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 relative z-10">
          <X className="w-8 h-8 mb-2" />
          <p className="text-center">No schools found</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {schools.map((school) => (
            <div
              key={school._id || school.id}
              className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-purple-500/40"
            >
              {school.image ? (
                <img
                  src={school.image}
                  alt={school.name || "School image"}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="flex items-center justify-center h-40 sm:h-48 bg-black/40">
                  <School className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="p-5">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 truncate">
                  <School className="text-purple-400 w-5 h-5" />
                  {school.name}
                </h2>
                <p className="text-gray-300 mt-2 flex items-center gap-2 text-sm line-clamp-1">
                  <Building className="w-4 h-4 text-indigo-400" />
                  {school.address}
                </p>
                <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  {school.city}, {school.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
