import Link from "next/link";

export default function EditorToolbar() {
  return (
    <nav className="sticky z-50 top-0 bg-white flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-300 font-mono">
      <div className="flex items-baseline gap-3">
        <Link href="/" className="text-base md:text-lg font-semibold tracking-tight text-gray-900">
          Nodemic
        </Link>
        <p>Title of Model Here</p>
      </div>
      <div className="flex items-center gap-4 sm:gap-5 text-sm md:text-base font-medium text-slate-600">
        <button
          className="hidden sm:inline bg-gray-200 hover:bg-gray-300 border text-black text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Notes
        </button>
        <Link
          href="/model"
          className="hidden sm:inline hover:bg-gray-200 border text-black text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Fork
        </Link>
        <button
          className="hidden sm:inline border-cyan-800 bg-cyan-800 hover:bg-cyan-900 text-white text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Share Link
        </button>
      </div>
    </nav>
  );
}