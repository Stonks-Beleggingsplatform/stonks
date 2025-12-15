<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SecurityDTO extends DTO
{
    public int $id;

    public string $ticker;

    public string $name;

    public float $price;
}
