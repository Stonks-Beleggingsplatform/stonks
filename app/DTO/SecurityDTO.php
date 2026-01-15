<?php

namespace App\DTO;

use App\DTO\Contracts\Mockable;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SecurityDTO extends DTO implements Mockable
{
    public string $ticker;

    public string $name;

    public float $price;

    public static function mock(?string $identifier = null): static
    {
        $dto = new static();
        $dto->ticker = $identifier ?? strtoupper(fake()->lexify('???'));
        $dto->name = fake()->company();
        $dto->price = fake()->randomFloat(2, 10, 1000);
        return $dto;
    }
}
