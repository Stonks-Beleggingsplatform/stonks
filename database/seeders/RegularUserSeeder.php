<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RegularUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        if (!$user->portfolio) {
            Portfolio::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
