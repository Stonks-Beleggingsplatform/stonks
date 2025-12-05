<?php

use App\Models\Fee;
use App\Models\Exchange;
use App\Models\Transaction;

beforeEach(function () {
    $this->fee = Fee::factory()->create();
});

test('fee attributes', function () {
    expect($this->fee)->toBeInstanceOf(Fee::class)
        ->and($this->fee->amount)->toBeInt()
        ->and($this->fee->exchange_id)->toBeInt()
        ->and($this->fee->transaction_id)->toBeInt();
});

test('fee relationships', function () {
    expect($this->fee->exchange)->toBeInstanceOf(Exchange::class)
        ->and($this->fee->transaction)->toBeInstanceOf(Transaction::class);
});