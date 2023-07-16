"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../../types/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      router.push("/chat");
    }

    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-col w-full gap-2 px-8 mx-auto sm:max-w-md grow">
        <Link
          href="/"
          className="absolute flex items-center px-4 py-2 text-sm no-underline rounded-md left-8 top-8 text-foreground bg-btn-background hover:bg-btn-background-hover group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
        <form
          className="flex flex-col justify-center flex-1 w-full gap-2 text-foreground"
          onSubmit={handleSignIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="px-4 py-2 mb-6 border rounded-md bg-inherit"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="px-4 py-2 mb-6 border rounded-md bg-inherit"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
          />
          {message ? <p> {message} </p> : ""}

          <button className="px-4 py-2 mb-6 text-white bg-green-700 rounded">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
