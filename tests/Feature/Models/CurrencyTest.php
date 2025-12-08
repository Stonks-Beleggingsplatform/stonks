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
        ->and($this->currency->name)->toBeString();
});

test('currency relationships', function () {
    $exchange = Exchange::factory()->create(['currency_id' => $this->currency->id]);
    $portfolio = Portfolio::factory()->create(['currency_id' => $this->currency->id]);

    expect($this->currency->portfolios)->each->toBeInstanceOf(Portfolio::class);
});
