<?php

use App\DTO\WatchlistDTO;

test('create', function () {
   $data = [
       'name' => 'My Watchlist',
   ];

    $response = $this->postJson(route('watchlist.create'), $data);

    expect($response->status())->toBe(201)
        ->and($response->json())->toEqual(WatchlistDTO::make($this->user->watchlists()->latest()->first())->toArray());
});
