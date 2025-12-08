<?php

namespace App\DTO;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

abstract class DTO implements JsonSerializable, Arrayable
{
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public static function make(object $model): DTO
    {
        $dto = new static();

        foreach (get_object_vars($dto) as $property => $value) {
            if (property_exists($model, $property)) {
                //if the property is an int on the model, but a float on the dto, convert cents to currency
                if (is_int($model->$property) && is_float($dto->$property)) {
                    $dto->$property = (float)$model->$property / 100;
                    continue;
                }

                $dto->$property = $model->$property;
            }
        }

        return $dto;
    }
}

