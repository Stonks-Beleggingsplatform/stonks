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
            $security = Security::findOrFail($data['security_id']);

            $priceEuro = $data['type'] === OrderType::LIMIT->value
                ? $data['limit_price']
                : $security->price;

            if (! $priceEuro || $priceEuro <= 0) {
                abort(422, 'Invalid price');
            }

            $price = (int) round($priceEuro * 100);

            $subtotal = $data['quantity'] * $price;
            $fee = (int) round($subtotal * 0.002);
            $totalRequired = $subtotal + $fee;

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

            Transaction::create([
                'order_id' => $order->id,
                'type' => 'buy',
                'amount' => $totalRequired,
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
