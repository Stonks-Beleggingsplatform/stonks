<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed standard data (Currencies, Exchanges) first
        $this->call([
            StandardSeeder::class,
        ]);

        $usd = \App\Models\Currency::where('name', 'USD')->first();

        // Ensure Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => \App\Enums\UserRole::Admin,
            ]
        );

        if (!$admin->portfolio) {
            $admin->portfolio()->create([
                'currency_id' => $usd->id,
                'cash' => 10000, // $10,000.00
            ]);
        }

        // Ensure Standard Customer
        $user = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'John Customer',
                'password' => bcrypt('password'),
                'role' => \App\Enums\UserRole::User,
            ]
        );

        if (!$user->portfolio) {
            $user->portfolio()->create([
                'currency_id' => $usd->id,
                'cash' => 5000, // $5,000.00
            ]);
        }
    }
}
