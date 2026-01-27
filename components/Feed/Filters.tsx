"use client";

import { useEffect, useMemo, useState } from "react";

type Source = { name: string; type: string };
type Tags = {
  content_labels: string[];
  market_categories: string[];
  topics: string[];
  flags: string[];
};

export type FeedFilters = {
  q: string;
  source: string;
  market: string;
  label: string;
  flag: string;
  topic: string;
};

export function Filters(props: {
  onChange: (f: FeedFilters) => void;
}) {
  const [sources, setSources] = useState<Source[]>([]);
  const [tags, setTags] = useState<Tags | null>(null);

  const [q, setQ] = useState("");
  const [source, setSource] = useState("All");
  const [market, setMarket] = useState("All");
  const [label, setLabel] = useState("All");
  const [flag, setFlag] = useState("All");
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    (async () => {
      const s = await fetch("/api/sources").then((r) => r.json());
      setSources(s.sources ?? []);
    })();
    (async () => {
      const t = await fetch("/api/tags").then((r) => r.json());
      setTags(t);
    })();
  }, []);

  const current = useMemo<FeedFilters>(() => {
    return {
      q,
      source,
      market,
      label,
      flag,
      topic,
    };
  }, [q, source, market, label, flag, topic]);

  useEffect(() => {
    props.onChange(current);
  }, [current, props]);

  const Select = (p: {
    label: string;
    value: string;
    setValue: (v: string) => void;
    options: string[];
  }) => (
    <label className="block space-y-1">
      <span className="text-xs text-gray-600">{p.label}</span>
      <select
        className="w-full rounded-xl border px-3 py-2 text-sm"
        value={p.value}
        onChange={(e) => p.setValue(e.target.value)}
      >
        <option value="All">All</option>
        {p.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <aside className="rounded-2xl border p-4 space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-semibold">Search</div>
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Company, ticker, keyword…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="text-xs text-gray-500">
          Searches metadata only (entities/topics/labels), not third-party text.
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold">Filters</div>

        <Select
          label="Source Name"
          value={source}
          setValue={setSource}
          options={sources.map((s) => s.name)}
        />

        <Select
          label="Content Label"
          value={label}
          setValue={setLabel}
          options={tags?.content_labels ?? []}
        />

        <Select
          label="Market Category"
          value={market}
          setValue={setMarket}
          options={tags?.market_categories ?? []}
        />

        <Select label="Topic" value={topic} setValue={setTopic} options={tags?.topics ?? []} />

        <Select label="Flag" value={flag} setValue={setFlag} options={tags?.flags ?? []} />
      </div>
    </aside>
  );
}
