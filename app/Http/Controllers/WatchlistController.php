<?php

namespace App\Http\Controllers;

use App\DTO\WatchlistDTO;
use App\Models\Watchlist;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WatchlistController extends Controller
{
    public function index(): Response
    {
      $watchlists = Watchlist::where('user_id', auth()->id())
          ->with(['user', 'securities'])
          ->get();

        return response(
            WatchlistDTO::collection($watchlists),
            200
        );
    }


    public function create(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $watchlist = $request->user()->watchlists()->create([
            'name' => $request->name,
        ]);

        return response(
            WatchlistDTO::make($watchlist),
            201
        );
    }
}
