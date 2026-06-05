import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import AdminSetupPanel from "@/components/admin/AdminSetupPanel";

export const dynamic = "force-dynamic";

async function getStatus() {
  const session = await getAdminSession();
  let dbConnected = false;
  let adminCount = 0;
  let dbError = null;

  try {
    await connectDB();
    dbConnected = true;
    adminCount = await Admin.countDocuments();
  } catch (error) {
    dbError = error.message;
  }

  return {
    adminConnected: !!session,
    adminEmail: session?.email || null,
    dbConnected,
    adminCount,
    dbError,
  };
}

function StatusRow({ label, ok, detail }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
          ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}
      >
        {ok ? "Connected" : "Not connected"}
      </span>
    </div>
  );
}

export default async function CheckPage() {
  const status = await getStatus();
  const allGood = status.adminConnected && status.dbConnected;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${
              allGood ? "bg-emerald-100" : "bg-amber-100"
            }`}
          >
            {allGood ? "✓" : "!"}
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">System Check</h1>
          <p className="mt-2 text-sm text-slate-500">
            Admin session &amp; database connection status
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <StatusRow
            label="Admin Login"
            ok={status.adminConnected}
            detail={
              status.adminConnected
                ? `Logged in as ${status.adminEmail}`
                : "No active admin session. Log in at /admin/login"
            }
          />
          <StatusRow
            label="Database"
            ok={status.dbConnected}
            detail={
              status.dbConnected
                ? `MongoDB connected · ${status.adminCount} admin account(s) in DB`
                : status.dbError || "Could not connect to MongoDB"
            }
          />
        </div>

        <AdminSetupPanel adminCount={status.adminCount} dbConnected={status.dbConnected} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {status.adminConnected ? (
            <Link
              href="/admin/dashboard"
              className="flex-1 rounded-full bg-[#0c1929] py-3 text-center text-sm font-semibold text-white hover:bg-[#1e3a5f]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="flex-1 rounded-full bg-sky-500 py-3 text-center text-sm font-semibold text-white hover:bg-sky-600"
            >
              Admin Login
            </Link>
          )}
          <Link
            href="/api/check"
            target="_blank"
            className="flex-1 rounded-full border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            JSON API
          </Link>
        </div>
      </div>
    </div>
  );
}
