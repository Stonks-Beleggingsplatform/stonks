<?php

namespace App\DTO\Securityable;

use App\DTO\SecurityDTO;
use App\Models\Stock;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
abstract class SecurityableDTO extends SecurityDTO
{
    public string $type;

    public static function make(object $model): SecurityableDTO
    {
        $DTOClass = match ($model->security_type) {
            Stock::class => StockDTO::class,
            BondDTO::class => BondDTO::class,
            CryptoDTO::class => CryptoDTO::class,
        };

        return $DTOClass::make($model);
    }
}
