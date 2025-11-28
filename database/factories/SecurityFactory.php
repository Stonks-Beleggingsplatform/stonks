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
                'ticker' => $this->faker->unique()->regexify('[A-Z]{3,5}'),
                'price' => $this->faker->randomFloat(2, 10, 500),
            ]);
        });
    }
}
