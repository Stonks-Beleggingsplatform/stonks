<?php

namespace App\Models\Concerns;

use App\Models\Security;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\Relation;

abstract class Securityable extends Model
{
    protected $guarded = ['id'];

    protected $with = ['security'];

    public function security(): MorphOne
    {
        return $this->morphOne(Security::class, 'securityable');
    }

    public function getAttribute($key)
    {
        $parent = parent::getAttribute($key);

        if (! is_null($parent)) {
            return $parent;
        }

        if ($this->relationLoaded($key)) {
            return $this->getRelationValue($key);
        }

        if (method_exists($this, $key)) {
            $relation = $this->{$key}();

            if ($relation instanceof Relation) {
                return $this->getRelationValue($key);
            }
        }

        return $parent;
    }
}
