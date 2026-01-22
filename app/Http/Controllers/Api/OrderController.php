<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderType;
use App\Http\Controllers\Controller;
use App\Models\Holding;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Security;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'security_id' => ['required', 'exists:securities,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'action' => ['required', Rule::in(['buy'])],
            'type' => ['required', Rule::in(array_column(OrderType::cases(), 'value'))],
            'limit_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        return DB::transaction(function () use ($data, $user) {
            $portfolio = Portfolio::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
                $portfolioCash = (int) $portfolio->cash * 100;

            $security = Security::findOrFail($data['security_id']);
            $is_limit_order = $data['type'] === OrderType::LIMIT->value;
            $limit_price_cents = $is_limit_order ? (int) round($data['limit_price'] * 100) : 0;

            // Add limit order uncompleted
            if ($is_limit_order && $limit_price_cents < $security->price) {
                $order = Order::create([
                    'portfolio_id' => $portfolio->id,
                    'security_id' => $security->id,
                    'quantity' => $data['quantity'],
                    'price' => $limit_price_cents,
                    'type' => $data['type'],
                    'action' => 'buy',
                    'status' => 'pending',
                ]);

                return response()->json([
                    'message' => 'Limit order placed and is pending execution.',
                    'order' => [
                        'id' => $order->id,
                        'status' => $order->status,
                    ],
                ], 201);
            }

            // Proceed with immediate execution for Market Orders OR for Limit Orders where the price condition is met.
            $price = $is_limit_order ? $limit_price_cents : (int) $security->price;

            if (! $price || $price <= 0) {
                abort(422, 'Invalid price');
            }

            $subtotal = $data['quantity'] * $price;
            $fee = (int) round($subtotal * 0.002);
            $totalRequired = $subtotal + $fee;

            if ($portfolioCash < $totalRequired) {
                abort(422, 'Insufficient cash');
            }

            // Deduct cash and update portfolio value
            $portfolioCash -= $totalRequired;
                $portfolio->cash = $portfolioCash / 100;
            $portfolio->total_value += $subtotal;
            $portfolio->save();

            // Create and immediately complete the order
            $order = Order::create([
                'portfolio_id' => $portfolio->id,
                'security_id' => $security->id,
                'quantity' => $data['quantity'],
                'price' => $price,
                'type' => $data['type'],
                'action' => 'buy',
                'status' => 'completed', // Status is completed as it's executed
            ]);

            // Update or create a holding
            $holding = Holding::query()
                ->where('portfolio_id', $portfolio->id)
                ->where('security_id', $security->id)
                ->first();

            if (! $holding) {
                $holding = Holding::create([
                    'portfolio_id' => $portfolio->id,
                    'security_id' => $security->id,
                    'quantity' => $data['quantity'],
                    'purchase_price' => $price,
                    'avg_price' => $price,
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

            // Create a transaction record
            Transaction::create([
                'order_id' => $order->id,
                'type' => 'buy',
                'amount' => $data['quantity'],
                'price' => $price,
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
