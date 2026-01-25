<?php

namespace App\DTO;

use App\Enums\Comparator;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NotificationDTO extends DTO
{

    public string $message;
    public string $subject_type;
    public SecurityDTO $subject;
    public string $field;
    public Comparator $operator;
    public float $value;

    public static function make(object $model): NotificationDTO
    {
        $base = parent::make($model);

        $base->subject_type = $model->notificationCondition->notifiable_type;
        $base->subject = SecurityDTO::make($model->notificationCondition->notifiable);
        $base->field = $model->notificationCondition->field;
        $base->operator = $model->notificationCondition->operator;
        $base->value = $model->notificationCondition->value;

        return $base;
    }
}
