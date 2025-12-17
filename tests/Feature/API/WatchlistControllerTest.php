<?php

use App\DTO\WatchlistDTO;
use App\Models\Security;
use App\Models\Stock;
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
                ->map(fn (WatchlistDTO $dto) => $dto->jsonSerialize())
                ->toArray()
        );
});

test('show', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);


    $response = $this->getJson(route('watchlist.show', ['watchlist' => $watchlist->id]));

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($watchlist->load(['user', 'securities']), true)
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

test('update', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'name' => 'Updated Watchlist',
    ];

    $response = $this->putJson(route('watchlist.update', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($watchlist->fresh())
                ->jsonSerialize()
        );
});


test('update validation', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'name' => str_repeat('a', 256),
    ];

    $response = $this->putJson(route('watchlist.update', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(422)
        ->and($response->json('errors'))->toHaveKey('name');
});

test('add securities', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $security1 = createTestableSecurity();
    $security2 = createTestableSecurity();

    $data = [
        'securities' => [
            ['ticker' => $security1->ticker],
            ['ticker' => $security2->ticker],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.add', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($watchlist->fresh()->load('securities'))
                ->jsonSerialize()
        );
});

test('add securities validation', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'securities' => [
            ['ticker' => 'INVALID'],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.add', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(422)
        ->and($response->json('errors'))->toHaveKey('securities.0.ticker');
});
