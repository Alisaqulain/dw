"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSetupPanel({ adminCount, dbConnected }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  if (!dbConnected || adminCount > 0) return null;

  const handleSetup = async () => {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/setup", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setError(false);
      setMessage(`Admin created: ${data.email}. You can now log in.`);
    } else {
      setError(true);
      setMessage(data.error || "Setup failed");
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-amber-900">No admin account in database</p>
      <p className="mt-1 text-xs text-amber-800">
        Add <code className="rounded bg-amber-100 px-1">ADMIN_EMAIL</code> and{" "}
        <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> to .env.local, then create the admin account.
      </p>
      <button
        type="button"
        onClick={handleSetup}
        disabled={loading}
        className="mt-4 w-full rounded-full bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Admin from .env.local"}
      </button>
      {message && (
        <p className={`mt-3 text-xs ${error ? "text-red-600" : "text-emerald-700"}`}>{message}</p>
      )}
      {!message && (
        <Link href="/admin/login" className="mt-3 block text-center text-xs font-semibold text-sky-600 hover:underline">
          Or log in at /admin/login →
        </Link>
      )}
    </div>
  );
}
