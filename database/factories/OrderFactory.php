<?php

namespace Database\Factories;

use App\Enums\OrderAction;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Models\Bond;
use App\Models\Portfolio;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        $securityClass = $this->faker->randomElement([
            Stock::class,
            Bond::class,
        ]);

        return [
            'quantity' => $this->faker->numberBetween(1, 100),
            'price' => $this->faker->numberBetween(10, 1000),
            'type' => $this->faker->randomElement(OrderType::cases()),
            'action' => $this->faker->randomElement(OrderAction::cases()),
            'status' => $this->faker->randomElement(OrderStatus::cases()),
            'end_date' => $this->faker->date(),
            'portfolio_id' => Portfolio::factory(),
            'security_id' => $securityClass::factory(),
        ];
    }
}
