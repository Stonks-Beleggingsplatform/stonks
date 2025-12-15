<?php

use App\DTO\WatchlistDTO;
use App\Models\Watchlist;
use Database\Factories\WatchlistFactory;

test('index', function () {
    $this->user->watchlists()->createMany([
        ['name' => 'Watchlist 1'],
        ['name' => 'Watchlist 2'],
    ]);

    $response = $this->getJson(route('watchlist.index'));

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::collection(
                $this->user->watchlists()
                    ->with(['user', 'securities'])
                    ->get()
            )
                ->map(fn(WatchlistDTO $dto) => $dto->jsonSerialize())
                ->toArray()
        );
});

test('show', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);


    $response = $this->getJson(route('watchlist.show', ['watchlist' => $watchlist->id]));

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($watchlist->load(['user', 'securities']))
                ->jsonSerialize()
        );
});

test('create', function () {
    $data = [
        'name' => 'My Watchlist',
    ];

    $response = $this->postJson(route('watchlist.create'), $data);

    expect($response->status())->toBe(201)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($this->user->watchlists()->latest()->first())
                ->jsonSerialize()
        );
});

test('create validation', function () {
    $response = $this->postJson(route('watchlist.create'), []);

    expect($response->status())->toBe(422)
        ->and($response->json('errors'))->toHaveKey('name');
});
