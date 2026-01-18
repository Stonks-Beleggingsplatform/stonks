<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class HistoricalPriceDTO extends DTO
{
    public string $date;

    public float $open;

    public float $high;

    public float $low;

    public float $close;

    public int $volume;
}
