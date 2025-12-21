<?php

namespace App\Models;

use App\Enums\Sector;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'sectors' => AsEnumCollection::of(Sector::class),
        ];
    }
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }
}

