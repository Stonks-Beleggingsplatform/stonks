<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('user attributes', function () {
    expect($this->user)->toBeInstanceOf(User::class)
        ->and($this->user->email)->toContain('@')
        ->and($this->user->name)->not->toBeEmpty();
});

test('user relationships', function () {
    //No relationships to test currently
    expect(true)->toBeTrue();
});
