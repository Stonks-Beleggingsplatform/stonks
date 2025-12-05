<?php

use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });

    Route::controller(PortfolioController::class)->group(function () {
        Route::get('/portfolio', 'show')->name('portfolio.show');
    });
});
