import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-300 font-mono">
      <div className="flex items-baseline gap-3">
        <Link href="/" className="text-base md:text-lg font-semibold tracking-tight text-gray-900">
          Nodemic
        </Link>
        <span className="hidden sm:inline text-xs md:text-sm text-slate-500">v0.1</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-5 text-sm md:text-base font-medium text-slate-600">
        <Link href="/library" className="hover:text-cyan-800">Model Library</Link>
        <Link href="/methods" className="hover:text-cyan-800">Methods</Link>
        <Link
          href="/model"
          className="hidden sm:inline bg-cyan-800 hover:bg-cyan-900 text-white font-semibold text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Open Editor
        </Link>
      </div>
    </nav>
  );
}