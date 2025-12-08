<?php

namespace Database\Factories;

use App\Enums\CryptoType;

class CryptoFactory extends SecurityFactory
{
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(CryptoType::cases()),
        ];
    }
}
