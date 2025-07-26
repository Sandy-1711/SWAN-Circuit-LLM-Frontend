'use client'
import Sidebar from "@/components/ui/Sidebar";
import { ArrowUp, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Homepage() {
  const user = useSelector((state) => state).auth.value;
  const router = useRouter();
  useLayoutEffect(() => {
    if (!user) {
      // router.push("/login");
    }
  }, [user])
  const [newView, setNewView] = useState(true);
  return <div className="flex ">
    <Sidebar />
    <div className="flex-1 bg-primary">
      <div className="xl:max-w-4xl max-w-xl mx-auto w-full h-full flex justify-center flex-col items-center px-10">
        <h2 className="text-3xl text-slate-600 text-center font-medium mb-8">What are you working on?</h2>
        <form className="w-full p-4 rounded-2xl bg-card flex justify-start items-end gap-2">
          <div className="flex-1">
            <textarea className="w-full resize-none outline-none max-h-[200px] overflow-auto leading-relaxed text-base bg-transparent"
              rows={1}
              placeholder="Ask anything"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
              }} />
          </div>
          <button className="bg-primary-foreground cursor-pointer rounded-full"><Mic className="text-white h-8 w-8 p-1.5" /></button>
          <button className="bg-[var(--button)] cursor-pointer rounded-full"><ArrowUp className="text-secondary h-8 w-8 p-1.5" /></button>
        </form>
      </div>
    </div>
  </div>
}