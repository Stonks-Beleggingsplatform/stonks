<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Currency;

class ExchangeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Exchange',
            'currency_id' => Currency::factory()->create(),
        ];
    }
}
