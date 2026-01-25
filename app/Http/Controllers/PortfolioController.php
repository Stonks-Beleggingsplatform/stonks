<?php

namespace App\Http\Controllers;

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;
use Illuminate\Http\Response;

class PortfolioController extends Controller
{
    public function index(): Response
    {
        $portfolio = Portfolio::where('user_id', auth()->id())
            ->with(['user', 'holdings', 'orders'])
            ->first();

        if (! $portfolio) {
            return response(['message' => 'Portfolio not found.'], 404);
        }

        return response(
            PortfolioDTO::make($portfolio),
            200
        );
    }
}
