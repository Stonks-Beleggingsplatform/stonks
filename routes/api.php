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
    Route::get('/user', fn () => auth()->user());

    Route::prefix('/portfolio')->controller(PortfolioController::class)->group(function () {
        Route::get('/', 'show')->name('portfolio.show');
    });

    Route::prefix('/watchlist')->controller(WatchlistController::class)->group(function () {
        Route::get('/', 'index')->name('watchlist.index');
        Route::get('/{watchlist}', 'show')->name('watchlist.show');
        Route::post('/create', 'create')->name('watchlist.create');
        Route::put('/{watchlist}/update', 'update')->name('watchlist.update');
        Route::delete('/watchlist/{watchlist}/delete', 'delete')->name('watchlist.delete');
        Route::put('/{watchlist}/securities/add', 'addSecurities')->name('watchlist.securities.add');
        Route::put('/{watchlist}/securities/remove', 'removeSecurities')->name('watchlist.securities.remove');
    });

    Route::prefix('/securities')->controller(SecurityController::class)->group(function () {
        Route::get('/search/{term}', 'index')->name('securities.search');
        Route::get('/{security:ticker}', 'show')->name('securities.show');
    });

    Route::prefix('admin')->group(function () {
        Route::get('/fees', [App\Http\Controllers\FeeController::class, 'index']);
        Route::post('/fees', [App\Http\Controllers\FeeController::class, 'store']);
    });
});
