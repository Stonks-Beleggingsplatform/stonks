<?php

use App\Jobs\CheckNotificationConditions;

Schedule::job(new CheckNotificationConditions())->everyFiveMinutes();
