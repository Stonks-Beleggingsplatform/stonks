<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Security extends Model
{
    protected $guarded = ['id'];

    public function securityable(): MorphTo
    {
        return $this->morphTo();
    }

    public function watchlists()
    {
        return $this->belongsToMany(Watchlist::class, 'watchlist_security')
            ->withTimestamps();
    }
}
