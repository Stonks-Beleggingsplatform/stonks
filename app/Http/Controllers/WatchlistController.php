<?php

namespace App\Http\Controllers;

use App\DTO\WatchlistDTO;
use App\Models\Security;
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
            WatchlistDTO::collection($watchlists, true),
            200
        );
    }

    public function show(Watchlist $watchlist): Response
    {
        $this->authorize('view', $watchlist);

        return response(
            WatchlistDTO::make($watchlist->load(['user', 'securities']), true),
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

    public function update(Request $request, Watchlist $watchlist): Response
    {
        $this->authorize('update', $watchlist);

        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
        ]);

        if ($request->has('name')) {
            $watchlist->name = $request->name;
        }

        $watchlist->save();

        return response(
            WatchlistDTO::make($watchlist),
            200
        );
    }

    public function delete(Watchlist $watchlist): Response
    {
        $this->authorize('delete', $watchlist);

        $watchlist->delete();

        return response(null, 200);
    }

    public function addSecurities(Request $request, Watchlist $watchlist): Response
    {
        $this->authorize('update', $watchlist);

        $request->validate([
            'securities' => ['required', 'array'],
            'securities.*.ticker' => ['required', 'string', 'exists:securities,ticker'],
        ]);

        $tickers = collect($request->securities)->pluck('ticker')->toArray();

        $securities = Security::query()
            ->whereIn('ticker', $tickers)
            ->pluck('id')
            ->toArray();

        $watchlist->securities()->syncWithoutDetaching($securities);

        return response(
            WatchlistDTO::make($watchlist->load('securities'), true),
            200
        );
    }

    public function removeSecurities(Request $request, Watchlist $watchlist): Response
    {
        $this->authorize('update', $watchlist);

        $request->validate([
            'securities' => ['required', 'array'],
            'securities.*.ticker' => ['required', 'string', 'exists:securities,ticker'],
        ]);

        $tickers = collect($request->securities)->pluck('ticker')->toArray();

        $securities = Security::query()
            ->whereIn('ticker', $tickers)
            ->pluck('id')
            ->toArray();

        $watchlist->securities()->detach($securities);

        return response(
            WatchlistDTO::make($watchlist->load('securities'), true),
            200
        );
    }
}
