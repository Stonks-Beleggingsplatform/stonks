<?php

namespace App\Services\Forex;

use App\Models\Currency;
use App\Services\Forex\Adapters\ForexAdapter;
use App\Services\Forex\Adapters\MockForexAdapter;

class ForexDataService
{
    private ForexDataAdapter $adapter;

    public function __construct(?ForexDataAdapter $adapter = null)
    {
        $this->adapter = $adapter ?? config('app.env') === 'testing'
            ? new MockForexAdapter
            : new ForexAdapter;
    }

    public function convert(Currency $sourceCurrency, Currency $targetCurrency, float $amount): float
    {
        if ($sourceCurrency->id === $targetCurrency->id) {
            return $amount;
        }

        $rate = $this->adapter->getExchangeRate($sourceCurrency, $targetCurrency);

        if ($rate === null) {
            return $amount;
        }

        return $amount * $rate;
    }
}
