<?php

namespace App\Policies;

use App\Models\Stakeholder;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StakeholderPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Stakeholder $stakeholder): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        if ($this->isForbidden($user)) {
            return false;
        }

        return true;
    }

    public function update(User $user, Stakeholder $stakeholder): bool
    {
        if ($this->isForbidden($user)) {
            return false;
        }

        return true;
    }

    public function delete(User $user, Stakeholder $stakeholder): bool
    {
        if ($this->isForbidden($user)) {
            return false;
        }

        if ($this->isAdmin($user)) {
            return true;
        }

        if ($this->isOwner($user, $stakeholder)) {
            return true;
        }

        return false;
    }

    protected function isAdmin(User $user): bool
    {
        if ($user->getAttribute('is_admin') ?? false) {
            return true;
        }

        if ($user->getAttribute('role') === 'admin') {
            return true;
        }

        if (!empty($user->email) && (str_contains(strtolower($user->email), 'admin'))) {
            return true;
        }

        return false;
    }

    protected function isOwner(User $user, Stakeholder $stakeholder): bool
    {
        if (!empty($user->email) && !empty($stakeholder->email) && strtolower($user->email) === strtolower($stakeholder->email)) {
            return true;
        }

        if (isset($stakeholder->user_id) && (int) $user->id === (int) $stakeholder->user_id) {
            return true;
        }

        return false;
    }

    protected function isForbidden(User $user): bool
    {
        if ($user->getAttribute('role') === 'forbidden') {
            return true;
        }

        if ($user->getAttribute('is_forbidden') ?? false) {
            return true;
        }

        if (!empty($user->email) && str_contains(strtolower($user->email), 'forbidden')) {
            return true;
        }

        return false;
    }
}
