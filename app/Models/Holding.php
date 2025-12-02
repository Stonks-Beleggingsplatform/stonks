<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Holding extends Model
{
    protected $guarded = ['id'];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function security()
    {
        return $this->belongsTo(Security::class);
    }
}
