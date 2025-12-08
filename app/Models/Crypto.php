<?php

namespace App\Models;

use App\Enums\CryptoType;
use App\Models\Concerns\Securityable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Crypto extends Securityable
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'type' => CryptoType::class,
    ];
}
