<?php

namespace App\DTO;

use App\Models\Holding;
use App\Models\Portfolio;

class PortfolioDTO extends DTO
{
    public int $id;

    public float $cash;

    public float $total_value;

    public float $total_return;

    public array $holdings;

    public static function fromModel(object $model): PortfolioDTO
    {
        /* @var Portfolio $model */
        $base = parent::fromModel($model);

        $model->loadMissing('holdings', 'holdings.security');

        $base->holdings = $model->holdings->map(fn (Holding $holding) => HoldingDTO::fromModel($holding))->toArray();

        return $base;
    }
}
