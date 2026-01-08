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
}
