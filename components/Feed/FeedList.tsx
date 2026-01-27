"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeedFilters } from "./Filters";

type FeedItem = {
  id: string;
  captured_at: string;
  expires_at: string;
  source: { name: string; type: string };
  external_url: string;
  content_label: string;
  market_category: string;
  visibility_level: number;
  entities: {
    companies?: string[];
    tickers?: string[];
    cryptocurrencies?: string[];
    protocols?: string[];
    exchanges?: string[];
    [k: string]: any;
  };
  topics: string[];
  flags: string[];
};

function buildQuery(f: FeedFilters) {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.source !== "All") sp.set("source", f.source);
  if (f.market !== "All") sp.set("market", f.market);
  if (f.label !== "All") sp.set("label", f.label);
  if (f.flag !== "All") sp.set("flag", f.flag);
  if (f.topic !== "All") sp.set("topic", f.topic);
  sp.set("limit", "50");
  return sp.toString();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function FeedList(props: { filters: FeedFilters }) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => buildQuery(props.filters), [props.filters]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/feed?${query}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (!cancelled) setItems(json.items ?? []);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to load feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Latest indexed references</h2>
        <div className="text-xs text-gray-500">
          External sources • Unverified • Metadata-only
        </div>
      </div>

      {loading && <div className="mt-4 text-sm text-gray-600">Loading…</div>}
      {err && <div className="mt-4 text-sm text-red-600">{err}</div>}

      <div className="mt-4 space-y-3">
        {items.map((it) => {
          const companies = it.entities?.companies ?? [];
          const tickers = it.entities?.tickers ?? [];
          const cryptos = it.entities?.cryptocurrencies ?? [];

          return (
            <article key={it.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium">
                  {it.market_category} • {it.content_label}
                </div>
                <div className="text-xs text-gray-500">{formatDate(it.captured_at)}</div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border px-2 py-1">
                  Source: {it.source.name} ({it.source.type})
                </span>
                <span className="rounded-full border px-2 py-1">Visibility: {it.visibility_level}</span>

                {companies.slice(0, 3).map((c) => (
                  <span key={c} className="rounded-full border px-2 py-1">
                    Company: {c}
                  </span>
                ))}
                {tickers.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border px-2 py-1">
                    Ticker: {t}
                  </span>
                ))}
                {cryptos.slice(0, 3).map((c) => (
                  <span key={c} className="rounded-full border px-2 py-1">
                    Crypto: {c}
                  </span>
                ))}

                {(it.topics ?? []).slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full border px-2 py-1">
                    Topic: {t}
                  </span>
                ))}
                {(it.flags ?? []).slice(0, 4).map((f) => (
                  <span key={f} className="rounded-full border px-2 py-1">
                    Flag: {f}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <a
                  className="text-sm underline"
                  href={it.external_url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open source
                </a>

                <div className="text-xs text-gray-500">
                  External link only. Content not hosted. Not verified.
                </div>
              </div>
            </article>
          );
        })}

        {!loading && !err && items.length === 0 && (
          <div className="text-sm text-gray-600">No items match your filters.</div>
        )}
      </div>
    </section>
  );
}
