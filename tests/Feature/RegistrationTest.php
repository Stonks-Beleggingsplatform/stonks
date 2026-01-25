<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('a user cannot register with a duplicate email', function () {
    User::factory()->create([
        'email' => 'duplicate@example.com',
    ]);

    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'duplicate@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('a user cannot register with a non-conform password', function ($password) {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'newuser@example.com',
        'password' => $password,
        'password_confirmation' => $password,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
})->with([
    'short',             // Too short
    'alllowercase1!',    // No uppercase
    'ALLUPPERCASE1!',    // No lowercase
    'NoNumbers!',        // No numbers
    'NoSymbols123',      // No symbols
]);

test('a user can register successfully with valid data', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'jane.registration.test@gmail.com',
        'password' => 'Xy7!pQ9#mL2$kR5',
        'password_confirmation' => 'Xy7!pQ9#mL2$kR5',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('email', 'jane.registration.test@gmail.com');

    $this->assertDatabaseHas('users', [
        'email' => 'jane.registration.test@gmail.com',
    ]);

    expect(Auth::check())->toBeTrue();
});
