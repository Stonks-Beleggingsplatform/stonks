<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Transaction;

class Fee extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
       
    protected $casts = [
        'amount' => 'integer',
        'exchange_id' => 'integer',
        'transaction_id' => 'integer',
    ];

    public function exchange(): BelongsTo
    {
        return $this->belongsTo(Exchange::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
