<?php

use App\Enums\Sector;
use App\Models\Company;
use App\Models\Stock;
use Illuminate\Support\Collection;

test('company attributes', function () {
    $company = Company::factory()->create();

    expect($company)->toBeInstanceOf(Company::class)
        ->and($company->name)->toBeString()
        ->and($company->sectors)->toBeInstanceOf(Collection::class)
        ->and($company->employee_count)->toBeInt()
        ->and($company->market_cap)->toBeInt()
        ->and($company->email)->toBeString()
        ->and($company->phone)->toBeString()
        ->and($company->street)->toBeString()
        ->and($company->zip_code)->toBeString()
        ->and($company->city)->toBeString()
        ->and($company->country)->toBeString()
        ->and($company->about)->toBeString();
});

test('company sectors is array of enums', function () {
    $company = Company::factory()->create();

    expect($company->sectors)->each->toBeInstanceOf(Sector::class);
});

test('company relationships', function () {
    $company = Company::factory()
        ->hasStocks()
        ->create();

    expect($company->stocks)->each->toBeInstanceOf(Stock::class);
});
