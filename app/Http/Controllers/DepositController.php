<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepositController extends Controller
{
    /**
     * Get the current user's balance.
     */
    public function getBalance()
    {
        return response()->json([
            'balance' => Auth::user()->balance ?? 0.00,
        ]);
    }

    /**
     * Simulate a deposit (for demo/mock purposes).
     */
    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = Auth::user();
        $user->balance += $validated['amount'];
        $user->save();

        return response()->json([
            'message' => 'Deposit simulated successfully',
            'balance' => $user->balance,
        ]);
    }

    /**
     * Create a real Stripe Checkout Session.
     */
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = Auth::user();
        
        // Ensure user is a Stripe customer
        $user->createOrGetStripeCustomer();

        // Convert amount to cents for Stripe
        $amountInCents = (int) ($validated['amount'] * 100);

        return $user->checkoutCharge($amountInCents, 'Stonks Portfolio Deposit', 1, [
            'success_url' => url('/dashboard?deposit=success'),
            'cancel_url' => url('/deposit?deposit=cancelled'),
        ]);
    }
}
