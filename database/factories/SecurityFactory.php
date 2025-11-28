<?php

namespace Database\Factories;

use App\Models\Concerns\Securityable;
use Illuminate\Database\Eloquent\Factories\Factory;

abstract class SecurityFactory extends Factory
{
    public function configure(): SecurityFactory
    {
        return $this->afterCreating(function (Securityable $securityable) {
            $securityable->security()->create([
                'name' => $this->faker->company(),
                'price' => $this->faker->randomFloat(2, 10, 500),
            ]);
        });
    }
}
