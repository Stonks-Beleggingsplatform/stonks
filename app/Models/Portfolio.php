<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Get or set the portfolio's cash in dollars, while storing it in cents.
     */
    protected function cash(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (float) ($value / 100),
            set: fn ($value) => (int) ($value * 100),
        );
    }

    protected $casts = [
        'cash' => 'integer',
    ];

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
}
