import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

// Modern X Logo SVG (per assignment rule: "Use the new X logo instead of the old Twitter bird")
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Short Line */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Book<span className="text-emerald-600 dark:text-emerald-400">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              BookNook is an online library designed to make borrowing, discovering, and sharing literature effortless and joyful.
            </p>
            {/* Social Links with Modern X Icon */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Add a Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  My Borrowed Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Book Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/books?category=Fiction" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fiction & Literature
                </Link>
              </li>
              <li>
                <Link href="/books?category=Science" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/books?category=History" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  History & Civilizations
                </Link>
              </li>
              <li>
                <Link href="/books?category=Kids" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Children & Young Readers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>42 Library Lane, Reading District, Booksville</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>support@booknook.library</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>+1 (800) 555-NOOK</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} BookNook Online Library. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Crafted with care for literature enthusiasts worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
