<?php

namespace App\Models\Concerns;

use App\Models\NotificationCondition;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Notifiable
{
    public function notificationConditions(): MorphMany
    {
        return $this->morphMany(NotificationCondition::class, 'notifiable');
    }
}
