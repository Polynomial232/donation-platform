"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-off-white)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[var(--color-accent-yellow)] rounded-xl flex items-center justify-center text-[var(--color-deep-purple)] font-black text-xl shadow-sm">
              D
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">DukuNasia</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500 font-medium text-sm">Sign in to manage your page.</p>
        </div>

        <Card className="p-8 border-none shadow-lg">
          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Email</label>
              <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] outline-none font-medium"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase">Password</label>
                <Link href="#" className="text-xs font-bold text-[var(--color-deep-purple)]">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] outline-none font-medium"
                placeholder="••••••••"
              />
            </div>

            <Button className="w-full rounded-xl py-6 font-bold text-base shadow-lg shadow-yellow-100">
              Sign In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full rounded-xl py-6 font-bold gap-2">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Google
          </Button>
        </Card>

        <p className="text-center text-sm font-medium text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-[var(--color-deep-purple)] font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
