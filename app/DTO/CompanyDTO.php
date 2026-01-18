<?php

namespace App\DTO;

use App\DTO\Contracts\Mockable;
use App\Enums\Sector;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CompanyDTO extends DTO implements Mockable
{
    public string $name;

    public array $sectors;

    public int $employee_count;

    public int $market_cap;

    public string $email;

    public string $phone;

    public string $street;

    public string $zip_code;

    public string $city;

    public string $country;

    public string $about;

    public static function mock(?string $identifier = null): static
    {
        $dto = new static;
        $dto->name = $identifier ?? fake()->company();
        $dto->sectors = fake()->randomElements(
            Sector::cases(),
            fake()->numberBetween(1, 3)
        );
        $dto->employee_count = fake()->numberBetween(50, 10000);
        $dto->market_cap = fake()->numberBetween(1000000, 1000000000);
        $dto->email = fake()->companyEmail();
        $dto->phone = fake()->phoneNumber();
        $dto->street = fake()->streetAddress();
        $dto->zip_code = fake()->postcode();
        $dto->city = fake()->city();
        $dto->country = fake()->country();
        $dto->about = fake()->paragraph();

        return $dto;
    }
}
