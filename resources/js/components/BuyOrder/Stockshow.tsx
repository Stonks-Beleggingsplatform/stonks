import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../lib/axios'
import AuthContext from '../../context/AuthContext'

const FEE_PERCENTAGE = 0.002 // 0.2% mock fee

const StockShow = () => {
	const { ticker } = useParams<{ ticker: string }>()
	const { user } = useContext(AuthContext)

	const [stock, setStock] = useState<App.DTO.SecurityDTO | null>(null)
	const [amount, setAmount] = useState(0)
	const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
	const [limitPrice, setLimitPrice] = useState<number | ''>('')

	const [cash, setCash] = useState<number | null>(null)
	const [currency, setCurrency] = useState<string>('EUR')
	const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false)

	const [showSummary, setShowSummary] = useState(false)

	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		const fetchStock = async () => {
			if (!ticker) return

			setIsLoading(true)
			setError('')
			setSuccess('')
			setAmount(0)
			setLimitPrice('')
			setShowSummary(false)

			try {
				const response = await axios.get(`/securities/${ticker}`)
				setStock(response.data)
			} catch (err: any) {
				setError('Failed to load security')
			} finally {
				setIsLoading(false)
			}
		}

		fetchStock()
	}, [ticker])

	// Refactored: fetchPortfolio as standalone function, for reuse after orders
	const fetchPortfolio = async () => {
		if (!user) {
			setCash(null)
			setCurrency('EUR')
			return
		}

		setIsLoadingPortfolio(true)

		try {
			const res = await axios.get('/portfolio')
			const dto = res.data
			setCash(Number(dto.cash ?? 0))

			// Support multiple DTO shapes
			setCurrency(dto.currency?.name ?? dto.currency_name ?? 'EUR')
		} catch (e) {
			setCash(null)
			setCurrency('EUR')
		} finally {
			setIsLoadingPortfolio(false)
		}
	}

	useEffect(() => {
		fetchPortfolio()
	}, [user])

	const marketPrice = useMemo(() => (stock ? Number(stock.securityable?.price ?? 0) : 0), [stock])

	const usedPrice = useMemo(() => {
		if (orderType === 'limit' && limitPrice) {
			return Number(limitPrice)
		}
		return marketPrice
	}, [orderType, limitPrice, marketPrice])

	const quantity = useMemo(() => {
		if (usedPrice <= 0) return 0
		return Math.floor(amount / usedPrice)
	}, [amount, usedPrice])

	const formattedQuantity = useMemo(() => quantity.toString(), [quantity])
	const subtotal = useMemo(() => quantity * usedPrice, [quantity, usedPrice])
	const feeEstimate = useMemo(() => subtotal * FEE_PERCENTAGE, [subtotal])
	const totalRequired = useMemo(() => subtotal + feeEstimate, [subtotal, feeEstimate])

	const availableCash = useMemo(() => cash ?? 0, [cash])

	const hasEnoughCash = useMemo(() => {
		if (cash === null) return true
		return totalRequired <= availableCash
	}, [cash, totalRequired, availableCash])
	useEffect(() => {
		setShowSummary(false)
		setSuccess('')
		setError('')
	}, [amount, orderType, limitPrice, stock?.id])

	const handleOrder = async () => {
		if (!user || !stock || quantity <= 0) return
		if (cash !== null && !hasEnoughCash) return

		setIsSubmitting(true)
		setError('')
		setSuccess('')

		try {
			const res = await axios.post('/orders', {
				security_id: stock.id,
				quantity: quantity,
				action: 'buy',
				type: orderType,
				limit_price: orderType === 'limit' ? limitPrice : null,
			})

			if (cash !== null) {
				setCash((prev) => (prev === null ? prev : Math.max(0, prev - totalRequired)))
			}
			await fetchPortfolio()

			setSuccess(`Executed. Order #${res.data.order.id} at ${res.data.order.executed_price}`)
			setShowSummary(false)
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to place order')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return <div className="p-8 text-center text-gray-600">Loading…</div>
	}

	if (!stock) {
		return <div className="p-8 text-center text-gray-600">Security not found</div>
	}

	const isDisabled =
		!user ||
		isSubmitting ||
		quantity <= 0 ||
		(user && cash !== null && !hasEnoughCash) ||
		(orderType === 'limit' && (!limitPrice || Number(limitPrice) <= 0))

	return (
		<main className="max-w-5xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">
				{stock.name} <span className="text-gray-400">({stock.ticker})</span>
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white border rounded-xl p-6">
					<div className="flex items-start justify-between">
						<div>
							<div className="text-sm text-gray-500">Current price</div>
							<div className="text-3xl font-bold">{marketPrice}</div>
						</div>

						<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">📈</span>
						</div>
					</div>

					<div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
							<div className="text-xs text-gray-500 mb-1">Ticker</div>
							<div className="text-sm font-semibold text-gray-900">
								{stock.ticker}
							</div>
						</div>
						<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
							<div className="text-xs text-gray-500 mb-1">Name</div>
							<div className="text-sm font-semibold text-gray-900 line-clamp-1">
								{stock.name}
							</div>
						</div>
						<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
							<div className="text-xs text-gray-500 mb-1">Type</div>
							<div className="text-sm font-semibold text-gray-900">
								{stock.securityable?.dto_type
									? stock.securityable.dto_type.charAt(0).toUpperCase() +
									  stock.securityable.dto_type.slice(1)
									: 'SECURITY'}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white border rounded-xl p-6 space-y-4">
					<h2 className="font-semibold">Place order</h2>

					<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
						<div className="text-xs text-gray-500 mb-1">Available cash</div>
						<div className="text-sm font-semibold text-gray-900">
							{!user
								? 'Log in to view'
								: isLoadingPortfolio
								? 'Loading...'
								: `${availableCash} ${currency}`}
						</div>

						{user && cash !== null && !hasEnoughCash && (
							<div className="mt-2 text-sm text-red-700">
								Insufficient cash for this order.
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Order type</label>
						<select
							value={orderType}
							onChange={(e) => setOrderType(e.target.value as any)}
							className="w-full border rounded-lg px-3 py-2 text-sm"
							disabled={!user || isSubmitting}
						>
							<option value="market">Market</option>
							<option value="limit">Limit</option>
						</select>
					</div>

					{orderType === 'limit' && (
						<div>
							<label className="block text-sm font-medium mb-1">Limit price</label>
							<input
								type="number"
								className="w-full border rounded-lg px-3 py-2 text-sm"
								value={limitPrice}
								onChange={(e) => setLimitPrice(Number(e.target.value) || '')}
								min={0}
								disabled={!user || isSubmitting}
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium mb-1">Amount</label>
						<input
							type="number"
							className="w-full border rounded-lg px-3 py-2 text-sm"
							value={amount}
							onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
							min={0}
							disabled={!user || isSubmitting}
						/>
					</div>

					<div className="text-sm text-gray-600 space-y-1">
						<div>
							Quantity: <b>{formattedQuantity}</b>
						</div>
						<div>
							Subtotal: <b>{subtotal.toFixed(2)}</b>
						</div>
						<div>
							Fees (0.2%): <b>{feeEstimate.toFixed(2)}</b>
						</div>
						<div className="font-semibold">
							Total required: {totalRequired.toFixed(2)}
						</div>
					</div>

					{showSummary && (
						<div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
							<div className="font-semibold text-gray-900 mb-1">Order summary</div>
							<div>
								Security: <b>{stock.ticker}</b> ({stock.name})
							</div>
							<div>
								Action: <b>Buy</b>
							</div>
							<div>
								Order type: <b>{orderType.toUpperCase()}</b>
							</div>
							{orderType === 'limit' && (
								<div>
									Limit price: <b>{Number(limitPrice || 0).toFixed(2)}</b>
								</div>
							)}
							<div>
								Quantity: <b>{quantity}</b>
							</div>
							<div>
								Price used: <b>{usedPrice.toFixed(2)}</b>
							</div>
							<div>
								Subtotal: <b>{subtotal.toFixed(2)}</b>
							</div>
							<div>
								Fees: <b>{feeEstimate.toFixed(2)}</b>
							</div>
							<div className="font-semibold">
								Total required: {totalRequired.toFixed(2)}
							</div>
						</div>
					)}

					{error && (
						<div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
					)}
					{success && (
						<div className="text-sm text-green-700 bg-green-50 p-2 rounded">
							{success}
						</div>
					)}

					{!showSummary ? (
						<button
							onClick={() => setShowSummary(true)}
							disabled={isDisabled}
							className="w-full bg-black text-white py-2 rounded-lg text-sm disabled:opacity-50"
						>
							Preview order
						</button>
					) : (
						<button
							onClick={handleOrder}
							disabled={isDisabled}
							className="w-full bg-black text-white py-2 rounded-lg text-sm disabled:opacity-50"
						>
							{isSubmitting ? 'Placing order…' : 'Confirm order'}
						</button>
					)}
				</div>
			</div>
		</main>
	)
}

export default StockShow
