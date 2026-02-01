<?php

namespace App\Services\Forex\Adapters;

use App\Models\Currency;
use App\Services\Forex\ForexDataAdapter;
use Illuminate\Support\Facades\Log;

class MockForexAdapter implements ForexDataAdapter
{
    public function getExchangeRate(Currency $sourceCurrency, Currency $targetCurrency): ?float
    {
        Log::info("MockForexAdapter: Converting {$sourceCurrency->name} to {$targetCurrency->name}");

        if ($sourceCurrency->id === $targetCurrency->id) {
            return 1.0;
        }

        // Dummy conversion rates for common pairs
        $rates = [
            'USD_EUR' => 0.92,
            'EUR_USD' => 1.08,
            'USD_GBP' => 0.79,
            'GBP_USD' => 1.27,
            'EUR_GBP' => 0.85,
            'GBP_EUR' => 1.18,
        ];

        $key1 = "{$sourceCurrency->name}_{$targetCurrency->name}";
        $key2 = "{$targetCurrency->name}_{$sourceCurrency->name}";

        if (isset($rates[$key1])) {
            return $rates[$key1];
        }

        if (isset($rates[$key2])) {
            return 1 / $rates[$key2]; // Invert the rate if the reverse pair exists
        }

        // Fallback to a generic rate or null if not found
        // For a mock, a fixed rate or a small random variation could be used
        return fake()->randomFloat(2, 0.5, 1.5);
    }
}
