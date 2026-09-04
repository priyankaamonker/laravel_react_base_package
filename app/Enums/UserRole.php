<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'superadmin';
    case Admin = 'admin';
    case Candidate = 'candidate';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::SuperAdmin => 'SuperAdmin',
            self::Admin => 'Admin',
            self::Candidate => 'Candidate',
        };
    }

    public static function UsersWithoutSuperAdminRole(): array
    {
        $cases = self::cases();

        if (auth()->user() && ! auth()->user()->is_admin) {
            $cases = array_filter($cases, fn ($case) => $case !== self::SuperAdmin);
        }

        // Return array mapping value => label
        return collect($cases)->mapWithKeys(fn ($case) => [$case->value => $case->getLabel()])->toArray();
    }
}