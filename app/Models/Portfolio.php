<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function holdings()
    {
        return $this->hasMany(Holding::class);
    }

    // Order does not exist yet
    // public function orders()
    // {
    //     return $this->hasMany(Order::class);
    // }
}
