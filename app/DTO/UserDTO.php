<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserDTO extends DTO
{
    public int $id;

    public string $name;

    public string $email;
}
