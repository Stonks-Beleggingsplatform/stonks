<?php

namespace App\DTO\Securityable;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BondDTO extends SecurityableDTO
{
    public string $type = 'bond';
    public int $nominal_value;
    public float $coupon_rate;
    public string $maturity_date;
}
