// /resources/js/components/MarketsFilters.tsx
import React from 'react'

export type MarketFilters = {
  types: Array<'stock' | 'crypto' | 'bond'>
  priceMin?: number
  priceMax?: number
}

type MarketsFiltersProps = {
  total: number | null
  perPage: number
  onPerPageChange: (value: number) => void
  perPageDisabled: boolean

  searchTerm: string
  onSearchTermChange: (value: string) => void

  filters: MarketFilters
  setFilters: React.Dispatch<React.SetStateAction<MarketFilters>>
  setPage: React.Dispatch<React.SetStateAction<number>>

  isLoading: boolean
  isSearching: boolean
}

const DEFAULT_FILTERS: MarketFilters = {
  types: [],
  priceMin: undefined,
  priceMax: undefined,
}

export default function MarketsFilters({
  total,
  searchTerm,
  onSearchTermChange,
  filters,
  setFilters,
  setPage,
  isLoading,
  isSearching,
}: MarketsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-gray-900">Markets</div>
          {typeof total === 'number' ? (
            <div className="text-sm text-gray-500">Total {total}</div>
          ) : null}
        </div>

      </div>

      <div className="relative rounded-md shadow-sm w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>

        <input
          type="search"
          name="search"
          id="search"
          className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
          placeholder="Search by name, ticker, or company"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</div>

            <div className="flex flex-wrap gap-2">
              {(['stock', 'crypto', 'bond'] as const).map((t) => {
                const active = filters.types.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isLoading || isSearching}
                    onClick={() => {
                      setPage(1)
                      setFilters((prev) => {
                        const exists = prev.types.includes(t)
                        const nextTypes = exists ? prev.types.filter((x) => x !== t) : [...prev.types, t]
                        return { ...prev, types: nextTypes }
                      })
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                )
              })}

              <button
                type="button"
                disabled={isLoading || isSearching}
                onClick={() => {
                  setPage(1)
                  setFilters((prev) => ({ ...prev, types: [] }))
                }}
                className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
              >
                ALL
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">No type selected means all types</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Min price
              </label>
              <input
                type="number"
                inputMode="decimal"
                disabled={isLoading || isSearching}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={typeof filters.priceMin === 'number' ? filters.priceMin : ''}
                onChange={(e) => {
                  const raw = e.target.value
                  const val = raw === '' ? undefined : Number(raw)
                  setPage(1)
                  setFilters((prev) => ({
                    ...prev,
                    priceMin: raw === '' ? undefined : Math.max(0, Number.isFinite(val as number) ? (val as number) : 0),
                  }))
                }}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Max price
              </label>
              <input
                type="number"
                inputMode="decimal"
                disabled={isLoading || isSearching}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={typeof filters.priceMax === 'number' ? filters.priceMax : ''}
                onChange={(e) => {
                  const raw = e.target.value
                  const val = raw === '' ? undefined : Number(raw)
                  setPage(1)
                  setFilters((prev) => ({
                    ...prev,
                    priceMax: raw === '' ? undefined : Math.max(0, Number.isFinite(val as number) ? (val as number) : 0),
                  }))
                }}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isLoading || isSearching}
              onClick={() => {
                setPage(1)
                setFilters(DEFAULT_FILTERS)
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
            >
              Reset filters
            </button>

            <div className="text-xs text-gray-500">
              {searchTerm.trim().length > 0 ? 'Filters apply to search results' : 'Filters apply to the list'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}