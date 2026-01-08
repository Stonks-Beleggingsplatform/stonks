<?php

namespace App\DTO\Contracts;

interface Mockable
{
    public static function mock(?string $identifier = null): static;
}
