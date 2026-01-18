<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Temporary cash property until a migration adds a cash column to the portfolios table
    public int $cash = 100000;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function holdings(): HasMany
    {
        return $this->hasMany(Holding::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getCashAttribute(): float
    {
        return $this->attributes['cash'] / 100;
    }

    /**
     * Get the total value of the portfolio.
     */
    public function getTotalValueAttribute(): float
    {
        $totalValue = $this->holdings->sum(fn (Holding $holding) => $holding->quantity * $holding->security->price);

        return $totalValue / 100;
    }

    /**
     * Get the total return of the portfolio.
     */
    public function getTotalReturnAttribute(): float
    {
        return $this->holdings->sum('gain_loss') / 100;
    }
}

