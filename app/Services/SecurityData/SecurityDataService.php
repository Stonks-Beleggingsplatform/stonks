<?php

namespace App\Services\SecurityData;

use App\DTO\SecurityDTO;
use App\Services\SecurityData\Adapters\AlphaVantageAdapter;

class SecurityDataService
{
    private SecurityDataAdapter $adapter;

    public function __construct(?SecurityDataAdapter $adapter = null)
    {
        $this->adapter = $adapter ?? new AlphaVantageAdapter();
    }

    public function getPrice(string $ticker): ?float
    {
        return $this->adapter->getPrice($ticker);
    }

    public function getSecurityDetails(string $ticker): ?SecurityDTO
    {
        return $this->adapter->getSecurityDetails($ticker);
    }

    public function search(string $term): array
    {
        return $this->adapter->search($term);
    }

    public function getHistoricalData(string $ticker, string $from, string $to): array
    {
        return $this->adapter->getHistoricalData($ticker, $from, $to);
    }
}
