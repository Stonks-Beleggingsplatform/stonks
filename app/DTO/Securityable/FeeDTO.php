<?php

namespace App\DTO\Securityable;

use App\DTO\DTO;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class FeeDTO extends DTO
{
    public int $id;

    public string $name;

    public string $description;

    public string $currency;

    public float $transaction_fee;

    public float $maintenance_fee;

    public float $order_fee;

    public static function make(object $model): self
    {
        $dto = new self();
        $dto->id = $model->id;
        $dto->name = $model->name;
        $dto->description = $model->description ?? '';
        $dto->currency = $model->currency->name ?? 'N/A';

        $fees = $model->fees->keyBy('type');

        $dto->transaction_fee = (float) (($fees->get('transaction')?->amount ?? 0) / 100);
        $dto->maintenance_fee = (float) (($fees->get('maintenance')?->amount ?? 0) / 100);
        $dto->order_fee = (float) (($fees->get('order')?->amount ?? 0) / 100);

        return $dto;
    }
}
