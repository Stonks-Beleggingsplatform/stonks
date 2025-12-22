<?php

use App\Models\Bond;
use App\Models\Concerns\Securityable;
use App\Models\Crypto;
use App\Models\Stock;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

pest()->beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
})->in('Feature/API');

function createTestableSecurity(): Securityable
{
    $security = collect([Stock::class, Bond::class, Crypto::class])->random();

    /* @var Securityable $security */
    return $security::factory()->create();
}
