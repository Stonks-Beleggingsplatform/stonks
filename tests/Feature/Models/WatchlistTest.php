<?php

use App\Models\Watchlist;

beforeEach(function () {
   $this->watchlist = Watchlist::factory()->create();
});

test('watchlist attributes', function () {
    expect($this->watchlist)->toBeInstanceOf(Watchlist::class)
        ->and($this->watchlist->name)->not->toBeEmpty()
        ->and($this->watchlist->description)->not->toBeEmpty();
});
