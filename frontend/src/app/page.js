import Link from "next/link";
import { School, PlusCircle, List } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-8">
      {/* Glow background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
          <School className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 text-transparent bg-clip-text mb-4">
          School Management App
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Add new schools and view the list of schools with ease 🚀
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link
            href="/addSchool"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:scale-105 hover:from-purple-500 hover:to-indigo-500 transition-transform flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> Add School
          </Link>

          <Link
            href="/showSchools"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-lg hover:scale-105 hover:from-green-500 hover:to-emerald-500 transition-transform flex items-center gap-2"
          >
            <List className="w-5 h-5" /> Show Schools
          </Link>
        </div>
      </div>
    </main>
  );
}
