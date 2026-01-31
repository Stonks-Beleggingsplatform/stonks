<?php

namespace Database\Factories;

use App\Models\Bond;
use App\Models\Crypto;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationConditionFactory extends Factory
{
    public function definition(): array
    {
        $notifiableClass = $this->faker->randomElement([
            Crypto::class,
            Stock::class,
            Bond::class,
        ]);

        return [
            'field' => $this->faker->word(),
            'operator' => $this->faker->randomElement(['=', '!=', '<', '>', '<=', '>=']),
            'value' => $this->faker->randomNumber(2),
            'notifiable_type' => $notifiableClass,
            'notifiable_id' => $notifiableClass::factory(),
        ];
    }
}
