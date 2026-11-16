<?php

namespace App\Http\Requests\Training;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStakeholderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', 'integer'],
            'influence' => ['required', 'integer', 'min:1', 'max:5'],
            'organization_id' => ['required', 'integer'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
	
	public function messages(): array
    {
        return [
            'name.required' => "Ім'я є обов'язковим полем",
            'email.required' => "Email є обов'язковим полем",
            'email.email' => "Будь ласка, введіть коректну електронну адресу",
            'role.required' => 'Оберіть роль',
            'influence.required' => 'Оберіть рівень впливу',
            'organization_id.required' => 'Оберіть організацію',
        ];
    }
}
