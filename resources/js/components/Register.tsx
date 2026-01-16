import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function Register() {
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] | string | null }>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Password criteria check
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        number: false,
        symbol: false
    });

    useEffect(() => {
        setPasswordCriteria({
            length: formData.password.length >= 8,
            uppercase: /[A-Z]/.test(formData.password),
            number: /[0-9]/.test(formData.password),
            symbol: /[^A-Za-z0-9]/.test(formData.password)
        });
    }, [formData.password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const validateStep1 = () => {
        const stepErrors: { [key: string]: string[] } = {};
        if (!formData.name) stepErrors.name = ['Full name is required'];
        if (!formData.email) {
            stepErrors.email = ['Email is required'];
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            stepErrors.email = ['Email must be valid'];
        }

        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return false;
        }
        return true;
    };

    const nextStep = async () => {
        if (!validateStep1()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await api.post('/check-email', { email: formData.email });
            setStep(2);
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const prevStep = () => {
        setStep(1);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final sanity check for password criteria before submitting
        if (!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.number || !passwordCriteria.symbol) {
            setErrors({ password: ['Password does not meet all criteria'] });
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: ['Passwords do not match'] });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            await register(formData);
            navigate('/');
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const CriteriaItem = ({ met, label }: { met: boolean; label: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-gray-300'}`} />
            {label}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Join Stonks</h2>
                    <p className="mt-2 text-sm text-gray-600">Secure your financial future today</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
                    <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
                </div>

                <div className="bg-white py-10 px-8 shadow-xl border border-gray-100 rounded-2xl">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {errors.general && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 mb-6">
                                {errors.general}
                            </div>
                        )}

                        {step === 1 ? (
                            /* Step 1: Basics */
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none ${errors.name ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none ${errors.email ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? 'Verifying...' : 'Continue'}
                                    {!isLoading && <span>→</span>}
                                </button>
                            </div>
                        ) : (
                            /* Step 2: Security */
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Create Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none ${errors.password ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <CriteriaItem met={passwordCriteria.length} label="Min. 8 characters" />
                                        <CriteriaItem met={passwordCriteria.uppercase} label="Uppercase letter" />
                                        <CriteriaItem met={passwordCriteria.number} label="Number" />
                                        <CriteriaItem met={passwordCriteria.symbol} label="Special symbol" />
                                    </div>
                                    {errors.password && <p className="mt-2 text-xs text-red-600 font-medium">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none ${errors.password_confirmation ? 'border-red-300 ring-red-100' : ''}`}
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-600 font-medium">{Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}</p>}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all border-dashed"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="flex-[2] bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {isLoading ? 'Creating account...' : 'Complete Setup'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-black hover:underline underline-offset-4 transition-all">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer trust badge */}
            <div className="mt-8 text-center sm:mx-auto sm:w-full sm:max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 17.5a9.954 9.954 0 01-6.711-2.58A10.155 10.155 0 013 7a9.93 9.93 0 01.127-1.58A13.95 13.95 0 0010 3.015c2.476 0 4.79.643 6.873 1.77A9.93 9.93 0 0117 7c0 4.307-2.613 8.01-6.4 9.243a9.922 9.922 0 01-.6 1.257zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Bank-grade security encryption
                </div>
            </div>
        </div>
    );
}
