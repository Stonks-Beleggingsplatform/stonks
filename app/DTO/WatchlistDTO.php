<?php

namespace App\DTO;

class WatchlistDTO extends DTO
{
    public int $id;

    public string $name;

    public array $user;

    public array $securities = [];

    public static function make(object $model): WatchlistDTO
    {
        $base = parent::make($model);

        $base->user = UserDTO::make($model->user)->toArray();
        //TODO:: Implement securities DTO
//        $base->securities = $model->securities->map(fn ($security) => SecurityDTO::fromModel($security))->toArray();

        return $base;
    }
}
