<?php

use App\DTO\SecurityDTO;
use App\Models\Bond;
use App\Models\Company;
use App\Models\Crypto;
use App\Models\Exchange;
use App\Models\Stock;

beforeEach(function () {
    $this->stock = Stock::factory()->create();
    $this->security = $this->stock->security;
    $this->security->update([
        'ticker' => 'AAPL',
        'name' => 'Apple Inc.',
        'price' => 15000,
        'exchange_id' => Exchange::factory()->create(['name' => 'NASDAQ'])->id,
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

test('show returns stock details', function () {
    $this->stock->update([
        'company_id' => Company::factory()->create()->id,
    ]);

    $response = $this->getJson("/api/securities/{$this->security->ticker}");

    expect($response->status())->toBe(200);
});

test('show returns bond details', function () {
    $bond = Bond::factory()->create();
    $bondSecurity = $bond->security;
    $bondSecurity->update([
        'ticker' => 'GOVT2025',
        'name' => 'Government Bond 2025',
        'price' => 100000,
        'exchange_id' => Exchange::factory()->create(['name' => 'NYSE'])->id,
    ]);

    $response = $this->getJson("/api/securities/{$bondSecurity->ticker}");

    expect($response->status())->toBe(200);
});

test('show returns crypto details', function () {
    $crypto = Crypto::factory()->create();
    $cryptoSecurity = $crypto->security;
    $cryptoSecurity->update([
        'ticker' => 'BTC',
        'name' => 'Bitcoin',
        'price' => 5000000,
        'exchange_id' => Exchange::factory()->create(['name' => 'CryptoExchange'])->id,
    ]);

    $response = $this->getJson("/api/securities/{$cryptoSecurity->ticker}");

    expect($response->status())->toBe(200);
});

test('show returns 404 for non-existent security', function () {
    $response = $this->getJson('/api/securities/UNKNOWN');

    expect($response->status())->toBe(404);
});
