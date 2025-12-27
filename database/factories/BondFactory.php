<?php

namespace Database\Factories;

class BondFactory extends SecurityFactory
{
    public function definition(): array
    {
        return [
            'nominal_value' => $this->faker->randomElement([1000, 5000, 10000, 50000, 100000]),
            'coupon_rate' => $this->faker->numberBetween(100, 15000),
            'maturity_date' => $this->faker->dateTimeBetween('+1 year', '+30 years')->format('Y-m-d'),
        ];
    }
}
