'use client'
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../../../redux/features/authSlice";
import Loader from "@/components/ui/loader";

const NEXT_PUBLIC_BACKEND_URL_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL_DOMAIN;
export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    async function onSubmit(e) {
        try {

            setLoading(true);
            e.preventDefault();
            const res = await fetch(NEXT_PUBLIC_BACKEND_URL_DOMAIN + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username, email, password
                })
            })
            if (res.status === 400) {
                const data = await res.json();
                alert(data.detail);
                return
            }
            const data = await res.json();
            console.log(data);
            if (data.access_token) {
                dispatch(logIn(data));
                setEmail("");
                setPassword("");
                setUsername("");
                router.push('/');
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false)
        }

    }

    return <div className=" bg-gradient-to-r from-[var(--primary)] to-[var(--primary-foreground)] h-screen w-screen flex justify-center items-center ">
        <form onSubmit={onSubmit} className="w-full rounded-[2.5rem] shadow max-w-[400px] bg-[var(--card)] px-12 py-20 space-y-6">
            <h2 className="text-4xl text-slate-600 text-center font-medium mb-8">Register</h2>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Username</label>
                    <input onChange={(e) => { setUsername(e.target.value) }} type="text" className="rounded-lg pl-4 border border-slate-300 py-2 bg-[var(--input-bg)]" />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Email Address</label>
                    <input onChange={(e) => { setEmail(e.target.value) }} type="email" className="py-2 pl-4 border rounded-lg border-slate-300 bg-[var(--input-bg)]" />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium text-sm text-slate-600">Password</label>
                    <input onChange={(e) => { setPassword(e.target.value) }} type="password" className="py-2 pl-4 border rounded-lg border-slate-300 bg-[var(--input-bg)]" />
                </div>

                <button className="bg-[var(--button)] font-light mt-2 text-lg text-white rounded-full shadow-inner py-2">{loading ? <Loader /> : "Register"}</button>
                <div className="flex justify-center">
                    <Link href={"/login"} className="text-sm flex gap-2 items-center">
                        <p className="text-slate-600">Already a member?</p>
                        <ArrowRightCircle size={18} className="bg-[var(--button)] text-white rounded-full " />
                    </Link>
                </div>
            </div>
        </form>
    </div>
}