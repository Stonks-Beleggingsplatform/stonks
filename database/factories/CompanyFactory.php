<?php

namespace Database\Factories;

use App\Enums\Sector;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'sectors' => $this->faker->randomElements(Sector::cases()),
            'employee_count' => $this->faker->numberBetween(10, 10000),
            'market_cap' => $this->faker->numberBetween(1000000, 1000000000),
            'email' => $this->faker->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'street' => $this->faker->streetAddress(),
            'zip_code' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'about' => $this->faker->paragraph(),
        ];
    }
}
