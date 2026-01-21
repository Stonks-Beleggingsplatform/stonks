import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-black py-24 sm:py-32">
                {/* Background Pattern/Image Placeholder */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
                    {/* Note: In a real app we'd use the generated image path here */}
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1611974717482-58-958899889502?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                            Platform Live
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
                            Invest in the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">future of finance</span>
                        </h1>
                        <p className="text-lg leading-8 text-gray-300 mb-10">
                            Stonks is the premier platform for retail investors. Track your global portfolio, manage fees with precision, and gain insights that institutional investors keep for themselves.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-black bg-white rounded-xl hover:bg-gray-200 transition-all shadow-lg"
                            >
                                Get Started for Free
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="py-24 sm:py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-12">
                        <div className="flex flex-col gap-4 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Real-time Tracking</h3>
                            <p className="text-gray-600">Track your favorite securities across global exchanges with millisecond precision and live updates.</p>
                        </div>

                        <div className="flex flex-col gap-4 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Fee Management</h3>
                            <p className="text-gray-600">Understand exactly what you're paying. Our precise fee calculation engine helps you maximize returns.</p>
                        </div>

                        <div className="flex flex-col gap-4 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Military-Grade Security</h3>
                            <p className="text-gray-600">Your data is encrypted using industry-standard protocols. We prioritize your privacy above everything else.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof / Partners */}
            <div className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by global traders</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale saturate-0">
                        {/* Mock Logos */}
                        <div className="text-2xl font-black italic">NASDAQ</div>
                        <div className="text-2xl font-black italic">FTX</div>
                        <div className="text-2xl font-black italic">BLOOMBERG</div>
                        <div className="text-2xl font-black italic">REUTERS</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
