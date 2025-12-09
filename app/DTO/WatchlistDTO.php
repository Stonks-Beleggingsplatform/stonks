<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WatchlistDTO extends DTO
{
    public int $id;

    public string $name;

    public UserDTO $user;

    public array $securities = [];

    public static function make(object $model): WatchlistDTO
    {
        $base = parent::make($model);

        $base->user = UserDTO::make($model->user);
        //TODO:: Implement securities DTO
//        $base->securities = $model->securities->map(fn ($security) => SecurityDTO::fromModel($security))->toArray();

        return $base;
    }
}
