<?php

namespace App\Models;

use App\Models\Concerns\Securityable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bond extends Securityable
{
    use HasFactory;

    protected $casts = [
        'maturity_date' => 'immutable_date',
    ];
}
