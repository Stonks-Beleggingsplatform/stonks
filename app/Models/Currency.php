<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Currency extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function exchange(): HasOne
    {
        return $this->hasOne(Exchange::class);
    }
}
