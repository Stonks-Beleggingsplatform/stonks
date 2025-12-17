<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function () {
        return Auth()->user();
    });

    Route::controller(PortfolioController::class)->group(function () {
        Route::get('/portfolio', 'show')->name('portfolio.show');
    });

    Route::controller(WatchlistController::class)->group(function () {
        Route::get('/watchlist', 'index')->name('watchlist.index');
        Route::post('/watchlist/create', 'create')->name('watchlist.create');
    });

    // Admin Routes
    Route::get('/admin/fees', [App\Http\Controllers\FeeController::class, 'index']);
    Route::post('/admin/fees', [App\Http\Controllers\FeeController::class, 'store']);
});
