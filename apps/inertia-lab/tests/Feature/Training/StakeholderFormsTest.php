<?php

namespace Tests\Feature\Training;

use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StakeholderFormsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_create_and_edit_to_login(): void
    {
        $role = Role::create(['title' => 'Product Manager']);
        $org = Organization::factory()->create(['name' => 'Nova Digital']);
        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
        ]);

        $this->get('/training/stakeholders/create')->assertRedirect('/login');
        $this->post('/training/stakeholders', [])->assertRedirect('/login');
        $this->get("/training/stakeholders/{$stakeholder->id}/edit")->assertRedirect('/login');
        $this->put("/training/stakeholders/{$stakeholder->id}", [])->assertRedirect('/login');
    }

    public function test_handle_inertia_requests_shares_minimal_auth_user_and_flash(): void
    {
        $user = User::factory()->create([
            'name' => 'Олексій Рева',
            'email' => 'oleksii@example.com',
        ]);

        $this->actingAs($user)
            ->get('/training/stakeholders/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/create')
                ->where('auth.user.id', $user->id)
                ->where('auth.user.name', 'Олексій Рева')
                ->where('auth.user.email', 'oleksii@example.com')
                ->missing('auth.user.password')
                ->missing('auth.user.remember_token')
                ->missing('auth.user.created_at')
            );
    }

    public function test_authenticated_user_can_view_create_page_with_roles_and_organizations(): void
    {
        $user = User::factory()->create();
        Role::create(['title' => 'Бізнес-аналітик']);
        Organization::factory()->create(['name' => 'TechVision Studio']);

        $this->actingAs($user)
            ->get('/training/stakeholders/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/create')
                ->has('availableRoles')
                ->has('availableOrganizations')
            );
    }

    public function test_authenticated_user_can_store_stakeholder_with_valid_data_and_redirect_with_flash(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'Nova Logistics Group']);
        $role = Role::create(['title' => 'Замовник / Клієнт']);

        $payload = [
            'name' => 'Олександр Ковальчук',
            'email' => 'kovalchuk@gmail.com',
            'role' => $role->id,
            'influence' => 4,
            'organization_id' => $org->id,
            'notes' => 'Ключовий стейкхолдер проєкту',
        ];

        // 1. Звичайний submit з редиректом
        $response = $this->actingAs($user)->post('/training/stakeholders', $payload);

        $stakeholder = Stakeholder::where('email', 'kovalchuk@gmail.com')->firstOrFail();

        $response->assertRedirect("/training/stakeholders/{$stakeholder->id}");
        $response->assertSessionHas('success', 'Stakeholder created');

        $this->assertDatabaseHas('stakeholders', [
            'id' => $stakeholder->id,
            'name' => 'Олександр Ковальчук',
            'email' => 'kovalchuk@gmail.com',
            'role_id' => $role->id,
            'organization_id' => $org->id,
            'influence' => 4,
            'notes' => 'Ключовий стейкхолдер проєкту',
        ]);

        // 2. Перевіряємо доставку flash.success в Inertia props після редиректу
        $this->actingAs($user)
            ->get("/training/stakeholders/{$stakeholder->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->where('flash.success', 'Stakeholder created')
            );
    }

    public function test_store_validation_errors_redirect_back_with_session_errors(): void
    {
        $user = User::factory()->create();

        $invalidPayload = [
            'name' => '',
            'email' => 'not-a-valid-email',
            'role' => '',
            'influence' => 999,
            'organization_id' => '',
        ];

        // Перевірка сесійних помилок валідації (Standard Form Submit)
        $response = $this->actingAs($user)->post('/training/stakeholders', $invalidPayload);
        $response->assertSessionHasErrors(['name', 'email', 'role', 'influence', 'organization_id']);
        $this->assertDatabaseCount('stakeholders', 0);

        // Перевірка 422 HTTP-статусу (AJAX / JSON / Inertia API Request)
        $jsonResponse = $this->actingAs($user)->postJson('/training/stakeholders', $invalidPayload);
        $jsonResponse->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'role', 'influence', 'organization_id']);
    }

    public function test_authenticated_user_can_view_edit_page_with_correct_props(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'TechVision Studio']);
        $role = Role::create(['title' => 'Product Manager']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Марія Мельник',
            'email' => 'melnyk@gmail.com',
            'influence' => 2,
            'notes' => 'Product Owner',
        ]);

        $this->actingAs($user)
            ->get("/training/stakeholders/{$stakeholder->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('training/stakeholders/edit')
                ->has('availableRoles')
                ->has('availableOrganizations')
                ->has('stakeholder', fn (Assert $item) => $item
                    ->where('id', $stakeholder->id)
                    ->where('name', 'Марія Мельник')
                    ->where('email', 'melnyk@gmail.com')
                    ->where('role', $role->id)
                    ->where('influence', 2)
                    ->where('organization_id', $org->id)
                    ->where('notes', 'Product Owner')
                )
            );
    }

    public function test_authenticated_user_can_update_stakeholder_and_redirect_with_flash(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['name' => 'Old Studio']);
        $role = Role::create(['title' => 'Старша роль']);

        $newOrg = Organization::factory()->create(['name' => 'New Enterprise']);
        $newRole = Role::create(['title' => 'Нова роль']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Початкове Ім\'я',
            'email' => 'initial@gmail.com',
            'influence' => 1,
        ]);

        $updatedPayload = [
            'name' => 'Оновлене Ім\'я',
            'email' => 'updated@gmail.com',
            'role' => $newRole->id,
            'influence' => 5,
            'organization_id' => $newOrg->id,
            'notes' => 'Оновлені примітки',
        ];

        $response = $this->actingAs($user)->put("/training/stakeholders/{$stakeholder->id}", $updatedPayload);

        $response->assertRedirect("/training/stakeholders/{$stakeholder->id}");
        $response->assertSessionHas('success', 'Stakeholder updated');

        $this->assertDatabaseHas('stakeholders', [
            'id' => $stakeholder->id,
            'name' => 'Оновлене Ім\'я',
            'email' => 'updated@gmail.com',
            'role_id' => $newRole->id,
            'organization_id' => $newOrg->id,
            'influence' => 5,
            'notes' => 'Оновлені примітки',
        ]);
    }

    public function test_update_validation_errors_redirect_back_with_session_errors_and_422(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Архітектор']);

        $stakeholder = Stakeholder::factory()->create([
            'organization_id' => $org->id,
            'role_id' => $role->id,
            'name' => 'Незмінний',
            'email' => 'steady@gmail.com',
        ]);

        $invalidPayload = [
            'name' => '',
            'email' => 'invalid-email',
            'role' => null,
            'influence' => 0,
            'organization_id' => null,
        ];

        // 1. Session errors
        $response = $this->actingAs($user)->put("/training/stakeholders/{$stakeholder->id}", $invalidPayload);
        $response->assertSessionHasErrors(['name', 'email', 'role', 'influence', 'organization_id']);

        // 2. 422 JSON validation errors
        $jsonResponse = $this->actingAs($user)->putJson("/training/stakeholders/{$stakeholder->id}", $invalidPayload);
        $jsonResponse->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'role', 'influence', 'organization_id']);

        $this->assertDatabaseHas('stakeholders', [
            'id' => $stakeholder->id,
            'name' => 'Незмінний',
            'email' => 'steady@gmail.com',
        ]);
    }

    public function test_missing_stakeholder_returns_404_on_show_edit_and_update(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create();
        $role = Role::create(['title' => 'Будь-хто']);

        $this->actingAs($user)->get('/training/stakeholders/999')->assertNotFound();
        $this->actingAs($user)->get('/training/stakeholders/999/edit')->assertNotFound();
        $this->actingAs($user)->put('/training/stakeholders/999', [
            'name' => 'Тест',
            'email' => 'test@gmail.com',
            'role' => $role->id,
            'influence' => 3,
            'organization_id' => $org->id,
        ])->assertNotFound();
    }
}