<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\User;
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
                'cash' => 10000000, // $100,000.00
            ]);
        }

        // Ensure Regular User
        $user = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
        User::factory()
            ->has(
                Watchlist::factory(3)
            )
            ->has(
                Portfolio::factory()
                    ->has(
                        Order::factory()
                            ->has(Transaction::factory())
                            ->count(5)
                    )
            )
            ->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'role' => \App\Enums\UserRole::User,
            ]
        );

        if (!$user->portfolio) {
            $user->portfolio()->create([
                'currency_id' => $usd->id,
                'cash' => 10000000, // $100,000.00
            ]);
        }
    }
}
