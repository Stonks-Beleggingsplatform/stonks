<?php

use App\Models\Portfolio;
use App\Models\User;
use App\Models\Watchlist;
use App\Models\Notification;

beforeEach(function () {
    $this->user = User::factory()
        ->hasWatchlists()
        ->hasPortfolio()
        ->hasNotifications()
        ->create();
});

test('user attributes', function () {
    expect($this->user)->toBeInstanceOf(User::class)
        ->and($this->user->email)->toContain('@')
        ->and($this->user->name)->not->toBeEmpty();
});

test('user relationships', function () {
    expect($this->user->watchlists)->each->toBeInstanceOf(Watchlist::class)
        ->and($this->user->portfolio)->toBeInstanceOf(Portfolio::class)
        ->and($this->user->notifications)->each->toBeInstanceOf(Notification::class);
});
