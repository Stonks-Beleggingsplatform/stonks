<?php

namespace App\DTO;

use App\Models\Holding;
use App\Models\Portfolio;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PortfolioDTO extends DTO
{
    public int $id;

    public float $cash;

    public float $total_value;

    public float $total_return;

    public array $holdings;

    public static function make(object $model): PortfolioDTO
    {
        /* @var Portfolio $model */
        $base = parent::make($model);

        $model->loadMissing('holdings', 'holdings.security');

        $base->holdings = $model->holdings->map(fn (Holding $holding) => HoldingDTO::make($holding))->toArray();

        return $base;
    }
}
