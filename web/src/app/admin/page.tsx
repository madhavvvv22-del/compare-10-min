"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProviderStatus {
  id: string;
  name: string;
  enabled: boolean;
}

interface SearchLog {
  query: string;
  location: string;
  timestamp: number;
  offerCount: number;
  failedProviders?: string[];
}

export default function AdminPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/providers").then((r) => r.json()),
      fetch("/api/admin/analytics").then((r) => r.json()),
    ]).then(([provData, logData]) => {
      setProviders(provData.providers ?? []);
      setLogs(logData.logs ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string, enabled: boolean) => {
    await fetch("/api/admin/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Back to app
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Admin dashboard
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Enable or disable price comparison providers. Changes apply immediately
          to search.
        </p>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {providers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span
                    className={`text-sm ${
                      p.enabled
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {p.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={(e) => toggle(p.id, e.target.checked)}
                    className="rounded"
                  />
                </label>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-12 mb-4">
          Recent searches
        </h2>
        {logs.length === 0 ? (
          <p className="text-zinc-500 text-sm">No searches yet.</p>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  <th className="text-left py-2 px-3">Query</th>
                  <th className="text-left py-2 px-3">Location</th>
                  <th className="text-left py-2 px-3">Results</th>
                  <th className="text-left py-2 px-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((log, i) => (
                  <tr key={i} className="border-t border-zinc-200 dark:border-zinc-700">
                    <td className="py-2 px-3">{log.query}</td>
                    <td className="py-2 px-3">{log.location}</td>
                    <td className="py-2 px-3">{log.offerCount}</td>
                    <td className="py-2 px-3 text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
