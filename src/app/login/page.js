import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {

    // button 01c968
    // bg 70dd9b
    // bg left aaf1bf
    //  card color ebfded
    //  text box input color white

    return <div className=" bg-gradient-to-r from-[var(--primary)] to-[var(--primary-foreground)] h-screen w-screen flex justify-center items-center ">
        <form className="w-full rounded-[2.5rem] shadow max-w-[400px] bg-[var(--card)] px-12 py-20 space-y-6">
            <h2 className="text-4xl text-slate-600 text-center font-medium mb-8">Login</h2>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Username</label>
                    <input type="text" className="text-sm rounded-lg pl-4 border border-slate-300 py-2 bg-[var(--input-bg)]" />
                </div>
                <span className="text-sm text-slate-600 text-center">Or</span>
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Email Address</label>
                    <input type="email" className="py-2 text-sm pl-4 border rounded-lg border-slate-300 bg-[var(--input-bg)]" />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Password</label>
                    <input type="password" className="text-sm py-2 pl-4 border rounded-lg border-slate-300 bg-[var(--input-bg)]" />
                </div>

                <button className="bg-[var(--button)] font-light mt-2 text-lg text-white rounded-full shadow-inner py-2">Login</button>
                <div className="flex justify-center">
                    <Link href={"/register"} className="text-sm flex gap-2 items-center">
                        <p className="text-slate-600">Not a member?</p>
                        <ArrowRightCircle size={18} className="bg-[var(--button)] text-white rounded-full " />
                    </Link>
                </div>
            </div>
        </form>
    </div>
}