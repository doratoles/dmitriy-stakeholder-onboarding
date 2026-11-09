<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stakeholder extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'role_id',
        'name',
        'email',
        'influence',
        'active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'role_id' => 'integer',
            'influence' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeOrderedByInfluence(Builder $query): Builder
    {
        return $query->orderByDesc('influence');
    }
}
