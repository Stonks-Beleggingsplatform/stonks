// /resources/js/components/Markets.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import MarketsFilters, { type MarketFilters } from './MarketsFilters'

type PaginatorMeta = {
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

type LaravelPaginatedResponse<T> = {
  data?: T[]
  meta?: PaginatorMeta
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

const resolveSelectedTypes = (selected: MarketFilters['types']) => {
  return selected.length ? selected : (['stock', 'crypto', 'bond'] as const)
}

const buildSecuritiesParams = (page: number, perPage: number, filters: MarketFilters) => {
  const params: any = {
    page,
    per_page: perPage,
    type: resolveSelectedTypes(filters.types),
  }

  if (typeof filters.priceMin === 'number' && Number.isFinite(filters.priceMin)) {
    params.price_min = filters.priceMin
  }
  if (typeof filters.priceMax === 'number' && Number.isFinite(filters.priceMax)) {
    params.price_max = filters.priceMax
  }

  return params
}

const buildSearchParams = (filters: MarketFilters) => {
  const params: any = {
    type: resolveSelectedTypes(filters.types),
  }

  if (typeof filters.priceMin === 'number' && Number.isFinite(filters.priceMin)) {
    params.price_min = filters.priceMin
  }
  if (typeof filters.priceMax === 'number' && Number.isFinite(filters.priceMax)) {
    params.price_max = filters.priceMax
  }

  return params
}

const getExchangeLabel = (security: App.DTO.SecurityDTO) => {
  const exchange: any = (security as any).exchange
  if (!exchange) return ''
  return exchange.code || exchange.name || ''
}

const getSecurityTypeLabel = (security: App.DTO.SecurityDTO) => {
  const securityable: any = (security as any).securityable
  if (!securityable) return ''
  return securityable.type || securityable.security_type || securityable.kind || ''
}

const formatPrice = (price: number) => {
  return `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function LoadingBox() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-gray-500">
      <div className="text-4xl mb-3">📈</div>
      <p className="text-sm font-medium mb-1">No securities found</p>
      <p className="text-xs text-gray-400">Try changing page or per page</p>
    </div>
  )
}

type SecurityRowProps = {
  security: App.DTO.SecurityDTO
  onView: () => void
  onTrade: () => void
}

function SecurityRow({ security, onView, onTrade }: SecurityRowProps) {
  return (
    <div className="w-full p-4 hover:bg-gray-50 transition-colors rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-900 text-base">{security.ticker}</span>

          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md border border-gray-200">
            {getSecurityTypeLabel(security) || 'Security'}
          </span>

          {getExchangeLabel(security) ? (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md border border-gray-200">
              {getExchangeLabel(security)}
            </span>
          ) : null}
        </div>

        <p className="text-sm text-gray-500 truncate mb-2">{security.name}</p>

        <div className="text-lg font-bold text-black font-mono">
          {formatPrice(Number((security as any).price ?? 0))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onView}
          className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
        >
          View
        </button>
        <button
          onClick={onTrade}
          className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-md active:scale-95"
        >
          Trade
        </button>
      </div>
    </div>
  )
}

type ResultsBoxProps = {
  items: App.DTO.SecurityDTO[]
  isBusy: boolean
  onView: (ticker: string) => void
  onTrade: (ticker: string) => void
}

function ResultsBox({ items, isBusy, onView, onTrade }: ResultsBoxProps) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {isBusy ? (
        <LoadingBox />
      ) : (
        <div className="p-4">
          <div className="space-y-2">
            {items.length ? (
              items.map((security) => (
                <SecurityRow
                  key={security.ticker}
                  security={security}
                  onView={() => onView(security.ticker)}
                  onTrade={() => onTrade(security.ticker)}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type PaginationBarProps = {
  searchTerm: string
  currentPage: number
  lastPage: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

function PaginationBar({
  searchTerm,
  currentPage,
  lastPage,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: PaginationBarProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        {searchTerm.trim().length > 0 ? <>Search results</> : <>Page {currentPage} of {lastPage}</>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="px-4 py-2 rounded-lg text-sm font-bold bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="px-4 py-2 rounded-lg text-sm font-bold bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function useMarketsData() {
  const [items, setItems] = useState<App.DTO.SecurityDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<MarketFilters>({
    types: [],
    priceMin: undefined,
    priceMax: undefined,
  })

  const didInit = useRef(false)

  const isBusy = isLoading || isSearching
  const perPageDisabled = isBusy || searchTerm.trim().length > 0

  const canPrev = useMemo(
    () => currentPage > 1 && !isBusy && searchTerm.trim().length === 0,
    [currentPage, isBusy, searchTerm]
  )
  const canNext = useMemo(
    () => currentPage < lastPage && !isBusy && searchTerm.trim().length === 0,
    [currentPage, lastPage, isBusy, searchTerm]
  )

  const applyPaginatedPayload = (
    payload: LaravelPaginatedResponse<App.DTO.SecurityDTO>,
    nextPage: number,
    nextPerPage: number
  ) => {
    const list = Array.isArray(payload.data) ? payload.data : []
    const meta = payload.meta ?? {}

    const resolvedCurrent = meta.current_page ?? payload.current_page ?? nextPage ?? 1
    const resolvedLast = meta.last_page ?? payload.last_page ?? resolvedCurrent ?? 1
    const resolvedTotal =
      typeof (meta.total ?? payload.total) === 'number' ? ((meta.total ?? payload.total) as number) : null

    setItems(list)
    setCurrentPage(resolvedCurrent)
    setLastPage(resolvedLast)
    setTotal(resolvedTotal)

    setPerPage(meta.per_page ?? payload.per_page ?? nextPerPage)
  }

  const fetchSecurities = async (page: number, nextPerPage: number, nextFilters: MarketFilters) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get<LaravelPaginatedResponse<App.DTO.SecurityDTO>>('/securities', {
        params: buildSecuritiesParams(page, nextPerPage, nextFilters),
      })

      applyPaginatedPayload(response.data, page, nextPerPage)
    } catch (e) {
      console.error('Error fetching securities:', e)
      setError('Failed to fetch securities')
      setItems([])
      setCurrentPage(1)
      setLastPage(1)
      setTotal(null)
    } finally {
      setIsLoading(false)
    }
  }

  const searchSecurities = async (term: string, nextFilters: MarketFilters) => {
    setIsSearching(true)
    setError('')

    try {
      const response = await api.get<App.DTO.SecurityDTO[]>(
        `/securities/search/${encodeURIComponent(term)}`,
        { params: buildSearchParams(nextFilters) }
      )

      setItems(response.data)
      setTotal(response.data.length)
      setCurrentPage(1)
      setLastPage(1)
    } catch (e) {
      console.error('Error searching securities:', e)
      setError('Failed to search securities')
      setItems([])
      setTotal(0)
      setCurrentPage(1)
      setLastPage(1)
    } finally {
      setIsSearching(false)
    }
  }

  const onPerPageChange = (value: number) => {
    const next = value
    setPerPage(next)

    if (searchTerm.trim().length > 0) {
      searchSecurities(searchTerm.trim(), filters)
      return
    }

    fetchSecurities(1, next, filters)
  }

  const onPrev = () => {
    if (!canPrev) return
    fetchSecurities(Math.max(1, currentPage - 1), perPage, filters)
  }

  const onNext = () => {
    if (!canNext) return
    fetchSecurities(currentPage + 1, perPage, filters)
  }

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    fetchSecurities(1, perPage, filters)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchTerm.trim()

      if (trimmed.length > 0) {
        searchSecurities(trimmed, filters)
        return
      }

      fetchSecurities(1, perPage, filters)
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, filters])

  return {
    items,
    error,
    isBusy,
    isLoading,
    isSearching,

    perPage,
    perPageDisabled,
    onPerPageChange,

    currentPage,
    lastPage,
    total,

    searchTerm,
    setSearchTerm,

    filters,
    setFilters,

    canPrev,
    canNext,
    onPrev,
    onNext,
  }
}

function MarketsPage() {
  const navigate = useNavigate()

  const {
    items,
    error,
    isBusy,
    isLoading,
    isSearching,

    perPage,
    perPageDisabled,
    onPerPageChange,

    currentPage,
    lastPage,
    total,

    searchTerm,
    setSearchTerm,

    filters,
    setFilters,

    canPrev,
    canNext,
    onPrev,
    onNext,
  } = useMarketsData()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="lg:sticky lg:top-6 h-fit">
            <MarketsFilters
              total={total}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
              perPageDisabled={perPageDisabled}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              setPage={() => {}}
              isLoading={isLoading}
              isSearching={isSearching}
            />
          </div>
          <div>
            {error ? (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            ) : null}

            <ResultsBox
              items={items}
              isBusy={isBusy}
              onView={(ticker) => navigate(`/securities/${ticker}`)}
              onTrade={(ticker) => navigate(`/stocks/${ticker}`)}
            />

            <PaginationBar
              searchTerm={searchTerm}
              currentPage={currentPage}
              lastPage={lastPage}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={onPrev}
              onNext={onNext}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Markets() {
  return <MarketsPage />
}