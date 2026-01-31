<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NotificationConditionDTO extends DTO
{
    public int $id;
    public string $field;
    public string $operator;
    public float $value;
    public SecurityDTO $security;
    public string $created_at;

    public static function make(object $model): NotificationConditionDTO
    {
        $base = parent::make($model);

        $model->loadMissing('notifiable');

        $base->security = SecurityDTO::make($model->notifiable);

        return $base;
    }
}
