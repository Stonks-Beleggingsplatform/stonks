<?php

namespace App\DTO;

use App\Enums\UserRole;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserDTO extends DTO
{
    public int $id;

    public string $name;

    public string $email;

    public UserRole $role;
}
