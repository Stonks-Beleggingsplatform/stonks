<?php

namespace Tests\Feature\API;

use App\Enums\UserRole;
use App\Models\Currency;
use App\Models\Exchange;
use App\Models\Fee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user;
    protected Exchange $exchange;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => UserRole::Admin,
        ]);

        $this->user = User::factory()->create([
            'role' => UserRole::User,
        ]);

        $currency = Currency::factory()->create(['name' => 'EUR']);
        $this->exchange = Exchange::factory()->create([
            'name' => 'Test Exchange',
            'currency_id' => $currency->id,
            'description' => 'Original Description',
        ]);
    }

    public function test_admin_can_list_fees(): void
    {
        Fee::factory()->create([
            'exchange_id' => $this->exchange->id,
            'type' => 'transaction',
            'amount' => 1,
            'transaction_id' => null,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/fees');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $this->exchange->id,
                'name' => 'Test Exchange',
                'transaction_fee' => 1.0,
            ]);
    }

    public function test_regular_user_cannot_list_fees(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/admin/fees');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_list_fees(): void
    {
        $response = $this->getJson('/api/admin/fees');

        $response->assertStatus(401);
    }

    public function test_admin_can_update_fees(): void
    {
        $payload = [
            'fees' => [
                [
                    'exchange_id' => $this->exchange->id,
                    'description' => 'Updated Description',
                    'transaction_fee' => 2,
                    'maintenance_fee' => 1,
                    'order_fee' => 3,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/fees', $payload);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Fees updated successfully']);

        $this->assertDatabaseHas('exchanges', [
            'id' => $this->exchange->id,
            'description' => 'Updated Description',
        ]);

        $this->assertDatabaseHas('fees', [
            'exchange_id' => $this->exchange->id,
            'type' => 'transaction',
            'amount' => 2,
            'transaction_id' => null,
        ]);


        $this->assertDatabaseHas('fees', [
            'exchange_id' => $this->exchange->id,
            'type' => 'maintenance',
            'amount' => 1,
            'transaction_id' => null,
        ]);

        $this->assertDatabaseHas('fees', [
            'exchange_id' => $this->exchange->id,
            'type' => 'order',
            'amount' => 3,
            'transaction_id' => null,
        ]);
    }

    public function test_regular_user_cannot_update_fees(): void
    {
        $payload = [
            'fees' => [
                [
                    'exchange_id' => $this->exchange->id,
                    'description' => 'hacking',
                    'transaction_fee' => 0,
                    'maintenance_fee' => 0,
                    'order_fee' => 0,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)->postJson('/api/admin/fees', $payload);

        $response->assertStatus(403);
    }

    public function test_update_fees_validation(): void
    {
        // Missing required fields
        $payload = [
            'fees' => [
                [
                    'exchange_id' => $this->exchange->id,
                    // missing transaction_fee, maintenance_fee, order_fee
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/fees', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['fees.0.transaction_fee', 'fees.0.maintenance_fee', 'fees.0.order_fee']);
    }

    public function test_update_fees_negative_values(): void
    {
        $payload = [
            'fees' => [
                [
                    'exchange_id' => $this->exchange->id,
                    'transaction_fee' => -1,
                    'maintenance_fee' => -1,
                    'order_fee' => -1,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/fees', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['fees.0.transaction_fee', 'fees.0.maintenance_fee', 'fees.0.order_fee']);
    }

    public function test_admin_can_update_multiple_exchanges_fees(): void
    {
        $exchange2 = Exchange::factory()->create([
            'name' => 'Exchange 2',
            'currency_id' => $this->exchange->currency_id,
        ]);

        $payload = [
            'fees' => [
                [
                    'exchange_id' => $this->exchange->id,
                    'description' => 'Desc 1',
                    'transaction_fee' => 1,
                    'maintenance_fee' => 1,
                    'order_fee' => 1,
                ],
                [
                    'exchange_id' => $exchange2->id,
                    'description' => 'Desc 2',
                    'transaction_fee' => 2,
                    'maintenance_fee' => 2,
                    'order_fee' => 2,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/fees', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('exchanges', ['id' => $this->exchange->id, 'description' => 'Desc 1']);
        $this->assertDatabaseHas('exchanges', ['id' => $exchange2->id, 'description' => 'Desc 2']);

        $this->assertDatabaseHas('fees', ['exchange_id' => $this->exchange->id, 'type' => 'transaction', 'amount' => 1]);
        $this->assertDatabaseHas('fees', ['exchange_id' => $exchange2->id, 'type' => 'transaction', 'amount' => 2]);
    }
}
