<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/', 'dashboard')->name('home');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class);
    Route::post('/users/{user}/verify-email', [UserController::class, 'sendVerificationEmail'])
    ->name('users.verify-email');
});

require __DIR__.'/settings.php';