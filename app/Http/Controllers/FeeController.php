<?php

namespace App\Http\Controllers;

use App\DTO\Securityable\FeeDTO;
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

        // Get all exchanges with their "default" fees (where transaction_id is null)
        $exchanges = Exchange::with(['currency', 'fees' => function ($query) {
            $query->whereNull('transaction_id');
        }])->get();

        return response()->json(FeeDTO::collection($exchanges));
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
            'fees.*.description' => 'nullable|string',
            'fees.*.transaction_fee' => 'required|numeric|min:0',
            'fees.*.maintenance_fee' => 'required|numeric|min:0',
            'fees.*.order_fee' => 'required|numeric|min:0',
        ]);

        foreach ($request->fees as $feeData) {
            // Update Exchange Description
            Exchange::where('id', $feeData['exchange_id'])->update([
                'description' => $feeData['description'] ?? '',
            ]);

            // Update Transaction Fee
            Fee::updateOrCreate(
                [
                    'exchange_id' => $feeData['exchange_id'],
                    'transaction_id' => null,
                    'type' => 'transaction',
                ],
                [
                    'amount' => (int) ($feeData['transaction_fee'] * 100),
                ]
            );
 
            // Update Maintenance Fee
            Fee::updateOrCreate(
                [
                    'exchange_id' => $feeData['exchange_id'],
                    'transaction_id' => null,
                    'type' => 'maintenance',
                ],
                [
                    'amount' => (int) ($feeData['maintenance_fee'] * 100),
                ]
            );
 
            // Update Order Fee
            Fee::updateOrCreate(
                [
                    'exchange_id' => $feeData['exchange_id'],
                    'transaction_id' => null,
                    'type' => 'order',
                ],
                [
                    'amount' => (int) ($feeData['order_fee'] * 100),
                ]
            );
        }


        return response()->json([
            'message' => 'Fees updated successfully',
        ]);
    }
}
