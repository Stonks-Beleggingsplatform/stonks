<?php

namespace App\Services\SecurityData\Adapters;

use App\DTO\Securityable\BondDTO;
use App\DTO\Securityable\CryptoDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Services\SecurityData\SecurityDataAdapter;

class MockAdapter implements SecurityDataAdapter
{
    public function getPrice(string $ticker): ?float
    {
        return fake()->randomFloat(2, 10, 500);
    }

    public function getSecurityDetails(string $ticker): SecurityDTO
    {
        $type = fake()->randomElement([StockDTO::class, BondDTO::class, CryptoDTO::class]);
        /* @var SecurityDTO $type */

        return $type::mock($ticker);
    }

    public function search(string $term): array
    {
        $results = [];

        for ($i = 0; $i < 5; $i++) {
            $ticker = strtoupper(substr($term, 0, 3)) . fake()->randomNumber(3);
            $results[] = $this->getSecurityDetails($ticker);
        }

        return $results;
    }

    public function getHistoricalData(string $ticker, string $from, string $to): array
    {
        //TODO: Implement mock historical data
        return [];
    }
}
