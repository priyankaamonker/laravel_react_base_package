<?php

namespace App\Enums;
use Filament\Support\Contracts\HasLabel;

enum Education: string implements HasLabel
{
    case HighSchool = 'highschool';
    case SomeCollege = 'somecollege';
    case Associates = 'associates';
    case Bachelors = 'bachelors';
    case Masters = 'masters';
    case Doctorate = 'doctorate';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::HighSchool => 'High School',
            self::SomeCollege => 'Some College',
            self::Associates => 'Associates',
            self::Bachelors => 'Bachelors',
            self::Masters => 'Masters',
            self::Doctorate => 'Doctorate',
        };
    }
}