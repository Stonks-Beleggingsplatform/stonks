<?php

use App\Services\SecurityData\SecurityDataService;
use Illuminate\Support\Facades\Route;

// This ensures requests like /dashboard, /users, /settings don't return 404
// Instead, they return the React app, and React Router looks at the URL to decide what to show.

//Temp route for testing the SecurityDataService
Route::get('/test/{ticker}', function (string $ticker) {
    $service = new SecurityDataService();

    return 'Details for ' . $ticker . ': ' . json_encode($service->getSecurityDetails($ticker));
});

Route::view('/{any?}', 'app')->where('any', '.*');

