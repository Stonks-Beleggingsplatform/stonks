<?php

namespace App\DTO;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WatchlistDTO extends DTO
{
    public int $id;

    public string $name;

    public UserDTO $user;

    public ?array $securities;
    public int $securities_count = 0;

    public static function make(object $model, ?bool $securities = false): static
    {
        $base = parent::make($model);

        $base->user = UserDTO::make($model->user);

        $base->securities_count = $model->securities()->count();

        if ($securities) {
            $base->securities = $model->securities->map(fn ($security) => SecurityDTO::make($security))->toArray();
        }

        return $base;
    }

    public static function collection(Collection $collection, ?bool $securities = false): Collection
    {
        return $collection->map(fn (Model $model) => static::make($model, $securities));
    }
}
