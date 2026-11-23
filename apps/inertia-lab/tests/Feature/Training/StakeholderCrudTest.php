<?php

namespace Tests\Feature\Training;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StakeholderCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_from_all_stakeholder_routes(): void
    {
        $role = Role::create(['title' => 'Менеджер']);
        $org = Organization::factory()->create();
        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $this->get('/training/stakeholders')->assertRedirect('/login');
        $this->get('/training/stakeholders/create')->assertRedirect('/login');
        $this->post('/training/stakeholders', [])->assertRedirect('/login');
        $this->get("/training/stakeholders/{$stakeholder->id}")->assertRedirect('/login');
        $this->get("/training/stakeholders/{$stakeholder->id}/edit")->assertRedirect('/login');
        $this->put("/training/stakeholders/{$stakeholder->id}", [])->assertRedirect('/login');
        $this->delete("/training/stakeholders/{$stakeholder->id}")->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_index_with_paginated_stakeholders_and_props(): void
    {
        $user = User::factory()->create();
        $role = Role::create(['title' => 'Аналітик']);
        $org = Organization::factory()->create();

        Stakeholder::factory()->count(15)->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $this->actingAs($user)
            ->get('/training/stakeholders')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/index')
                ->has('stakeholders.data', 10)
                ->where('stakeholders.total', 15)
                ->has('stakeholders.links')
                ->has('availableRoles')
                ->has('availableOrganizations')
                ->has('filters')
                ->has('can.create')
            );
    }

    public function test_search_filter_filters_by_name_and_email(): void
    {
        $user = User::factory()->create();
        $role = Role::create(['title' => 'Розробник']);
        $org = Organization::factory()->create();

        Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Олексій Рева',
            'email' => 'reva@example.com',
        ]);

        Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Марина Козак',
            'email' => 'kozak@example.com',
        ]);

        // Пошук за ім'ям
        $this->actingAs($user)
            ->get('/training/stakeholders?search=Рева')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/index')
                ->has('stakeholders.data', 1)
                ->where('stakeholders.data.0.name', 'Олексій Рева')
                ->where('filters.search', 'Рева')
            );

        // Пошук за email
        $this->actingAs($user)
            ->get('/training/stakeholders?search=kozak@example.com')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/index')
                ->has('stakeholders.data', 1)
                ->where('stakeholders.data.0.email', 'kozak@example.com')
                ->where('filters.search', 'kozak@example.com')
            );
    }

    public function test_role_and_organization_filters_work_and_preserve_query_string(): void
    {
        $user = User::factory()->create();
        $roleA = Role::create(['title' => 'Роль А']);
        $roleB = Role::create(['title' => 'Роль Б']);
        $orgA = Organization::factory()->create(['name' => 'Організація А']);
        $orgB = Organization::factory()->create(['name' => 'Організація Б']);

        Stakeholder::factory()->create([
            'organization_id' => $orgA->id,
            'role_id' => $roleA->id,
            'name' => 'Цільовий Стейкхолдер',
        ]);

        Stakeholder::factory()->create([
            'organization_id' => $orgB->id,
            'role_id' => $roleB->id,
            'name' => 'Інший Стейкхолдер',
        ]);

        $this->actingAs($user)
            ->get("/training/stakeholders?role={$roleA->id}&organization_id={$orgA->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/index')
                ->has('stakeholders.data', 1)
                ->where('stakeholders.data.0.name', 'Цільовий Стейкхолдер')
                ->where('filters.role', (string) $roleA->id)
                ->where('filters.organization_id', (string) $orgA->id)
            );
    }

    public function test_empty_state_when_filters_match_no_records(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/training/stakeholders?search=НевдомийЗапит12345')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/index')
                ->has('stakeholders.data', 0)
                ->where('stakeholders.total', 0)
            );
    }

    public function test_authenticated_user_can_view_create_page(): void
    {
        $user = User::factory()->create();
        Role::create(['title' => 'Тестувальник']);
        Organization::factory()->create();

        $this->actingAs($user)
            ->get('/training/stakeholders/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/create')
                ->has('availableRoles')
                ->has('availableOrganizations')
            );
    }

    public function test_authenticated_user_can_create_stakeholder_and_redirects_with_flash(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Product Owner']);

        $payload = [
            'name' => 'Віталій Бондар',
            'email' => 'bondar@example.com',
            'role' => $role->id,
            'influence' => 4,
            'organization_id' => $org->id,
            'notes' => 'Новий запис',
        ];

        $response = $this->actingAs($user)->post('/training/stakeholders', $payload);

        $stakeholder = Stakeholder::where('email', 'bondar@example.com')->firstOrFail();

        $response->assertRedirect("/training/stakeholders/{$stakeholder->id}");
        $response->assertSessionHas('success', 'Stakeholder created');

        $this->assertDatabaseHas('stakeholders', [
            'id' => $stakeholder->id,
            'name' => 'Віталій Бондар',
            'email' => 'bondar@example.com',
            'role_id' => $role->id,
            'organization_id' => $org->id,
            'influence' => 4,
        ]);
    }

    public function test_create_validation_fails_with_invalid_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/training/stakeholders', [
            'name' => '',
            'email' => 'invalid-email',
            'role' => '',
            'influence' => 10,
            'organization_id' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'role', 'influence', 'organization_id']);
        $this->assertDatabaseCount('stakeholders', 0);
    }

    public function test_authenticated_user_can_view_show_page(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'Nova Logistics']);
        $role = Role::create(['title' => 'Директор']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Іван Петренко',
            'email' => 'petrenko@example.com',
            'influence' => 5,
        ]);

        $this->actingAs($user)
            ->get("/training/stakeholders/{$stakeholder->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/show')
                ->where('stakeholder.id', $stakeholder->id)
                ->where('stakeholder.name', 'Іван Петренко')
                ->where('stakeholder.organization', 'Nova Logistics')
                ->has('availableRoles')
            );
    }

    public function test_authenticated_user_can_view_edit_page(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Lead Dev']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $this->actingAs($user)
            ->get("/training/stakeholders/{$stakeholder->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/edit')
                ->where('stakeholder.id', $stakeholder->id)
                ->has('availableRoles')
                ->has('availableOrganizations')
            );
    }

    public function test_authenticated_user_can_update_stakeholder(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $newOrg = Organization::factory()->create();
        $role = Role::create(['title' => 'Стара роль']);
        $newRole = Role::create(['title' => 'Нова роль']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Старе Ім\'я',
            'email' => 'old@example.com',
        ]);

        $payload = [
            'name' => 'Нове Ім\'я',
            'email' => 'new@example.com',
            'role' => $newRole->id,
            'influence' => 3,
            'organization_id' => $newOrg->id,
            'notes' => 'Оновлено',
        ];

        $response = $this->actingAs($user)->put("/training/stakeholders/{$stakeholder->id}", $payload);

        $response->assertRedirect("/training/stakeholders/{$stakeholder->id}");
        $response->assertSessionHas('success', 'Stakeholder updated');

        $this->assertDatabaseHas('stakeholders', [
            'id' => $stakeholder->id,
            'name' => 'Нове Ім\'я',
            'email' => 'new@example.com',
            'role_id' => $newRole->id,
            'organization_id' => $newOrg->id,
        ]);
    }

    public function test_update_validation_fails_with_invalid_data(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Архітектор']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $response = $this->actingAs($user)->put("/training/stakeholders/{$stakeholder->id}", [
            'name' => '',
            'email' => 'bad-email',
            'role' => '',
            'influence' => 99,
            'organization_id' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'role', 'influence', 'organization_id']);
    }

    public function test_admin_user_can_delete_stakeholder_and_redirects_with_flash(): void
    {
        $admin = User::factory()->create(['email' => 'superadmin@admin.com']);
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Менеджер']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $response = $this->actingAs($admin)->delete("/training/stakeholders/{$stakeholder->id}");

        $response->assertRedirect('/training/stakeholders');
        $response->assertSessionHas('success', 'Stakeholder deleted');

        $this->assertDatabaseMissing('stakeholders', ['id' => $stakeholder->id]);
    }

    public function test_owner_user_can_delete_their_own_stakeholder(): void
    {
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Власник']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'email' => 'owner.unique@company.com',
        ]);

        $owner = User::factory()->create(['email' => 'owner.unique@company.com']);

        $response = $this->actingAs($owner)->delete("/training/stakeholders/{$stakeholder->id}");

        $response->assertRedirect('/training/stakeholders');
        $response->assertSessionHas('success', 'Stakeholder deleted');

        $this->assertDatabaseMissing('stakeholders', ['id' => $stakeholder->id]);
    }

    public function test_forbidden_user_cannot_delete_stakeholder_and_receives_403(): void
    {
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Співробітник']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'email' => 'stakeholder@company.com',
        ]);

        // Користувач не є адміном і не є власником
        $regularUser = User::factory()->create(['email' => 'regular.user@example.com']);

        $response = $this->actingAs($regularUser)->delete("/training/stakeholders/{$stakeholder->id}");

        $response->assertForbidden();

        // Запис залишається у БД
        $this->assertDatabaseHas('stakeholders', ['id' => $stakeholder->id]);
    }

    public function test_missing_stakeholder_returns_404_for_all_actions(): void
    {
        $user = User::factory()->create(['email' => 'admin@admin.com']);
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Будь-хто']);

        $this->actingAs($user)->get('/training/stakeholders/999')->assertNotFound();
        $this->actingAs($user)->get('/training/stakeholders/999/edit')->assertNotFound();
        $this->actingAs($user)->put('/training/stakeholders/999', [
            'name' => 'Тест',
            'email' => 'test@example.com',
            'role' => $role->id,
            'influence' => 3,
            'organization_id' => $org->id,
        ])->assertNotFound();
        $this->actingAs($user)->delete('/training/stakeholders/999')->assertNotFound();
    }
}