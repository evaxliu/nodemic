"use client"
import Canvas from "@/components/Canvas";
import EditorToolbar from "@/components/EditorToolbar";
import { useState } from "react";

export default function Editor() {
  const [modelName, setModelName] = useState("Untitled");
  return (
    <div className="h-dvh flex flex-col">
      <EditorToolbar modelName={modelName} setModelName={setModelName}/>
      <Canvas />
    </div>
  );
}