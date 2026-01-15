<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Security;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'security_id' => ['required', 'exists:securities,id'],
        'quantity' => ['required', 'integer', 'min:1'],
        'action' => ['required', Rule::in(['buy'])],
        'type' => ['required', Rule::in(['market', 'limit'])],
        'limit_price' => ['nullable', 'numeric', 'min:0'],
    ]);

    return DB::transaction(function () use ($data, $user) {
        $portfolio = Portfolio::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
        $security = Security::findOrFail($data['security_id']);

        $priceEuro = $data['type'] === 'limit'
            ? $data['limit_price']
            : $security->price;

        if (!$priceEuro || $priceEuro <= 0) {
            abort(422, 'Invalid price');
        }

        $price = (int) round($priceEuro * 100); // price in cents

        $subtotal = $data['quantity'] * $price; // cents
        $fee = (int) round($subtotal * 0.002); // cents
        $totalRequired = $subtotal + $fee; // cents

        if ($portfolio->cash < $totalRequired) {
            abort(422, 'Insufficient cash');
        }

        // CASH ER AF
        $portfolio->cash -= $totalRequired;
        $portfolio->save();

        $order = Order::create([
            'portfolio_id' => $portfolio->id,
            'security_id' => $security->id,
            'quantity' => $data['quantity'],
            'price' => $price, // cents
            'type' => $data['type'],
            'action' => 'buy',
            'status' => 'pending',
        ]);

        $order->status = 'completed';
        $order->save();

        $holding = \App\Models\Holding::query()
            ->where('portfolio_id', $portfolio->id)
            ->where('security_id', $security->id)
            ->first();

        if (!$holding) {
            $holding = \App\Models\Holding::create([
                'portfolio_id' => $portfolio->id,
                'security_id' => $security->id,
                'quantity' => $data['quantity'],
                'purchase_price' => $price, // cents
                'avg_price' => $price, // cents
                'gain_loss' => 0,
            ]);
        } else {
            $oldQty = (int) $holding->quantity;
            $newQty = $oldQty + (int) $data['quantity'];

            $oldAvg = (float) ($holding->avg_price ?? $price);
            $newAvg = (int) round((($oldQty * $oldAvg) + ($data['quantity'] * $price)) / max(1, $newQty));

            $holding->quantity = $newQty;
            $holding->avg_price = $newAvg;
            $holding->save();
        }

        \App\Models\Transaction::create([
            'order_id' => $order->id,
            'type' => 'buy',
            'amount' => $totalRequired, // cents
            'price' => $price, // cents
            'exchange_rate' => null,
        ]);

        return response()->json([
            'message' => 'Order executed successfully',
            'order' => [
              'id' => $order->id,
              'status' => $order->status,
              'executed_price' => $price / 100,
              'executed_at' => now()->toDateTimeString(),
            ],
          ], 201);
    });
}
}