<?php

namespace App\DTO\Securityable;

use App\DTO\SecurityDTO;
use App\Enums\CryptoType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CryptoDTO extends SecurityDTO
{
    public string $dto_type = 'crypto';
    public CryptoType $type;

    public static function make(object $model): SecurityDTO
    {
        $base = parent::make($model);

        $base->coin_type = $model->type;

        return $base;
    }
}
