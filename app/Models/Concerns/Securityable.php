<?php

namespace App\Models\Concerns;

use App\Models\Security;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

abstract class Securityable extends Model
{
    protected $with = ['security'];

    public function security(): MorphOne
    {
        return $this->morphOne(Security::class, 'securityable');
    }

    public function getAttribute($key)
    {
        $attribute = parent::getAttribute($key);

        if ($attribute !== null) {
            return $attribute;
        }


        //If the securityable does not have the attribute, check the related security model
        $this->loadMissing('security');

        if ($this->relationLoaded('security') && $this->security) {
            return $this->security->getAttribute($key);
        }

        return null;
    }
}
