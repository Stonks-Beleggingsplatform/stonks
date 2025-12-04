<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Exchange;
use App\Models\Transaction;

class FeeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'amount' => $this->faker->numberBetween(50, 100),
            'exchange_id' => Exchange::factory(),
            'transaction_id' => Transaction::factory(),
        ];
    }
}
