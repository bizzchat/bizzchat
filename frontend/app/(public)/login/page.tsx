"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/core/supabase/supabase-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setTimeout } from "timers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { supabase } = useSupabase();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

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
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative flex-col items-center justify-center hidden h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
          <div className="relative z-20 flex flex-col justify-center w-full h-full mx-auto">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              Access your Own{" "}
              <span className="bg-gradient-to-r from-[#1E26FF] to-[#FF04FF] bg-clip-text text-transparent">
                {" "}
                ChatGPT{" "}
              </span>{" "}
              with ALL Your Business Content.
            </h1>
            <p className="max-w-[600px] pt-4 text-lg text-muted-foreground">
              Accurate ChatGPT responses from your content without making up
              facts. All within a secure, privacy-first, business-grade
              platform.
            </p>
          </div>
        </div>
        <div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <form
              className="flex flex-col justify-center flex-1 w-full gap-4 text-foreground"
              onSubmit={handleSignIn}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                />
              </div>

              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
          </div>
          <div className="relative overflow-hidden isolate">
            <div className="px-4 py-20"></div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx="512"
                cy="512"
                r="512"
                fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
                fillOpacity="0.7"
              ></circle>
              <defs>
                <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                  <stop stop-color="#1E26FF"></stop>
                  <stop offset="1" stop-color="#FF04FF"></stop>
                </radialGradient>
              </defs>
            </svg>
            <div className="max-w-2xl pb-10 mx-auto text-center">
              <h2 className="w-full text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Join the AI Revolution
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
