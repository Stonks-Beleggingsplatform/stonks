<?php

use App\Models\Exchange;
use App\Models\Currency;
use App\Models\Fee;
use App\Models\Security;

beforeEach(function () {
    $this->exchange = Exchange::factory()->create();
});

test('exchange attributes', function () {
    expect($this->exchange)->toBeInstanceOf(Exchange::class)
        ->and($this->exchange->name)->toBeString()
        ->and($this->exchange->currency_id)->toBeInt();
});

test('exchange relationships', function () {
    expect($this->exchange->currency)->toBeInstanceOf(Currency::class);

    $this->exchange->fees->each(function ($fee) {
        expect($fee)->toBeInstanceOf(Fee::class);
    });

    $this->exchange->securities->each(function ($security) {
        expect($security)->toBeInstanceOf(Security::class);
    });
});