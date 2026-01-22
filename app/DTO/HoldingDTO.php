<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class HoldingDTO extends DTO
{
    public int $id;

    public int $security_id;

    public string $ticker;

    public int $quantity;

    public float $purchase_price;

    public float $avg_price;

    public float $gain_loss;

    public static function make(object $model): HoldingDTO
    {
        $base = parent::make($model);

        $base->security_id = $model->security_id;
        $base->ticker = $model->security->ticker;

        return $base;
    }
}
