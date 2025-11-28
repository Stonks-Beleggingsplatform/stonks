<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Security extends Model
{
    protected $guarded = [];
    public function securityable(): MorphTo
    {
        return $this->morphTo();
    }
}
