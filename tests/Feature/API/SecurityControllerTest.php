<?php

use App\DTO\SecurityDTO;
use App\Models\Exchange;
use App\Models\Security;
use App\Models\Stock;

beforeEach(function () {
    $this->security = Security::create([
        'ticker' => 'AAPL',
        'name' => 'Apple Inc.',
        'price' => 15000, // Stored as integer in cents
        'exchange_id' => Exchange::factory()->create(['name' => 'NASDAQ'])->id,
        'securityable_type' => Stock::class,
        'securityable_id' => Stock::factory()->create()->id,
    ]);
});

test('index searches securities by ticker', function () {
    $response = $this->getJson('/api/securities/search/AAPL');

    expect($response->status())->toBe(200)
        ->and($response->json())->toHaveCount(1)
        ->and($response->json()[0])->toMatchArray(SecurityDTO::make($this->security)->jsonSerialize());
});

test('index searches securities by name', function () {
    $response = $this->getJson('/api/securities/search/apple');

    expect($response->status())->toBe(200)
        ->and($response->json())->toHaveCount(1)
        ->and($response->json()[0])->toMatchArray(SecurityDTO::make($this->security)->jsonSerialize());
});

test('index returns empty array when no securities match', function () {
    $response = $this->getJson('/api/securities/search/gibberish');

    expect($response->status())->toBe(200)
        ->and($response->json())->toHaveCount(0);
});
