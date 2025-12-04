<?php

use App\Enums\TransactionType;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Transaction;

beforeEach(function () {
    $this->transaction = Transaction::factory()->create();
});

test('transaction attributes', function () {
    expect($this->transaction)->toBeInstanceOf(Transaction::class)
        ->and($this->transaction->type)->toBeInstanceOf(TransactionType::class)
        ->and($this->transaction->amount)->toBeBetween(1, 10000)
        ->and($this->transaction->price)->toBeBetween(10, 1000)
        ->and($this->transaction->exchange_rate)->toBeBetween(0, 200);
});

test('transaction relationships', function () {
    expect($this->transaction->order)->toBeInstanceOf(Order::class)
        ->and($this->transaction->portfolio)->toBeInstanceOf(Portfolio::class);
});
