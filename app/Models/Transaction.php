<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'type' => TransactionType::class,
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function portfolio(): HasOneThrough
    {
        return $this->hasOneThrough(
            related: Portfolio::class,
            through: Order::class,
            firstKey: 'id',
            secondKey: 'id',
            localKey: 'order_id',
            secondLocalKey: 'portfolio_id'
        );
    }
}
