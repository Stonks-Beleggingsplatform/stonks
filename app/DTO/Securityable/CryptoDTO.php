<?php

namespace App\DTO\Securityable;

use App\Enums\CryptoType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CryptoDTO extends SecurityableDTO
{
    public string $type = 'crypto';
    public CryptoType $coin_type;

    public static function make(object $model): SecurityableDTO
    {
        $base = parent::make($model);

        $base->coin_type = $model->type;

        return $base;
    }
}
