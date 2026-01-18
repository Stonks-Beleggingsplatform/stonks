<?php

namespace App\Services\SecurityData\Adapters;

use App\DTO\HistoricalPriceDTO;
use App\DTO\Securityable\BondDTO;
use App\DTO\Securityable\CryptoDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Models\Security;
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
            $ticker = strtoupper(substr($term, 0, 3)).fake()->randomNumber(3);
            $results[] = $this->getSecurityDetails($ticker);
        }

        return $results;
    }

    public function getHistoricalData(Security $security): array
    {
        $data = [];
        $startDate = now()->subMonths(6);
        $endDate = now();

        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            $data[] = HistoricalPriceDTO::fromArray([
                'date' => $date->toDateString(),
                'open' => fake()->randomFloat(2, 10, 500),
                'high' => fake()->randomFloat(2, 10, 500),
                'low' => fake()->randomFloat(2, 10, 500),
                'close' => fake()->randomFloat(2, 10, 500),
                'volume' => fake()->numberBetween(1000, 1000000),
            ]);
        }

        return $data;
    }
}
