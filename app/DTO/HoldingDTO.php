<?php

namespace App\DTO;

class HoldingDTO extends DTO
{
    public int $id;

    public string $ticker;

    public int $quantity;

    public float $purchase_price;

    public float $avg_price;

    public float $gain_loss;

    public static function fromModel(object $model): HoldingDTO
    {
        $base = parent::fromModel($model);

        $base->ticker = $model->security->ticker;

        return $base;
    }
}
