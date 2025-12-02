<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Portfolio;
use App\Models\Security;

class HoldingFactory extends Factory
{
    public function definition(): array
    {
       $purchasePrice = $this->faker->randomFloat(4, 10, 500);
        $avgPrice = $this->faker->randomFloat(4, 10, 500);
        $quantity = $this->faker->numberBetween(1, 500);

        return [
            'portfolio_id' => Portfolio::factory(),
            'security_id' => Security::factory(),

            'quantity' => $quantity,
            'purchase_price' => $purchasePrice,
            'avg_price' => $avgPrice,

            // Example gain/loss calculation
            'gain_loss' => ($avgPrice - $purchasePrice) * $quantity,
        ];
    }
}
