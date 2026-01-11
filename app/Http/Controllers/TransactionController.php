<?php

namespace App\Http\Controllers;

use App\DTO\TransactionDTO;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        return TransactionDTO::collection(
            Transaction::where('portfolio_id', auth()->user()->portfolio->id)
                ->with(['order', 'security'])
                ->get(),
        );
    }
}
