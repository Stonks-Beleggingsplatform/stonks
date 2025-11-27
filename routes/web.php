<?php

use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

// This ensures requests like /dashboard, /users, /settings don't return 404
// Instead, they return the React app, and React Router looks at the URL to decide what to show.
Route::view('/{any?}', 'app')->where('any', '.*');
