<?php

namespace Database\Factories;

class StockFactory extends SecurityFactory
{
    public function definition(): array
    {
        return [
            'pe_ratio' => $this->faker->randomFloat(2, 5, 30),
            'dividend_yield' => $this->faker->randomFloat(2, 0, 10),
        ];
    }
}
