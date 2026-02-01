<?php

namespace Tests\Feature\Services;

use App\Models\Currency;
use App\Services\Forex\Adapters\MockForexAdapter;
use App\Services\Forex\ForexDataService;

beforeEach(function () {
    $this->service = new ForexDataService(
        new MockForexAdapter
    );
});

test('it can convert currency using mock adapter from USD to EUR', function () {
    // Arrange
    $usd = Currency::factory()->create(['name' => 'USD']);
    $eur = Currency::factory()->create(['name' => 'EUR']);
    $amount = 100;

    // Act
    $convertedAmount = $this->service->convert($usd, $eur, $amount);

    // Assert
    // From MockForexAdapter: 'USD_EUR' => 0.92
    $this->assertEquals($amount * 0.92, $convertedAmount);
});
