<?php

namespace App\Enums;

enum CryptoType: string
{
    case COIN = 'coin';
    case STABLECOIN = 'stablecoin';
    case TOKEN = 'token';
    case NFT = 'nft';
    case OTHER = 'other';
}
