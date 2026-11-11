<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Stakeholder;
use Inertia\Inertia;
use Inertia\Response;

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
}
