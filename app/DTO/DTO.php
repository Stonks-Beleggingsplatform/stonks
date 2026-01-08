<?php

namespace App\DTO;

use BackedEnum;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use JsonSerializable;
use ReflectionClass;

abstract class DTO implements Arrayable, JsonSerializable
{
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public static function fromArray(array $attributes): static
    {
        $dto = new static;

        foreach ($attributes as $key => $value) {
            if (property_exists($dto, $key)) {
                $dto->$key = $value;
            }
        }

        return $dto;
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
            } elseif ($value instanceof BackedEnum) {
                $base[$key] = $value->value;
            }
        }

        return $base;
    }

    public static function make(object $model): DTO
    {
        $dto = new static;
        $reflection = new ReflectionClass($dto);
        $properties = get_class_vars($dto::class);

        foreach ($properties as $property => $defaultValue) {
            if (!isset($model->$property) || $model->$property instanceof Model) {
                continue;
            }

            if ($model->$property instanceof Collection) {
                continue;
            }

            // If the property is typed as float and the model value is an integer, convert it to float by dividing by 100
            $reflectionProperty = $reflection->getProperty($property);
            $type = $reflectionProperty->getType();

            if ($type && $type->getName() === 'float' && is_int($model->$property)) {
                $dto->$property = $model->$property / 100;

                continue;
            }

            $dto->$property = $model->$property;
        }

        return $dto;
    }

    public static function collection(Collection $collection): Collection
    {
        return $collection->map(fn(Model $model) => static::make($model));
    }
}
