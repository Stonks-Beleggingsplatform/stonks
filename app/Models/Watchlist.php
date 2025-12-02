<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $fillable = [
        'user_id',
        'ticker',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function securities()
    {
        return $this->belongsToMany(Security::class, 'watchlist_security')
            ->withTimestamps();
    }
}
