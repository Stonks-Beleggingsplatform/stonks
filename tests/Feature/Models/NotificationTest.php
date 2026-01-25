<?php

use App\Models\Notification;
use App\Models\NotificationCondition;
use App\Models\User;

beforeEach(function () {
    $this->notification = Notification::factory()
        ->forNotificationCondition()
        ->forUser()
        ->create();
});

test('notification attributes', function () {
    expect($this->notification)->toBeInstanceOf(Notification::class)
        ->and($this->notification->message)->toBeString();
});

test('notification relations', function () {
    expect($this->notification->notificationCondition)->toBeInstanceOf(NotificationCondition::class)
        ->and($this->notification->user)->toBeInstanceOf(User::class);
});
