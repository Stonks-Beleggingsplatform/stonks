<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Holding extends Model
{
    protected $fillable = [
        'portfolio_id',
        'security_id',
        'quantity',
        'purchase_price',
        'avg_price',
        'gain_loss',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function security()
    {
        return $this->belongsTo(Security::class);
    }
}
