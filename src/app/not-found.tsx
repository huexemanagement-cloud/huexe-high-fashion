import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-obsidian px-6 text-center">
      <p className="mono text-raw/35">Error 404 — off the contact sheet</p>
      <h1 className="display-huge text-raw">Not found</h1>
      <Link
        href="/"
        className="mono border border-raw/25 px-8 py-4 text-raw transition hover:bg-raw hover:text-obsidian"
      >
        Return to index
      </Link>
    </div>
  );
}
