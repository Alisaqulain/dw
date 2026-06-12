"use client";

import Link from "next/link";

export default function AdminSetupPanel({ adminCount, dbConnected }) {
  if (!dbConnected || adminCount > 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-amber-900">No admin account in database</p>
      <p className="mt-2 text-xs leading-relaxed text-amber-800">
        Set <code className="rounded bg-amber-100 px-1">ADMIN_EMAIL</code> and{" "}
        <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> in your server environment, then run{" "}
        <code className="rounded bg-amber-100 px-1">npm run admin:reset-password</code> once on a secure machine.
        After that, log in below.
      </p>
      <Link
        href="/admin/login"
        className="mt-4 block w-full rounded-full bg-amber-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-700"
      >
        Go to Admin Login
      </Link>
    </div>
  );
}
