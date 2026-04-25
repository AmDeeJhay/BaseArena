import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <svg width="22" height="17" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="9,4 3,12 9,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <polyline points="23,4 29,12 23,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="12" y="8" width="8" height="8" rx="1.5" fill="#0d9488" />
            </svg>
            <span className="font-semibold">BaseSkill</span>
          </Link>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/challenges"
              className="text-xs md:text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="text-xs md:text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              Leaderboard
            </Link>
            <Link
              href="/how-it-works"
              className="text-xs md:text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-xs md:text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
      <div className="container mt-4 md:mt-6 mx-auto px-4">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} BaseSkill. All rights reserved. Built on Base.
        </p>
      </div>
    </footer>
  )
}
