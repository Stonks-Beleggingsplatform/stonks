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

}
