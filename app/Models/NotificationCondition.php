<?php

namespace App\Models;

use App\Enums\Comparator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class NotificationCondition extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'operator' => Comparator::class,
    ];

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
