<?php

namespace Tests\Feature\Training;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StakeholderPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_index_to_login(): void
    {
        $response = $this->get('/training/stakeholders');

        $response->assertRedirect('/login');
    }

    public function test_guest_is_redirected_from_show_to_login(): void
    {
        $role = Role::create(['title' => 'Product Manager']);
        $stakeholder = Stakeholder::factory()->create(['role_id' => $role->id]);

        $response = $this->get("/training/stakeholders/{$stakeholder->id}");

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_index_with_typed_props(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'Nova Logistics Group']);
        $role = Role::create(['id' => 1, 'title' => 'Замовник / Клієнт']);

        Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Олександр Ковальчук',
            'email' => 'test1@gmail.com',
            'influence' => 1,
        ]);

        $response = $this->actingAs($user)->get('/training/stakeholders');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('training/stakeholders/index')
            ->has('stakeholders', 1)
            ->has('availableRoles')
            ->has('stakeholders.0', fn (Assert $item) => $item
                ->has('id')
                ->where('name', 'Олександр Ковальчук')
                ->where('email', 'test1@gmail.com')
                ->where('role', $role->id)
                ->where('influence', 1)
                ->where('organization', 'Nova Logistics Group')
            )
        );
    }

    public function test_authenticated_user_can_view_show_with_correct_props(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'TechVision Studio']);
        $role = Role::create(['id' => 2, 'title' => 'Product Manager']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Марія Мельник',
            'email' => 'test2@gmail.com',
            'influence' => 2,
            'active' => true,
            'notes' => 'Product Owner',
        ]);

        $response = $this->actingAs($user)->get("/training/stakeholders/{$stakeholder->id}");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('training/stakeholders/show')
            ->has('availableRoles')
            ->has('stakeholder', fn (Assert $item) => $item
                ->where('id', $stakeholder->id)
                ->where('name', 'Марія Мельник')
                ->where('email', 'test2@gmail.com')
                ->where('role', $role->id)
                ->where('influence', 2)
                ->where('organization', 'TechVision Studio')
                ->where('active', true)
                ->where('notes', 'Product Owner')
            )
        );
    }

    public function test_missing_stakeholder_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/training/stakeholders/999');

        $response->assertNotFound();
    }
}