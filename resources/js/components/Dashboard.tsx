export default function Dashboard() {
    // Mock data for the "Stonks" app
    const portfolioValue = 12450.80;
    const dayChange = 234.50;
    const dayChangePercent = 1.92;

    const stocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.25, changePercent: 0.72 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', price: 205.60, change: -3.40, changePercent: -1.63 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 460.15, change: 12.30, changePercent: 2.75 },
        { symbol: 'GME', name: 'GameStop Corp.', price: 15.20, change: 0.80, changePercent: 5.56 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 370.25, change: 2.10, changePercent: 0.57 },
    ];

    return (
        <div>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Portfolio Summary */}
                <section className="mb-8">
                    <h2 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h2>
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h1>
                        <div className={`flex items-center text-sm font-medium ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)} ({dayChangePercent}%)</span>
                            <span className="ml-1 text-gray-400">Today</span>
                        </div>
                    </div>
                </section>

                {/* Watchlist / Stocks */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Watchlist</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stocks.map((stock) => (
                            <div key={stock.symbol} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-bold text-lg">{stock.symbol}</div>
                                        <div className="text-sm text-gray-500">{stock.name}</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stock.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {stock.change >= 0 ? '↗' : '↘'}
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xl font-semibold">${stock.price.toFixed(2)}</div>
                                    <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['Buy', 'Sell', 'Transfer', 'History'].map((action) => (
                            <button key={action} className="p-4 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors text-center">
                                {action}
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
