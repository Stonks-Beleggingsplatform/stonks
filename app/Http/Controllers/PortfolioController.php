<?php

namespace App\Http\Controllers;

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;

class PortfolioController extends Controller
{
    public function show(): PortfolioDTO
    {
        return PortfolioDTO::make(
            Portfolio::where('user_id', auth()->id())->firstOrFail()
        );
    }
}
