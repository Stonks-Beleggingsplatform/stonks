import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';


type Security = App.DTO.Securityable.StockDTO | App.DTO.Securityable.CryptoDTO | App.DTO.Securityable.BondDTO | App.DTO.SecurityDTO;

const FEE_PERCENTAGE = 0.002; // 0.2% fee

export default function StockShow() {
	const { ticker } = useParams<{ ticker: string }>();
	const navigate = useNavigate();
	const { user, fetchBalance } = useAuth();


	const [security, setSecurity] = useState<Security | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Order state
	const [action, setAction] = useState<'buy' | 'sell'>('buy');
	const [amount, setAmount] = useState<number>(0);
	const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
	const [limitPrice, setLimitPrice] = useState<number | ''>('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSummary, setShowSummary] = useState(false);

	// Portfolio state
	const [cash, setCash] = useState<number | null>(null);
	const [portfolio, setPortfolio] = useState<any>(null);
	const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);


	useEffect(() => {
		if (ticker) {
			fetchSecurity();
		}
	}, [ticker]);

	useEffect(() => {
		if (user) {
			fetchPortfolio();
		}
	}, [user]);

	const fetchSecurity = async () => {
		setIsLoading(true);
		setError('');
		setSuccess('');
		try {
			const response = await api.get(`/securities/${ticker}`);
			setSecurity(response.data);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to load security');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchPortfolio = async () => {
		setIsLoadingPortfolio(true);
		try {
			const res = await api.get('/portfolio');
			const data = res.data;
			setPortfolio(data);
			if (data) {
				setCash(Number(data.cash ?? 0));
			}

		} catch (e) {
			console.error('Failed to fetch portfolio', e);
		} finally {
			setIsLoadingPortfolio(false);
		}
	};

	const formatPrice = (price: number) => {
		return `$${price.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
	};

	const formatMarketCap = (marketCap: number) => {
		if (marketCap >= 1_000_000_000_000) {
			return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
		} else if (marketCap >= 1_000_000_000) {
			return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
		} else if (marketCap >= 1_000_000) {
			return `$${(marketCap / 1_000_000).toFixed(2)}M`;
		}
		return `$${marketCap.toLocaleString()}`;
	};

	const marketPrice = useMemo(() => (security ? Number(security.price ?? 0) : 0), [security]);

	const usedPrice = useMemo(() => {
		if (orderType === 'limit' && limitPrice) {
			return Number(limitPrice);
		}
		return marketPrice;
	}, [orderType, limitPrice, marketPrice]);

	const currentHolding = useMemo(() => {
		if (!portfolio || !security) return null;
		return portfolio.holdings?.find((h: any) => h.security_id === (security as any).id) || null;
	}, [portfolio, security]);

	const quantity = useMemo(() => {
		if (action === 'buy') {
			if (usedPrice <= 0) return 0;
			return Math.floor(amount / usedPrice);
		}
		// For sell, amount is already the quantity
		return amount;
	}, [amount, usedPrice, action]);

	const subtotal = useMemo(() => {
		if (action === 'buy') {
			return quantity * usedPrice;
		}
		// For sell, subtotal is quantity * usedPrice
		return amount * usedPrice;
	}, [amount, quantity, usedPrice, action]);

	const feeEstimate = useMemo(() => subtotal * FEE_PERCENTAGE, [subtotal]);
	const totalRequired = useMemo(() => action === 'buy' ? subtotal + feeEstimate : subtotal - feeEstimate, [action, subtotal, feeEstimate]);

	const hasEnoughCash = useMemo(() => {
		if (action === 'sell') return true;
		if (cash === null) return true;
		return totalRequired <= cash;
	}, [action, cash, totalRequired]);

	const hasEnoughHoldings = useMemo(() => {
		if (action === 'buy') return true;
		if (!currentHolding) return false;
		return quantity <= currentHolding.quantity;
	}, [action, currentHolding, quantity]);

	const handleOrder = async () => {
		if (!user || !security || quantity <= 0) return;
		if (action === 'buy' && cash !== null && !hasEnoughCash) return;
		if (action === 'sell' && !hasEnoughHoldings) return;

		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			const res = await api.post('/orders', {
				security_id: (security as any).id,
				quantity: quantity,
				action: action,
				type: orderType,
				limit_price: orderType === 'limit' ? limitPrice : null,
			});

			await fetchPortfolio();
			await fetchBalance();
			setSuccess(`${action === 'buy' ? 'Buy' : 'Sell'} order successfully placed! Order ID: #${res.data.order.id || 'N/A'}`);
			setShowSummary(false);
			setAmount(0);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to place order');
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderSecurityDetails = () => {
		if (!security) return null;

		const dtoType = (security as any).dto_type;

		switch (dtoType) {
			case 'stock':
				return <StockDetails security={security as App.DTO.Securityable.StockDTO} formatMarketCap={formatMarketCap} />;
			case 'crypto':
				return <CryptoDetails security={security as App.DTO.Securityable.CryptoDTO} />;
			case 'bond':
				return <BondDetails security={security as App.DTO.Securityable.BondDTO} />;
			default:
				return <BaseSecurityDetails />;
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-gray-600">Loading security details...</div>
				</div>
			</div>
		);
	}

	if (error && !security) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2">
					<span>←</span><span>Back</span>
				</button>
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
			</div>
		);
	}

	if (!security) return null;

	const dtoType = (security as any).dto_type;
	const exchange = (security as any).exchange;
	const isDisabled = !user || isSubmitting || quantity <= 0 ||
		(action === 'buy' && user && cash !== null && !hasEnoughCash) ||
		(action === 'sell' && !hasEnoughHoldings) ||
		(orderType === 'limit' && (!limitPrice || Number(limitPrice) <= 0));

	return (
		<div className="min-h-screen bg-gray-50/50">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header Section */}
				<div className="mb-8">
					<button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2">
						<span>←</span><span>Back</span>
					</button>

					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-3xl font-bold">{security.ticker}</h1>
								{dtoType && (
									<span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full uppercase">
										{dtoType}
									</span>
								)}
							</div>
							<p className="text-xl text-gray-600 mb-1">{security.name}</p>
							{exchange && (
								<p className="text-sm text-gray-500">{exchange.name}</p>
							)}
						</div>

						<div className="md:text-right">
							<div className="text-3xl font-bold text-gray-900">
								{formatPrice(security.price)}
							</div>
							<p className="text-sm text-gray-500 mt-1">Real-time market price</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left Column: Details */}
					<div className="lg:col-span-8 space-y-8">
						{renderSecurityDetails()}
					</div>

					{/* Right Column: Order Form */}
					<div className="lg:col-span-4">
						<div className="sticky top-8">
							<div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
								<div className="p-0 flex border-b border-gray-100">
									<button
										onClick={() => { setAction('buy'); setShowSummary(false); }}
										className={`flex-1 py-4 text-center font-bold text-sm transition-all ${action === 'buy' ? 'bg-white text-black border-b-2 border-black' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
									>
										BUY
									</button>
									<button
										onClick={() => { setAction('sell'); setShowSummary(false); }}
										className={`flex-1 py-4 text-center font-bold text-sm transition-all ${action === 'sell' ? 'bg-white text-black border-b-2 border-black' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
									>
										SELL
									</button>
								</div>

								<div className="p-6 space-y-6">
									{/* Feedback Messages */}
									{error && (
										<div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
											{error}
										</div>
									)}
									{success && (
										<div className="p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
											{success}
										</div>
									)}

									{/* Context Card: Funds or Holdings */}
									{action === 'buy' ? (
										<div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
											<div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Available Funds</div>
											<div className="text-xl font-bold text-blue-900">
												{!user ? 'Log in to view' : isLoadingPortfolio ? '...' : `${formatPrice(cash ?? 0)}`}
											</div>
											{user && cash !== null && !hasEnoughCash && (
												<p className="text-xs text-red-600 mt-1 font-medium italic">⚠️ Insufficient funds for this order</p>
											)}
										</div>
									) : (
										<div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
											<div className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">Current Holding</div>
											<div className="text-xl font-bold text-orange-900">
												{isLoadingPortfolio ? '...' : `${currentHolding?.quantity ?? 0} units`}
											</div>
											{currentHolding && (
												<p className="text-xs text-orange-500 mt-1">Avg Cost: {formatPrice(currentHolding.avg_price / 100)}</p>
											)}
											{action === 'sell' && !hasEnoughHoldings && currentHolding && (
												<p className="text-xs text-red-600 mt-1 font-medium italic">⚠️ Not enough units to sell</p>
											)}
										</div>
									)}

									<div className="space-y-4">
										<div>
											<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Type</label>
											<div className="grid grid-cols-2 gap-2">
												<button
													onClick={() => setOrderType('market')}
													className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${orderType === 'market' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
												>
													Market
												</button>
												<button
													onClick={() => setOrderType('limit')}
													className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${orderType === 'limit' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
												>
													Limit
												</button>
											</div>
										</div>

										{orderType === 'limit' && (
											<div>
												<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Limit Price ($)</label>
												<input
													type="number"
													className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
													value={limitPrice}
													onChange={(e) => {
														const val = e.target.value === '' ? '' : Number(e.target.value);
														setLimitPrice(val);
														setShowSummary(false);
													}}
													placeholder="0.00"
												/>
											</div>
										)}

										<div>
											<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
												{action === 'buy' ? 'Investment amount ($)' : 'Amount to sell'}
											</label>
											<input
												type="number"
												className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
												value={amount || ''}
												onChange={(e) => {
													setAmount(Math.max(0, Number(e.target.value) || 0));
													setShowSummary(false);
												}}
												placeholder={action === 'buy' ? '0.00' : '0'}
											/>
										</div>
									</div>

									{/* Order Breakdown */}
									<div className="space-y-3 pt-4 border-t border-gray-100">
										<div className="flex justify-between text-sm">
											<span className="text-gray-500">Estimated Quantity</span>
											<span className="font-bold text-gray-900">{quantity} units</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-500">Fee (0.2%)</span>
											<span className="text-gray-900">{formatPrice(feeEstimate)}</span>
										</div>
										<div className="flex justify-between items-center pt-2">
											<span className="text-base font-bold text-gray-900">{action === 'buy' ? 'Total Charged' : 'Total Proceeds'}</span>
											<span className={`text-xl font-black ${action === 'buy' ? 'text-black' : 'text-orange-600'}`}>{formatPrice(totalRequired)}</span>
										</div>
									</div>

									{showSummary && (
										<div className={`rounded-xl p-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${action === 'buy' ? 'bg-gray-900 text-white' : 'bg-orange-600 text-white'}`}>
											<div className={`font-bold border-b pb-2 mb-2 ${action === 'buy' ? 'border-gray-700' : 'border-orange-500'}`}>Execution Plan</div>
											<p>{action === 'buy' ? 'Buying' : 'Selling'} <span className="font-bold">{quantity}</span> shares of <span className="font-bold">{security.ticker}</span> at <span className="font-bold">{formatPrice(usedPrice)}</span> per share.</p>
										</div>
									)}

									{/* Action Buttons */}
									{!showSummary ? (
										<button
											onClick={() => setShowSummary(true)}
											disabled={isDisabled}
											className={`w-full py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98] ${action === 'buy' ? 'bg-black text-white hover:bg-gray-800' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
										>
											Review Order
										</button>
									) : (
										<div className="flex gap-2">
											<button
												onClick={() => setShowSummary(false)}
												className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
											>
												Edit
											</button>
											<button
												onClick={handleOrder}
												disabled={isDisabled}
												className={`flex-[2] py-4 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg active:scale-[0.98] ${action === 'buy' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
											>
												{isSubmitting ? 'Processing...' : `Confirm ${action === 'buy' ? 'Buy' : 'Sell'}`}
											</button>
										</div>
									)}

									{!user && (
										<p className="text-center text-xs text-gray-500 mt-4">Please sign in to place orders.</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

// Sub-components as per SecurityShow.tsx
function StockDetails({ security, formatMarketCap }: { security: App.DTO.Securityable.StockDTO; formatMarketCap: (n: number) => string }) {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
				<h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<span className="text-sm text-gray-500">P/E Ratio</span>
						<p className="text-2xl font-bold text-gray-900">{security.pe_ratio.toFixed(2)}</p>
					</div>
					<div>
						<span className="text-sm text-gray-500">Dividend Yield</span>
						<p className="text-2xl font-bold text-gray-900">{security.dividend_yield.toFixed(2)}%</p>
					</div>
					{security.company && (
						<div>
							<span className="text-sm text-gray-500">Market Cap</span>
							<p className="text-2xl font-bold text-gray-900">{formatMarketCap(security.company.market_cap)}</p>
						</div>
					)}
				</div>
			</div>

			{security.company && (
				<>
					<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
						<h2 className="text-lg font-semibold mb-4">About {security.company.name}</h2>
						<p className="text-gray-700 leading-relaxed">{security.company.about}</p>
					</div>

					<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
						<h2 className="text-lg font-semibold mb-4">Company Details</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<span className="text-sm text-gray-500">Company Name</span>
								<p className="text-gray-900 font-medium">{security.company.name}</p>
							</div>
							<div>
								<span className="text-sm text-gray-500">Employees</span>
								<p className="text-gray-900 font-medium">{security.company.employee_count.toLocaleString()}</p>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

function CryptoDetails({ security }: { security: App.DTO.Securityable.CryptoDTO }) {
	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
			<h2 className="text-lg font-semibold mb-4">Crypto Information</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<span className="text-sm text-gray-500">Type</span>
					<p className="text-gray-900 font-medium capitalize">{security.type}</p>
				</div>
			</div>
		</div>
	);
}

function BondDetails({ security }: { security: App.DTO.Securityable.BondDTO }) {
	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
			<h2 className="text-lg font-semibold mb-4">Bond Information</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<span className="text-sm text-gray-500">Nominal Value</span>
					<p className="text-gray-900 font-medium">${security.nominal_value.toLocaleString()}</p>
				</div>
				<div>
					<span className="text-sm text-gray-500">Coupon Rate</span>
					<p className="text-gray-900 font-medium">{security.coupon_rate}%</p>
				</div>
				<div>
					<span className="text-sm text-gray-500">Maturity Date</span>
					<p className="text-gray-900 font-medium">
						{new Date(security.maturity_date).toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>
	);
}

function BaseSecurityDetails() {
	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
			<p className="text-gray-600">No additional details available for this security type.</p>
		</div>
	);
}
