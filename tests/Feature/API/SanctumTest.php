<?php

test('sanctum authentication works', function () {
    $result = $this->getJson('/api/user');

    expect($result->status())->toBe(200)
        ->and($result->json())->toEqual(auth()->user()->attributesToArray());
});
``
