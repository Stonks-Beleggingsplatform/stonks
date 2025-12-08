<?php

use App\Models\Exchange;
use App\Models\Security;
use App\Models\Stock;

beforeEach(function () {
    $this->security = Security::create([
        'ticker' => 'ASML',
        'exchange_id' => Exchange::factory()->create()->id,
        'name' => 'ASML Holding N.V.',
        'price' => 1000,
        'securityable_type' => Stock::class,
        'securityable_id' => Stock::factory()->create()->id,
    ]);
});

test('security attributes', function () {
    expect($this->security)->toBeInstanceOf(Security::class)
        ->and($this->security->ticker)->toBe('ASML')
        ->and($this->security->name)->toBe('ASML Holding N.V.')
        ->and($this->security->price)->toBe(1000);
});

test('security relationships', function () {
    expect($this->security->securityable)->toBeInstanceOf(Stock::class);
});
