<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	use WithoutModelEvents;

    public function run(): void
    {
        $roles = [
            ['id' => 1, 'title' => 'Замовник / Клієнт'],
            ['id' => 2, 'title' => 'Product Manager'],
            ['id' => 3, 'title' => 'Tech Lead / Розробник'],
            ['id' => 4, 'title' => 'Інвестор'],
        ];

        foreach ($roles as $roleData) {
            Role::query()->updateOrCreate(['id' => $roleData['id']], $roleData);
        }

        $organizations = [
            ['name' => 'Nova Logistics Group', 'domain' => 'novalogistics.com'],
            ['name' => 'TechVision Studio', 'domain' => 'techvision.com'],
            ['name' => 'CoreDev Solutions', 'domain' => 'coredev.com'],
        ];

        foreach ($organizations as $orgData) {
            $org = Organization::factory()->create($orgData);
            Stakeholder::factory()->count(5)->create([
                'organization_id' => $org->id,
            ]);
        }
    }
}
