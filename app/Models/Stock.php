<?php

namespace App\Models;

use App\Models\Concerns\Securityable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stock extends Securityable
{
    use HasFactory;

    protected $guarded = ['id'];
}
