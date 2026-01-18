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
        $this->call([
            StandardSeeder::class,
            AdminUserSeeder::class,
            RegularUserSeeder::class,
        ]);

        User::factory()
            ->has(
                Watchlist::factory(3)
            )
            ->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
    }
}
