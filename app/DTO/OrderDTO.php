<?php

namespace App\DTO;

use App\Enums\OrderAction;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Models\Order;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OrderDTO extends DTO
{
    public int $id;

    public int $security_id;

    public string $ticker;

    public int $quantity;

    public float $price;

    public OrderType $type;

    public OrderAction $action;

    public OrderStatus $status;

    public ?string $end_date;

    public string $created_at;

    public string $updated_at;

    public static function make(object $model): self
    {
        /** @var Order $model */
        $dto = parent::make($model);
        $dto->price = $model->price / 100;
        $dto->ticker = $model->security->ticker;

        return $dto;
    }
}
