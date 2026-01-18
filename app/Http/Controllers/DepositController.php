<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepositController extends Controller
{
    /**
     * Get the current user's balance.
     */
    public function getBalance(): JsonResponse
    {
        return response()->json([
            'balance' => Auth::user()->portfolio?->cash ?? 0.00,
        ]);
    }

    /**
     * Simulate a deposit (for demo/mock purposes).
     */
    public function simulate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = Auth::user();
        $portfolio = $user->portfolio;

        if (! $portfolio) {
            return response()->json(['message' => 'User has no portfolio'], 404);
        }

        $portfolio->cash += $validated['amount'];
        $portfolio->save();

        return response()->json([
            'message' => 'Deposit simulated successfully',
            'balance' => $portfolio->cash,
        ]);
    }

    /**
     * Create a real Stripe Checkout Session.
     */
    public function createSession(Request $request): JsonResponse
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
