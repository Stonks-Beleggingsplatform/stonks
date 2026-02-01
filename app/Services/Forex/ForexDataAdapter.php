<?php

namespace App\Services\Forex;

use App\Models\Currency;

interface ForexDataAdapter
{
    public function getExchangeRate(Currency $sourceCurrency, Currency $targetCurrency): ?float;
}
