<?php

namespace App\Services\SecurityData;

use App\DTO\SecurityDTO;
use App\Models\Security;

interface SecurityDataAdapter
{
    public function getPrice(string $ticker): ?float;

    public function getSecurityDetails(string $ticker): ?SecurityDTO;

    public function search(string $term): array;

    public function getHistoricalData(Security $security): array;
}
