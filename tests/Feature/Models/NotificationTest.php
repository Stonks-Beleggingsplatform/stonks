<?php

use App\Models\Notification;
use App\Models\NotificationCondition;

beforeEach(function () {
    $this->notification = Notification::factory()
        ->forNotificationCondition()
        ->create();
});

test('notification attributes', function () {
    expect($this->notification)->toBeInstanceOf(Notification::class)
        ->and($this->notification->message)->toBeString();
});

test('notification relations', function () {
    expect($this->notification->notificationCondition)->toBeInstanceOf(NotificationCondition::class);
});
