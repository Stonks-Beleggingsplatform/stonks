<?php

namespace App\DTO\Securityable;

use App\DTO\SecurityDTO;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BondDTO extends SecurityDTO
{
    public string $dto_type = 'bond';

    public int $nominal_value;

    public float $coupon_rate;

    public string $maturity_date;

    public static function mock(?string $identifier = null): static
    {
        $dto = parent::mock($identifier);
        $dto->nominal_value = fake()->numberBetween(1000, 10000);
        $dto->coupon_rate = fake()->randomFloat(2, 1, 10);
        $dto->maturity_date = fake()->date('Y-m-d', '+30 years');
        return $dto;
    }
}
