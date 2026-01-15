<?php

namespace App\Http\Controllers;

use App\DTO\TransactionDTO;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        $orders = auth()->user()?->portfolio?->orders()->whereHas('transactions')->get();

        return TransactionDTO::collection(
            Transaction::whereIn('order_id', $orders->pluck('id'))->get()
        );
    }
}
