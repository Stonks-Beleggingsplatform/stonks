<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NotificationConditionDTO extends DTO
{
    public string $field;
    public string $operator;
    public float $value;
    public SecurityDTO $security;

    public static function make(object $model): NotificationConditionDTO
    {
        $base = parent::make($model);

        $base->security = SecurityDTO::make($model->notifiable);

        return $base;
    }
}
