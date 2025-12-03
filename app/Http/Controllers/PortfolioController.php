<?php

namespace App\Http\Controllers;

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function show()
    {
        return PortfolioDTO::fromModel(
            Portfolio::where('user_id', auth()->id())->firstOrFail()
        );
    }
}
