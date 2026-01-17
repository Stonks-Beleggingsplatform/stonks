<?php

namespace Database\Factories;

use App\Models\Company;

class StockFactory extends SecurityFactory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'pe_ratio' => $this->faker->numberBetween(5, 30),
            'dividend_yield' => $this->faker->numberBetween(0, 10),
        ];
    }
}
