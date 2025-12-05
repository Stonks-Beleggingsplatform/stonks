<?php

use App\Enums\CryptoType;
use App\Models\Crypto;
use App\Models\Security;

beforeEach(function () {
    $this->crypto = Crypto::factory()->create();
});

test('crypto attributes', function () {
    expect($this->crypto)->toBeInstanceOf(Crypto::class)
        ->and($this->crypto->type)->toBeInstanceOf(CryptoType::class);
});

test('crypto relationships', function () {
    expect($this->crypto->security)->not->toBeNull()
        ->and($this->crypto->security)->toBeInstanceOf(Security::class);
});
