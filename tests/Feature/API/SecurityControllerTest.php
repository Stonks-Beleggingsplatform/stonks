<?php

use App\DTO\Securityable\BondDTO;
use App\DTO\Securityable\CryptoDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Models\Bond;
use App\Models\Company;
use App\Models\Crypto;
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

    $this->stock = Stock::find($this->security->securityable_id);
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

    expect($response->status())->toBe(200)
        ->and($response->json())->toMatchArray(StockDTO::make($this->stock)->jsonSerialize());
});

test('show returns bond details', function () {
    $bondSecurity = Security::create([
        'ticker' => 'GOVT2025',
        'name' => 'Government Bond 2025',
        'price' => 100000,
        'exchange_id' => Exchange::factory()->create(['name' => 'NYSE'])->id,
        'securityable_type' => Bond::class,
        'securityable_id' => Bond::factory()->create()->id,
    ]);

    $bond = Bond::find($bondSecurity->securityable_id);

    $response = $this->getJson("/api/securities/{$bondSecurity->ticker}");

    expect($response->status())->toBe(200)
        ->and($response->json())->toMatchArray(BondDTO::make($bond)->jsonSerialize());
});

test('show returns crypto details', function () {
    $cryptoSecurity = Security::create([
        'ticker' => 'BTC',
        'name' => 'Bitcoin',
        'price' => 5000000,
        'exchange_id' => Exchange::factory()->create(['name' => 'CryptoExchange'])->id,
        'securityable_type' => Crypto::class,
        'securityable_id' => Crypto::factory()->create()->id,
    ]);

    $crypto = Crypto::find($cryptoSecurity->securityable_id);

    $response = $this->getJson("/api/securities/{$cryptoSecurity->ticker}");

    expect($response->status())->toBe(200)
        ->and($response->json())->toMatchArray(CryptoDTO::make($crypto)->jsonSerialize());
});

test('show returns 404 for non-existent security', function () {
    $response = $this->getJson('/api/securities/UNKNOWN');

    expect($response->status())->toBe(404);
});
