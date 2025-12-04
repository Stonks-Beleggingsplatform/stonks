<?php

namespace Database\Factories;

use App\Models\Bond;
use App\Models\Exchange;
use App\Models\Portfolio;
use App\Models\Security;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class HoldingFactory extends Factory
{
    public function definition(): array
    {
        $purchasePrice = $this->faker->numberBetween(10, 500);
        $avgPrice = $this->faker->numberBetween(10, 500);
        $quantity = $this->faker->numberBetween(1, 500);

        $securityType = $this->faker->randomElement([Stock::class, Bond::class]);

        $security = Security::create([
            'name' => $this->faker->company(),
            'exchange_id' => Exchange::factory()->create()->id,
            'ticker' => $this->faker->unique()->regexify('[A-Z]{3,5}'),
            'price' => $this->faker->numberBetween(10, 500),
            'securityable_type' => $securityType,
            'securityable_id' => $securityType::factory()->create()->id,
        ]);

        return [
            'portfolio_id' => Portfolio::factory(),
            'security_id' => $security,

            'quantity' => $quantity,
            'purchase_price' => $purchasePrice,
            'avg_price' => $avgPrice,

            // Example gain/loss calculation
            'gain_loss' => ($avgPrice - $purchasePrice) * $quantity,
        ];
    }
}
