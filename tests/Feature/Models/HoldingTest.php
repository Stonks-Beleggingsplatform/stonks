<?php

use App\Models\Holding;
use App\Models\Portfolio;
use App\Models\Security;

beforeEach(function () {
    $this->holding = Holding::factory()->create();
});

test('holding attributes', function () {
    expect($this->holding)->toBeInstanceOf(Holding::class)
        ->and($this->holding->quantity)->toBeGreaterThan(0)
        ->and($this->holding->purchase_price)->toBeGreaterThan(0)
        ->and($this->holding->avg_price)->toBeGreaterThan(0)
        ->and($this->holding->gain_loss)->toBeNumeric();
});

test('holding relationships', function () {
    expect($this->holding->portfolio)->toBeInstanceOf(Portfolio::class)
        ->and($this->holding->security)->toBeInstanceOf(Security::class);
});
