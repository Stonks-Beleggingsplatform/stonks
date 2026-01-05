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

    public static function mock(?string $identifier = null): static
    {
        $dto = parent::mock($identifier);
        $dto->type = CryptoType::from(fake()->randomElement(CryptoType::cases())->value);
        return $dto;
    }
}
