"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

const PAGE_SIZE = 10;

export default function ClientList({ clients }: { clients: Client[] | null }) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // Filter first, then paginate the filtered results
  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!clients) return [];
    if (terms.length === 0) return clients;

    return clients.filter((c) => {
      const haystack = `${c.first_name ?? ""} ${c.last_name ?? ""} ${
        c.company_name ?? ""
      }`.toLowerCase();
      // Every word typed must match somewhere, so "john smith" finds John Smith
      return terms.every((t) => haystack.includes(t));
    });
  }, [clients, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Keep the page valid if the list shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const pageClients = filtered.slice(start, start + PAGE_SIZE);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1); // always start from the first page of new results
  };

  return (
    <div className="flex flex-col gap-5">
      <SearchBar value={query} onChange={handleSearch} />

      {total === 0 ? (
        <p className="text-sm text-foreground/50 py-10 text-center">
          {query.trim()
            ? `No clients match "${query.trim()}".`
            : "No clients yet."}
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-5 group/clients">
          {pageClients.map((c) => (
            <ClientCard key={c.id} {...c} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          start={start}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      )}
    </div>
  );
}

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by first name, last name, or company"
      aria-label="Search clients"
      className="w-full bg-transparent border border-border border-solid px-4 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-foreground/40 hover:border-white focus:border-white"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase text-foreground/50 hover:text-foreground"
      >
        Clear
      </button>
    )}
  </div>
);

const Pagination = ({
  page,
  totalPages,
  total,
  start,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  start: number;
  pageSize: number;
  onChange: (page: number) => void;
}) => {
  const btn =
    "px-3 py-1.5 text-sm border border-border border-solid transition-all duration-300 hover:border-white hover:bg-foreground/5 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-foreground/50">
        Showing {start + 1}–{Math.min(start + pageSize, total)} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          className={btn}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`${btn} ${
              p === page ? "!border-white bg-foreground/10 font-black" : ""
            }`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          className={btn}
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ClientCard = ({
  id,
  status,
  first_name,
  last_name,
  company_name,
}: any) => {
  const subHeadStyle = "text-foreground/50 text-sm mb-2 font-black";
  const subText = "text-sm mb-2";
  return (
    <div
      className={`relative transition-all duration-500 col-span-1 cursor-pointer border-border border border-solid px-5 py-10 hover:!border-white hover:bg-foreground/5`}
    >
      {status != "active" && (
        <div className="absolute right-3 top-3 z-[1] p-1 bg-rose-500">
          <p className="text-white text-xs uppercase">{status}</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className="w-[32px] aspect-square rounded-full border-black border-2 border-solid block relative"
          style={{
            background: `#000000 url("https://api.dicebear.com/10.x/disco/svg?backgroundColor=&patternProbability=100&shapeVariant=circle&shapeColor=ffffff&seed=${id}") center center no-repeat`,
          }}
        />
        <h3 className="text-base">
          {company_name ?? ""}
          <span className="font-black block text-xs">
            Primary Contant: {first_name ?? ""} {last_name ?? ""}
          </span>
        </h3>
      </div>
    </div>
  );
};
