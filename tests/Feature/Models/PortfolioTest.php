<?php

use App\Models\Portfolio;

beforeEach(function () {
    $this->portfolio = Portfolio::factory()->create();
});

test('portfolio attributes', function () {
    expect($this->portfolio)->toBeInstanceOf(Portfolio::class)
        ->and($this->portfolio->cash)->toBeGreaterThanOrEqual(0)
        ->and($this->portfolio->total_value)->toBeGreaterThanOrEqual(0)
        ->and($this->portfolio->total_return)->toBeNumeric();
});

test('portfolio relationships', function () {
    expect($this->portfolio->user)->not->toBeNull();
});
