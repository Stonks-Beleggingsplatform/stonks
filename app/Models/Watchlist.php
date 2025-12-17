<?php

namespace App\Models;

use App\Policies\WatchlistPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[UsePolicy(WatchlistPolicy::class)]
class Watchlist extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function securities(): BelongsToMany
    {
        return $this->belongsToMany(Security::class, 'watchlist_security')
            ->withTimestamps();
    }
}
