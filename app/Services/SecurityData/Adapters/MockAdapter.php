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
        $count = fake()->numberBetween(1, 5);

        for ($i = 0; $i < $count; $i++) {
            $results[] = $this->getSecurityDetails($term . fake()->bothify('???###'));
        }
        return $results;
    }

    public function getHistoricalData(string $ticker, string $from, string $to): array
    {
        //TODO: Implement mock historical data
        return [];
    }
}
