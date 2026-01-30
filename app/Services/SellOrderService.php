<?php

namespace App\Services;

use App\Enums\OrderType;
use App\Models\Holding;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Security;
use App\Models\Transaction;

class SellOrderService
{
    public function execute(Portfolio $portfolio, Security $security, array $data)
    {
        $portfolioCash = (int) ($portfolio->cash * 100);
        $is_limit_order = $data['type'] === OrderType::LIMIT->value;
        $limit_price_cents = $is_limit_order ? (int) round($data['limit_price'] * 100) : 0;

        $holding = Holding::query()
            ->where('portfolio_id', $portfolio->id)
            ->where('security_id', $security->id)
            ->first();

        if (! $holding || $holding->quantity < $data['quantity']) {
            abort(422, 'Insufficient holdings');
        }

        // Add sell limit order uncompleted
        if ($is_limit_order && $limit_price_cents > $security->price) {
            $order = Order::create([
                'portfolio_id' => $portfolio->id,
                'security_id' => $security->id,
                'quantity' => $data['quantity'],
                'price' => $limit_price_cents,
                'type' => $data['type'],
                'action' => 'sell',
                'status' => 'pending',
            ]);

            return [
                'message' => 'Sell limit order placed and is pending execution.',
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                ],
            ];
        }

        $price = $is_limit_order ? $limit_price_cents : (int) $security->price;

        if (! $price || $price <= 0) {
            abort(422, 'Invalid price');
        }

        $subtotal = $data['quantity'] * $price;
        $fee = (int) round($subtotal * 0.002);
        $proceeds = $subtotal - $fee;

        // Update cash and portfolio value
        $portfolioCash += $proceeds;
        $portfolio->cash = $portfolioCash / 100;
        $portfolio->total_value -= $data['quantity'] * $holding->avg_price;
        $portfolio->save();

        // Update or delete holding
        if ($holding->quantity == $data['quantity']) {
            $holding->delete();
        } else {
            $holding->quantity -= $data['quantity'];
            $holding->save();
        }

        // Create completed sell order
        $order = Order::create([
            'portfolio_id' => $portfolio->id,
            'security_id' => $security->id,
            'quantity' => $data['quantity'],
            'price' => $price,
            'type' => $data['type'],
            'action' => 'sell',
            'status' => 'completed',
        ]);

        // Create transaction
        Transaction::create([
            'order_id' => $order->id,
            'type' => 'sell',
            'amount' => $data['quantity'],
            'price' => $price,
            'exchange_rate' => null,
        ]);

        return [
            'message' => 'Security sold successfully',
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'executed_price' => $price / 100,
                'proceeds' => $proceeds / 100,
                'executed_at' => now()->toDateTimeString(),
            ],
        ];
    }
}
