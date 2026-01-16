<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Cashier\Billable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Billable;

    /**
     * Get or set the user's balance in dollars, while storing it in cents.
     */
    protected function balance(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (float) ($value / 100),
            set: fn ($value) => (int) ($value * 100),
        );
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'balance',
    ];

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => UserRole::class,
        'balance' => 'integer',
    ];

    public function portfolio(): HasOne
    {
        return $this->hasOne(Portfolio::class);
    }

    public function watchlists(): HasMany
    {
        return $this->hasMany(Watchlist::class);
    }
}
