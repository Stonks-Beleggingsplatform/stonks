<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });

    Route::controller(PortfolioController::class)->group(function () {
        Route::get('/portfolio', 'show')->name('portfolio.show');
    });

    Route::controller(SecurityController::class)->group(function () {
        Route::get('/security/{security:ticker}', 'show')->name('security.show');
    });
});
