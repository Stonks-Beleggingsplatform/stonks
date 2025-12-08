<?php

namespace Database\Factories;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PortfolioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'currency_id' => Currency::factory(),
            'cash' => $this->faker->numberBetween(0, 10000),
            'total_value' => $this->faker->numberBetween(0, 100000),
            'total_return' => $this->faker->numberBetween(-5000, 20000),
        ];
    }
}
