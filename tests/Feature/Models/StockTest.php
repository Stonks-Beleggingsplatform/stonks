<?php

use App\Models\Security;
use App\Models\Stock;

beforeEach(function () {
    $this->stock = Stock::factory()->create();
});

test('stock attributes', function () {
    expect($this->stock)->toBeInstanceOf(Stock::class)
        ->and($this->stock->pe_ratio)->toBeGreaterThanOrEqual(5)
        ->and($this->stock->pe_ratio)->toBeLessThanOrEqual(30)
        ->and($this->stock->dividend_yield)->toBeGreaterThanOrEqual(0)
        ->and($this->stock->dividend_yield)->toBeLessThanOrEqual(10);
});

test('stock relationships', function () {
    expect($this->stock->security)->not->toBeNull()
        ->and($this->stock->security)->toBeInstanceOf(Security::class);
});
