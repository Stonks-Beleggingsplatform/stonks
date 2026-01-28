<?php

namespace Database\Factories;

use App\Models\NotificationCondition;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'message' => $this->faker->sentence(),
            'notification_condition_id' => NotificationCondition::factory(),
            'user_id' => User::factory(),
        ];
    }
}
