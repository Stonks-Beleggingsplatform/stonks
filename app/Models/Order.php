<?php

namespace App\Models;

use App\Enums\OrderAction;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'type' => OrderType::class,
        'action' => OrderAction::class,
        'status' => OrderStatus::class,
        'end_date' => 'immutable_date',
    ];
}
