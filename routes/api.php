<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SecurityController;
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
        Route::get('/watchlist/{watchlist}', 'show')->name('watchlist.show');
        Route::post('/watchlist/create', 'create')->name('watchlist.create');
        Route::put('/watchlist/{watchlist}/update', 'update')->name('watchlist.update');
        Route::delete('/watchlist/{watchlist}/delete', 'delete')->name('watchlist.delete');
        Route::put('/watchlist/{watchlist}/securities/add', 'addSecurities')->name('watchlist.securities.add');
        Route::put('/watchlist/{watchlist}/securities/remove', 'removeSecurities')->name('watchlist.securities.remove');
    });

    Route::controller(SecurityController::class)->group(function () {
        Route::get('/securities/search/{term}', 'index')->name('securities.search');
    });
});
