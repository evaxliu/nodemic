import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between px-10 md:px-30 lg:px-50 py-5">
      <div>
        <Link href={"/"} className="text-2xl">Nodemic</Link>
      </div>
      <div className="flex gap-5">
        <Link href={"/library"}>
          Model Library
        </Link>
        <Link href={"/methods"}>
          Methods
        </Link>
        <Link href={"/model"}>
          Open Editor
        </Link>
      </div>
    </nav>
  );
}
