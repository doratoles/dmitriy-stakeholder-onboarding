<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Training\StakeholderPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/training/stakeholders', [StakeholderPageController::class, 'index'])
        ->name('training.stakeholders.index');

    Route::get('/training/stakeholders/create', [StakeholderPageController::class, 'create'])
        ->name('training.stakeholders.create');

    Route::post('/training/stakeholders', [StakeholderPageController::class, 'store'])
        ->name('training.stakeholders.store');

    Route::get('/training/stakeholders/{stakeholder}', [StakeholderPageController::class, 'show'])
        ->name('training.stakeholders.show');

    Route::get('/training/stakeholders/{stakeholder}/edit', [StakeholderPageController::class, 'edit'])
        ->name('training.stakeholders.edit');

    Route::put('/training/stakeholders/{stakeholder}', [StakeholderPageController::class, 'update'])
        ->name('training.stakeholders.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
