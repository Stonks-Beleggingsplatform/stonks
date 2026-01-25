<?php

use App\Models\Company;
use App\Models\NotificationCondition;
use App\Models\Security;
use App\Models\Stock;

beforeEach(function () {
    $this->stock = Stock::factory()
        ->forCompany()
        ->hasNotificationConditions()
        ->create();
});

test('stock attributes', function () {
    expect($this->stock)->toBeInstanceOf(Stock::class)
        ->and($this->stock->pe_ratio)->toBeGreaterThanOrEqual(5)
        ->and($this->stock->pe_ratio)->toBeLessThanOrEqual(30)
        ->and($this->stock->dividend_yield)->toBeGreaterThanOrEqual(0)
        ->and($this->stock->dividend_yield)->toBeLessThanOrEqual(10);
});

test('stock relationships', function () {
    expect($this->stock->security)->not->toBeNull()
        ->and($this->stock->security)->toBeInstanceOf(Security::class)
        ->and($this->stock->company)->toBeInstanceOf(Company::class)
        ->and($this->stock->notificationConditions)->each->toBeInstanceOf(NotificationCondition::class);
});
