'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/ui/Sidebar";
import Wrapper from "@/components/ui/Wrapper";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { ArrowUp, ChevronRight, Info, Mic, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAxios } from "../../hooks/useAxios";
import { Skeleton } from "@/components/ui/skeleton";


export default function Homepage() {
  const user = useSelector((state) => state).auth.value;
  const loggedIn = useSelector((state) => state).auth.loggedIn;
  const router = useRouter();
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  async function fetchChats() {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:8000/user/all_chats")
      if (Array.isArray(data)) {
        setChats(data);
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.access_token) {
      fetchChats();
    }
  }, [user])

  useEffect(() => {
    if (!user || !user?.access_token || !loggedIn) {
      router.push('/login')
    }
  }, [user])

  return <div className="bg-background relative">
    <div className="bg-[var(--sidebar-bg)] fixed top-0  w-full py-3">
      <Wrapper className={"flex justify-between items-center"}>
        <div className="">
          <img className="h-12 w-12 rounded-full" src="/swan.png" />
        </div>
        <div>
          <h2 className="text-2xl text-[var(--text)] font-medium">Welcome to SWAN AI</h2>
        </div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </Wrapper>
    </div>

    <Wrapper>
      <div className="grid grid-cols-4 gap-4 py-22">
        <div onClick={() => router.push(`/chat/new`)} className="bg-[var(--card)] flex justify-center items-center flex-col cursor-pointer hover:shadow-xl rounded border-[var(--border)] min-h-[130px] max-h-max py-4 px-4" >
          <button className="bg-[var(--button)] rounded-full w-7 h-7 flex  justify-center items-center">
            <PlusCircle className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl text-[var(--text)] font-medium">New Chat</h2>
        </div>
        {loading && Array(19).fill(0).map((_, index) => {
          return <Skeleton key={index} className={"h-[130px] w-full p-4 flex flex-col gap-1 bg-[var(--card)] rounded "} >
            <Skeleton className={"h-10 w-full"}></Skeleton>
            <Skeleton className={"h-4 w-1/2"}></Skeleton>
            <div className="w-full flex justify-end items-end">
              <Skeleton className={"h-7 w-7 rounded-full"} />
            </div>
          </Skeleton>

        })}
        {chats?.map((_, index) => {
          return <div onClick={() => router.push(`/chat/${_.id}`)} className="bg-[var(--card)] cursor-pointer hover:shadow-xl min-h-[130px] rounded border-[var(--border)] max-h-max py-4 px-4" key={index}>
            <div className=" flex flex-col">
              <div className="select-none">
                <h2 className="text-2xl text-[var(--text)] font-bold">{_.chat_name}</h2>
                {/* <p className="text-sm font-light text-[var(--text-muted)]">{_.chat_description}</p> */}
                <p className="text-xs font-medium text-left mt-1 text-[var(--text-muted)]">{new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}</p>
              </div>
              <div className="flex justify-end w-full pt-3 items-end">
                <button className="bg-[var(--button)] rounded-full w-7 h-7 flex  justify-center items-center">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        })}
      </div>
    </Wrapper>
    <div className="flex fixed bottom-0 w-full flex-col py-4">
      <div className="flex  justify-center gap-1.5 items-center">
        <h2 className="text-sm text-[var(--text-muted)] text-center font-medium">Disclaimer
        </h2>
        <Info className="w-4 h-4 mt-0.5 text-[var(--text-muted)]" />
      </div>
      <div><p className="text-sm font-light text-center text-[var(--text-muted)]">The information provided by SWAN AI is for informational purposes only and may not be accurate.</p></div>
    </div>
  </div>

}