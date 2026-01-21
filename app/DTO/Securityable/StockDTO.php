<?php

namespace App\DTO\Securityable;

use App\DTO\CompanyDTO;
use App\DTO\SecurityDTO;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StockDTO extends SecurityDTO
{
    public string $dto_type = 'stock';

    public int $pe_ratio;

    public float $dividend_yield;

    public CompanyDTO $company;

    public static function make(object $model): SecurityDTO
    {
        $base = parent::make($model);

        $model->loadMissing('company');

        if ($model->company) {
            $base->company = CompanyDTO::make($model->company);
        }

        return $base;
    }

    public static function mock(?string $identifier = null): static
    {
        $dto = parent::mock($identifier);
        $dto->pe_ratio = fake()->numberBetween(5, 30);
        $dto->dividend_yield = fake()->randomFloat(2, 0, 5);
        $dto->company = CompanyDTO::mock();

        return $dto;
    }
}
