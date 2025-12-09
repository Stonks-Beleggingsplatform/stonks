<?php

namespace App\Http\Controllers;

use App\DTO\WatchlistDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WatchlistController extends Controller
{
    public function create(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255']
        ]);

        $watchlist = $request->user()->watchlists()->create([
            'name' => $request->name
        ]);

        return response(
            WatchlistDTO::make($watchlist),
            201
        );
    }
}
