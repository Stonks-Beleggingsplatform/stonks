<?php

namespace App\DTO;

use App\Models\Security;

class SecurityDTO extends DTO
{
    public string $name;
    public string $type;
    public string $ticker;
//    public string $exchange;
//    public float $current_price;
    public static function fromModel(object $model): SecurityDTO
    {
        /* @var Security $model */
        $base = parent::fromModel($model);

        //exchange is yet to be implemented
        $model->loadMissing(['securityable']);

        $base->type = $model->securityable->getType();
//        $base->exchange = $model->exchange->name;

        return $base;
    }
}
