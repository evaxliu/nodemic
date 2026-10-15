import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type EditorToolbarProps = {
  modelName: string
  setModelName: Dispatch<SetStateAction<string>>
}

export default function EditorToolbar({modelName, setModelName}: EditorToolbarProps) {

  function handleModelNameChange(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setModelName(e.target.value);
  }

  return (
    <nav className="sticky z-50 top-0 bg-white flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-300">
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
        <div className="h-6 border-l border-slate-400"></div>
        <input
          defaultValue={modelName}
          onChange={(e) => handleModelNameChange(e)}
          aria-label="Model name"
          className="w-48 px-1.5 py-0.5 text-lg font-medium text-gray-900 bg-transparent border border-transparent rounded-xs hover:border-slate-300 focus:border-slate-400 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-4 sm:gap-5 text-sm md:text-base font-medium text-slate-600">
        <button
          className="hidden sm:inline border-cyan-800 bg-cyan-800 hover:bg-cyan-900 text-white text-xs md:text-sm px-3 py-1.5 rounded-xs"
        >
          Share Link
        </button>
      </div>
    </nav>
  );
}