<?php

namespace App\DTO;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use JsonSerializable;

abstract class DTO implements Arrayable, JsonSerializable
{
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public function jsonSerialize(): array
    {
        $base = $this->toArray();

        foreach ($base as $key => $value) {
            if ($value instanceof DTO) {
                $base[$key] = $value->jsonSerialize();
            } elseif ($value instanceof Collection) {
                $base[$key] = $value->map(function ($item) {
                    return $item instanceof DTO ? $item->jsonSerialize() : $item;
                })->toArray();
            }
        }

        return $base;
    }

    public static function make(object $model): DTO
    {
        $dto = new static;

        $properties = get_class_vars($dto::class);

        foreach ($properties as $property => $defaultValue) {
            if (! isset($model->$property) || $model->$property instanceof Model) {
                continue;
            }

            // if the property is an int on the dto but a float on the model, cast it to int
            if (is_int($defaultValue) && is_float($model->$property)) {
                $dto->$property = (int) $model->$property * 100;

                continue;
            }

            if ($model->$property instanceof Collection) {
                continue;
            }

            $dto->$property = $model->$property;

        }

        return $dto;
    }

    public static function collection(Collection $collection): Collection
    {
        return $collection->map(fn (Model $model) => static::make($model));
    }
}
