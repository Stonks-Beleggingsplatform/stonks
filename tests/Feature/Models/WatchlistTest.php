<?php

use App\Models\Security;
use App\Models\Watchlist;

beforeEach(function () {
    $this->watchlist = Watchlist::factory()
        ->create();
});

test('watchlist attributes', function () {
    expect($this->watchlist)->toBeInstanceOf(Watchlist::class)
        ->and($this->watchlist->name)->toBeString();
});

test('watchlist relationships', function () {
    expect($this->watchlist->user)->not->toBeNull()
        ->and($this->watchlist->securities)->each->toBeInstanceOf(Security::class);
});
