<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

pest()->beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user, ['*']);
})->in('Feature/API');
