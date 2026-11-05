import React from "react";
import Link from "next/link";
import { BookText, Atom, Landmark, Baby, Layers, ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Classic literature, modern drama, and captivating storytelling.",
    icon: BookText,
    count: "450+ Titles",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400",
  },
  {
    name: "Science",
    description: "Cosmology, physics, biology, and cutting-edge innovations.",
    icon: Atom,
    count: "280+ Titles",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400",
  },
  {
    name: "History",
    description: "Chronicles of ancient empires, revolutions, and human civilisations.",
    icon: Landmark,
    count: "310+ Titles",
    color: "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400",
  },
  {
    name: "Kids",
    description: "Bedtime fairy tales, vibrant picture books, and imaginative adventures.",
    icon: Baby,
    count: "190+ Titles",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Others",
    description: "Biographies, philosophy, art, memoirs, and eclectic genres.",
    icon: Layers,
    count: "150+ Titles",
    color: "from-slate-500/10 to-zinc-500/10 border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-400",
  },
];

export function TopCategories() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 rounded-full mb-3">
              Explore Our Shelves
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Popular Categories
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-xl">
              Discover your next compelling adventure curated across our premier genres.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/books?category=${cat.name}`}
                className="group relative p-6 rounded-2xl border bg-gradient-to-br transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-emerald-950/20"
                style={{
                  borderColor: "rgba(229, 231, 235, 0.8)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${cat.color} bg-white dark:bg-gray-900 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

