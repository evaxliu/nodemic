import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-300 font-mono">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={"/nodemic-icon-transparent/nodemic-transparent-512.png"}
            alt={"Nodemic home"}
            width={32}
            height={32}
          />
          <p className="px-1.5 py-0.5 text-lg font-medium text-gray-900 bg-transparent">Nodemic</p>
        </Link>
        <span className="hidden sm:inline text-xs md:text-sm text-slate-500">v0.1</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-5 text-sm md:text-base font-medium text-slate-600">
        {/* <Link href="/library" className="hover:text-cyan-800">Model Library</Link> */}
        <Link href="/methods" className="hover:text-cyan-800">Methods</Link>
        <Link
          href="/model"
          className="hidden sm:inline bg-cyan-800 hover:bg-cyan-900 text-white text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Open Editor
        </Link>
      </div>
    </nav>
  );
}