<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class PortfolioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'cash' => $this->faker->randomFloat(2, 0, 10000),
            'total_value' => $this->faker->randomFloat(2, 0, 100000),
            'total_return' => $this->faker->randomFloat(2, -5000, 20000),
        ];
    }
}
