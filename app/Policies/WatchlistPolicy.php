<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Watchlist;

class WatchlistPolicy
{
    public function usersOwnWatchlist(User $user, Watchlist $watchlist): bool
    {
        return $user->id === $watchlist->user_id;
    }

    public function view(User $user, Watchlist $watchlist): bool
    {
        return $this->usersOwnWatchlist($user, $watchlist);
    }

    public function update(User $user, Watchlist $watchlist): bool
    {
        return $this->usersOwnWatchlist($user, $watchlist);
    }

    public function delete(User $user, Watchlist $watchlist): bool
    {
        return $this->usersOwnWatchlist($user, $watchlist) && $watchlist->securities()->count() === 0;
    }
}
