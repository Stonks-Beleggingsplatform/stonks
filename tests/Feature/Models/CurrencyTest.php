<?php

use App\Models\Currency;
use App\Models\Exchange;
use App\Models\Portfolio;

beforeEach(function () {
    $this->currency = Currency::factory()->create();
});

test('currency attributes', function () {
    expect($this->currency)->toBeInstanceOf(Currency::class)
        ->and($this->currency->name)->toBeString()
        ->and(strlen($this->currency->name))->toBe(3); // ISO code assumption
});

test('currency relationships', function () {
    $exchange = Exchange::factory()->create(['currency_id' => $this->currency->id]);
    $portfolio = Portfolio::factory()->create(['currency_id' => $this->currency->id]);

    $this->currency->portfolios->each(function ($portfolio) {
    expect($portfolio)->toBeInstanceOf(Portfolio::class);
});
});