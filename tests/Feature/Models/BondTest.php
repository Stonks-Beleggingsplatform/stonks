<?php

use App\Models\Bond;
use App\Models\NotificationCondition;
use App\Models\Security;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

beforeEach(function () {
    $this->bond = Bond::factory()
        ->hasNotificationConditions()
        ->create();
});

test('bond attributes', function () {
    expect($this->bond)->toBeInstanceOf(Bond::class)
        ->and($this->bond->nominal_value)->toBeGreaterThanOrEqual(1000)
        ->and($this->bond->nominal_value)->toBeLessThanOrEqual(100000)
        ->and($this->bond->maturity_date)->toBeInstanceOf(CarbonInterface::class)
        ->and($this->bond->maturity_date->greaterThan(Carbon::now()->addYear()));
});

test('bond relationships', function () {
    expect($this->bond->security)->not->toBeNull()
        ->and($this->bond->security)->toBeInstanceOf(Security::class)
        ->and($this->bond->notificationConditions)->each->toBeInstanceOf(NotificationCondition::class);
});
