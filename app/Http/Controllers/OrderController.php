<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Models\Portfolio;
use App\Models\Security;
use App\Services\BuyOrderService;
use App\Services\SellOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request, BuyOrderService $buyOrderService, SellOrderService $sellOrderService)
    {
        $user = $request->user();

        $data = $request->validate([
            'security_id' => ['required', 'exists:securities,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'action' => ['required', Rule::in(['buy', 'sell'])],
            'type' => ['required', Rule::in(array_column(OrderType::cases(), 'value'))],
            'limit_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        return DB::transaction(function () use ($data, $user, $buyOrderService, $sellOrderService) {
            $portfolio = Portfolio::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
            $security = Security::findOrFail($data['security_id']);

            if ($data['action'] === 'buy') {
                $result = $buyOrderService->execute($portfolio, $security, $data);
            } else {
                $result = $sellOrderService->execute($portfolio, $security, $data);
            }

            return response()->json($result, 201);
        });
    }
}
