<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn() => auth()->user());

    Route::post('/orders', [OrderController::class, 'store']);

    // Deposit Routes
    Route::get('/balance', [DepositController::class, 'getBalance']);
    Route::post('/deposit/simulate', [DepositController::class, 'simulate']);
    Route::post('/deposit/session', [DepositController::class, 'createSession']);

    Route::prefix('/portfolio')->controller(PortfolioController::class)->group(function () {
        Route::get('/', 'index')->name('portfolio.index');
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

    Route::prefix('/transactions')->controller(TransactionController::class)->group(function () {
        Route::get('/', 'index')->name('transactions.index');
    });

    Route::prefix('notifications')->controller(NotificationController::class)->group(function () {
        Route::get('/', 'index')->name('notifications.index');
    });

    Route::get('/securities/{ticker}', [SecurityController::class, 'show']);

    Route::prefix('admin')->group(function () {
        Route::get('/fees', [FeeController::class, 'index']);
        Route::post('/fees', [FeeController::class, 'store']);
    });
});
