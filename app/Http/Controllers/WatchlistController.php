<?php

namespace App\Http\Controllers;

use App\DTO\WatchlistDTO;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WatchlistController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255']
        ]);

        $watchlist = $request->user()->watchlists()->create([
            'name' => $request->name
        ]);

        return response(
            WatchlistDTO::make($watchlist)->toArray(),
            201
        );
    }
}
