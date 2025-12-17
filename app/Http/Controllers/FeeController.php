<?php

namespace App\Http\Controllers;

use App\Models\Exchange;
use App\Models\Fee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeController extends Controller
{
    /**
     * Display a listing of exchange fees.
     */
    public function index()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        // Get all exchanges with their "default" fee (where transaction_id is null)
        $exchanges = Exchange::with(['fees' => function ($query) {
            $query->whereNull('transaction_id');
        }])->get();

        return response()->json($exchanges->map(function ($exchange) {
            return [
                'id' => $exchange->id,
                'name' => $exchange->name,
                'fee_amount' => (float) ($exchange->fees->first()?->amount ?? 0),
            ];
        }));
    }

    /**
     * Update or create a fee setting for an exchange.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'fees' => 'required|array',
            'fees.*.exchange_id' => 'required|exists:exchanges,id',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);

        foreach ($request->fees as $feeData) {
            Fee::updateOrCreate(
                [
                    'exchange_id' => $feeData['exchange_id'],
                    'transaction_id' => null, // Default fee setting
                ],
                [
                    'amount' => $feeData['amount'],
                ]
            );
        }

        return response()->json([
            'message' => 'Fees updated successfully',
        ]);
    }
}
