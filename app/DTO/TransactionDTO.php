<?php

namespace App\DTO;

use App\Enums\TransactionType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TransactionDTO extends DTO
{
    // TODO: implement order DTO
    // public OrderDTO $order;
    public TransactionType $type;

    public int $amount;

    public float $price;

    public int $exchange_rate;

    public string $created_at;
}
