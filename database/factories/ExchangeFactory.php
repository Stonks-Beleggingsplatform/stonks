<?php

namespace Database\Factories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExchangeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company().' Exchange',
            'currency_id' => Currency::factory()->create(),
        ];
    }
}
