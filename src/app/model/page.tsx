import Canvas from "@/components/Canvas";
import EditorToolbar from "@/components/EditorToolbar";

export default function Editor() {
  return (
    <div className="h-dvh flex flex-col">
      <EditorToolbar />
      <Canvas />
    </div>
  );
}