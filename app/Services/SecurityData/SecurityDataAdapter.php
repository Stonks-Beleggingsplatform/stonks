<?php

namespace App\Services\SecurityData;

use App\DTO\SecurityDTO;

interface SecurityDataAdapter
{
    public function getPrice(string $ticker): ?float;

    public function getSecurityDetails(string $ticker): ?SecurityDTO;

    public function search(string $term): array;

    public function getHistoricalData(string $ticker, string $from, string $to): array;
}
