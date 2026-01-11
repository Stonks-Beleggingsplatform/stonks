<?php

use App\DTO\WatchlistDTO;
use App\Models\User;
use App\Models\Watchlist;

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

test('update policy', function () {
    $otherUser = User::factory()->create();
    $otherWatchlist = Watchlist::factory()->create(['user_id' => $otherUser->id]);

    $data = [
        'name' => 'Updated Watchlist',
    ];

    $response = $this->putJson(route('watchlist.update', ['watchlist' => $otherWatchlist->id]), $data);

    expect($response->status())->toBe(403);
});

test('delete', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);
    $watchlist->securities()->delete();

    $response = $this->deleteJson(route('watchlist.delete', ['watchlist' => $watchlist->id]));

    expect($response->status())->toBe(200)
        ->and(Watchlist::find($watchlist->id))->toBeNull();
});

test('delete policy', function () {
    $otherUser = User::factory()->create();
    $otherWatchlist = Watchlist::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->deleteJson(route('watchlist.delete', ['watchlist' => $otherWatchlist->id]));

    expect($response->status())->toBe(403);

    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $response = $this->deleteJson(route('watchlist.delete', ['watchlist' => $watchlist->id]));

    expect($response->status())->toBe(403)
        ->and(Watchlist::find($watchlist->id))->not->toBeNull();
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
            WatchlistDTO::make($watchlist->fresh()->load('securities'), true)
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

test('add securities policy', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);
    $otherUser = User::factory()->create();
    $otherWatchlist = Watchlist::factory()->create(['user_id' => $otherUser->id]);

    $security = createTestableSecurity();

    $data = [
        'securities' => [
            ['ticker' => $security->ticker],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.add', ['watchlist' => $otherWatchlist->id]), $data);

    expect($response->status())->toBe(403);
});

test('remove securities', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $security1 = createTestableSecurity();
    $security2 = createTestableSecurity();

    $watchlist->securities()->attach([$security1->id, $security2->id]);

    $data = [
        'securities' => [
            ['ticker' => $security1->ticker],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.remove', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            WatchlistDTO::make($watchlist->fresh()->load('securities'), true)
                ->jsonSerialize()
        );
});

test('remove securities validation', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);

    $data = [
        'securities' => [
            ['ticker' => 'INVALID'],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.remove', ['watchlist' => $watchlist->id]), $data);

    expect($response->status())->toBe(422)
        ->and($response->json('errors'))->toHaveKey('securities.0.ticker');
});

test('remove securities policy', function () {
    $watchlist = Watchlist::factory()->create(['user_id' => $this->user->id]);
    $otherUser = User::factory()->create();
    $otherWatchlist = Watchlist::factory()->create(['user_id' => $otherUser->id]);

    $security = createTestableSecurity();

    $data = [
        'securities' => [
            ['ticker' => $security->ticker],
        ],
    ];

    $response = $this->putJson(route('watchlist.securities.remove', ['watchlist' => $otherWatchlist->id]), $data);

    expect($response->status())->toBe(403);
});
