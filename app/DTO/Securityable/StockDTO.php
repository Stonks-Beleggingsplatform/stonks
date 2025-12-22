<?php

namespace App\DTO\Securityable;

use App\DTO\CompanyDTO;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StockDTO extends SecurityableDTO
{
    public string $type = 'stock';
    public int $pe_ratio;
    public float $dividend_yield;

    public CompanyDTO $company;

    public static function make(object $model): SecurityableDTO
    {
        $base = parent::make($model);

        $model->load('company');

        $base->company = $model->company;

        return $base;
    }
}
