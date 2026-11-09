<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use Illuminate\Database\Eloquent\Factories\Factory;

class StakeholderFactory extends Factory
{
    protected $model = Stakeholder::class;

    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'role_id' => Role::inRandomOrder()->value('id') ?? 1,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'influence' => fake()->numberBetween(1, 5),
            'active' => fake()->boolean(80),
            'notes' => fake()->sentence(),
        ];
    }
}
