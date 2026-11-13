<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use App\Http\Requests\Training\StoreStakeholderRequest;
use App\Http\Requests\Training\UpdateStakeholderRequest;
use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StakeholderPageController extends Controller
{
    public function index(): Response
    {
        $stakeholders = Stakeholder::with('organization')
            ->orderedByInfluence()
            ->get()
            ->map(fn (Stakeholder $stakeholder) => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization' => $stakeholder->organization->name,
            ]);

        $availableRoles = Role::query()->get(['id', 'title']);

        return Inertia::render('training/stakeholders/index', [
            'stakeholders' => $stakeholders,
            'availableRoles' => $availableRoles,
        ]);
    }

    public function show(Stakeholder $stakeholder): Response
    {
        $stakeholder->load(['organization', 'role']);
        $availableRoles = Role::query()->get(['id', 'title']);

        return Inertia::render('training/stakeholders/show', [
            'stakeholder' => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization' => $stakeholder->organization->name,
                'active' => $stakeholder->active,
                'notes' => $stakeholder->notes,
            ],
            'availableRoles' => $availableRoles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('training/stakeholders/create', [
            'availableRoles' => Role::query()->get(['id', 'title']),
            'availableOrganizations' => Organization::query()->get(['id', 'name']),
        ]);
    }

    public function store(StoreStakeholderRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (array_key_exists('role', $data)) {
            $data['role_id'] = $data['role'];
            unset($data['role']);
        }

        $stakeholder = Stakeholder::create($data);

        return redirect()
            ->route('training.stakeholders.show', $stakeholder->id)
            ->with('success', 'Stakeholder created');
    }

    public function edit(Stakeholder $stakeholder): Response
    {
        $stakeholder->load(['organization', 'role']);

        return Inertia::render('training/stakeholders/edit', [
            'stakeholder' => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization_id' => $stakeholder->organization_id,
                'notes' => $stakeholder->notes,
            ],
            'availableRoles' => Role::query()->get(['id', 'title']),
            'availableOrganizations' => Organization::query()->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStakeholderRequest $request, Stakeholder $stakeholder): RedirectResponse
    {
        $data = $request->validated();

        if (array_key_exists('role', $data)) {
            $data['role_id'] = $data['role'];
            unset($data['role']);
        }

        $stakeholder->update($data);

        return redirect()
            ->route('training.stakeholders.show', $stakeholder->id)
            ->with('success', 'Stakeholder updated');
    }
}
