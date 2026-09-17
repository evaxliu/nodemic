import Landing from "@/components/Landing";
import NavBar from "@/components/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex items-center justify-center">
        <Landing />
      </div>
    </div>
  );
}
