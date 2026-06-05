"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid unsubscribe link.");
      return;
    }

    fetch(`/api/subscribers?email=${encodeURIComponent(email)}&token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("You have been unsubscribed from marketing emails.");
        } else {
          setStatus("error");
          setMessage(data.error || "Unsubscribe failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong.");
      });
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      {status === "loading" && <p className="text-slate-500">Processing...</p>}
      {status === "success" && (
        <>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-800">Unsubscribed</h1>
          <p className="mt-2 text-slate-500">{message}</p>
          <p className="mt-2 text-sm text-slate-400">You will still receive order-related emails.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-slate-800">Error</h1>
          <p className="mt-2 text-red-500">{message}</p>
        </>
      )}
      <Link href="/" className="mt-8 inline-block text-sky-500 hover:text-sky-600">← Back to Home</Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
