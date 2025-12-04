<?php

namespace Database\Factories;

use App\Enums\TransactionType;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;


class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'type' => $this->faker->randomElement(TransactionType::cases()),
            'amount' => $this->faker->numberBetween(1, 100),
            'price' => $this->faker->numberBetween(10, 1000),
            'exchange_rate' => $this->faker->numberBetween(0, 200),
        ];
    }
}
