<?php

namespace Database\Factories;

class StockFactory extends SecurityFactory
{
    public function definition(): array
    {
        return [
            'pe_ratio' => $this->faker->numberBetween(5, 30),
            'dividend_yield' => $this->faker->numberBetween(0, 10),
        ];
    }
}
