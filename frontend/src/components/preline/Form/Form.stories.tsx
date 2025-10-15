import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Lock, User, Search, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Input,
  Textarea,
  Label,
  Select,
  Switch,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from './index';

const meta = {
  title: 'Preline/Form',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/**
 * Input - Default
 */
export const InputDefault: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" type="text" placeholder="John Doe" />
      </div>
    </div>
  ),
};

/**
 * Input - With Icons
 */
export const InputWithIcons: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail />}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          leftIcon={<Lock />}
        />
      </div>

      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          leftIcon={<Search />}
        />
      </div>
    </div>
  ),
};

/**
 * Input - Validation States
 */
export const InputValidation: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="error-input" error>
          Email (Error)
        </Label>
        <Input
          id="error-input"
          type="email"
          placeholder="you@example.com"
          error
          leftIcon={<Mail />}
          rightIcon={<AlertCircle />}
          helperText="Please enter a valid email address"
        />
      </div>

      <div>
        <Label htmlFor="success-input">Email (Success)</Label>
        <Input
          id="success-input"
          type="email"
          placeholder="you@example.com"
          success
          leftIcon={<Mail />}
          rightIcon={<CheckCircle />}
          helperText="Email is valid"
        />
      </div>

      <div>
        <Label htmlFor="disabled-input">Email (Disabled)</Label>
        <Input
          id="disabled-input"
          type="email"
          placeholder="you@example.com"
          disabled
          value="disabled@example.com"
        />
      </div>
    </div>
  ),
};

/**
 * Input - Required Field
 */
export const InputRequired: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <Label htmlFor="required" required>
        Email Address
      </Label>
      <Input
        id="required"
        type="email"
        placeholder="you@example.com"
        required
        leftIcon={<Mail />}
        helperText="This field is required"
      />
    </div>
  ),
};

/**
 * Textarea - Default
 */
export const TextareaDefault: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Enter your message..." />
      </div>
    </div>
  ),
};

/**
 * Textarea - Validation States
 */
export const TextareaValidation: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="error-textarea" error>
          Message (Error)
        </Label>
        <Textarea
          id="error-textarea"
          placeholder="Enter your message..."
          error
          helperText="Message must be at least 10 characters"
        />
      </div>

      <div>
        <Label htmlFor="success-textarea">Message (Success)</Label>
        <Textarea
          id="success-textarea"
          placeholder="Enter your message..."
          success
          helperText="Message looks good"
          value="This is a valid message with enough characters."
        />
      </div>

      <div>
        <Label htmlFor="disabled-textarea">Message (Disabled)</Label>
        <Textarea
          id="disabled-textarea"
          placeholder="Enter your message..."
          disabled
          value="This textarea is disabled"
        />
      </div>
    </div>
  ),
};

/**
 * Textarea - Resize Options
 */
export const TextareaResize: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="resize-none">No Resize</Label>
        <Textarea
          id="resize-none"
          resize="none"
          placeholder="Cannot be resized"
        />
      </div>

      <div>
        <Label htmlFor="resize-vertical">Vertical Resize</Label>
        <Textarea
          id="resize-vertical"
          resize="vertical"
          placeholder="Resize vertically only"
        />
      </div>

      <div>
        <Label htmlFor="resize-both">Both Directions</Label>
        <Textarea
          id="resize-both"
          resize="both"
          placeholder="Resize in any direction"
        />
      </div>
    </div>
  ),
};

/**
 * Select - Default
 */
export const SelectDefault: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="country">Country</Label>
        <Select id="country">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Select - Validation States
 */
export const SelectValidation: StoryObj = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="error-select" error>
          Country (Error)
        </Label>
        <Select id="error-select" error helperText="Please select a country">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="success-select">Country (Success)</Label>
        <Select
          id="success-select"
          success
          helperText="Country selected"
          value="us"
        >
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="disabled-select">Country (Disabled)</Label>
        <Select id="disabled-select" disabled value="us">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Switch - Sizes
 */
export const SwitchSizes: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch id="switch-sm" size="sm" />
        <Label htmlFor="switch-sm" className="mb-0">
          Small Switch
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="switch-default" size="default" defaultChecked />
        <Label htmlFor="switch-default" className="mb-0">
          Default Switch (Checked)
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="switch-lg" size="lg" />
        <Label htmlFor="switch-lg" className="mb-0">
          Large Switch
        </Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="switch-disabled" disabled />
        <Label htmlFor="switch-disabled" className="mb-0">
          Disabled Switch
        </Label>
      </div>
    </div>
  ),
};

/**
 * Checkbox - Examples
 */
export const CheckboxExamples: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="mb-0 font-normal">
          Accept terms and conditions
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="marketing" defaultChecked />
        <Label htmlFor="marketing" className="mb-0 font-normal">
          Receive marketing emails
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="error-checkbox" error />
        <Label htmlFor="error-checkbox" className="mb-0 font-normal" error>
          This field has an error
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checkbox" disabled />
        <Label htmlFor="disabled-checkbox" className="mb-0 font-normal">
          Disabled checkbox
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked" className="mb-0 font-normal">
          Disabled and checked
        </Label>
      </div>
    </div>
  ),
};

/**
 * Radio - Group Example
 */
export const RadioExample: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Label>Notification Method</Label>
      <RadioGroup defaultValue="email">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="radio-email" />
          <Label htmlFor="radio-email" className="mb-0 font-normal">
            Email
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sms" id="radio-sms" />
          <Label htmlFor="radio-sms" className="mb-0 font-normal">
            SMS
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="push" id="radio-push" />
          <Label htmlFor="radio-push" className="mb-0 font-normal">
            Push Notification
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="none" id="radio-none" disabled />
          <Label htmlFor="radio-none" className="mb-0 font-normal">
            None (Disabled)
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Complete Form Example
 */
export const CompleteForm: StoryObj = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create Account
        </h3>
      </div>

      <div>
        <Label htmlFor="form-name" required>
          Full Name
        </Label>
        <Input
          id="form-name"
          type="text"
          placeholder="John Doe"
          leftIcon={<User />}
        />
      </div>

      <div>
        <Label htmlFor="form-email" required>
          Email Address
        </Label>
        <Input
          id="form-email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail />}
        />
      </div>

      <div>
        <Label htmlFor="form-password" required>
          Password
        </Label>
        <Input
          id="form-password"
          type="password"
          placeholder="Enter password"
          leftIcon={<Lock />}
          helperText="Must be at least 8 characters"
        />
      </div>

      <div>
        <Label htmlFor="form-country">Country</Label>
        <Select id="form-country">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="form-bio">Bio</Label>
        <Textarea
          id="form-bio"
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="form-terms" />
          <Label htmlFor="form-terms" className="mb-0 font-normal">
            I agree to the terms and conditions
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="form-newsletter" size="sm" />
          <Label htmlFor="form-newsletter" className="mb-0 font-normal">
            Subscribe to newsletter
          </Label>
        </div>
      </div>

      <div>
        <Label>Account Type</Label>
        <RadioGroup defaultValue="personal">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="personal" id="type-personal" />
            <Label htmlFor="type-personal" className="mb-0 font-normal">
              Personal
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="business" id="type-business" />
            <Label htmlFor="type-business" className="mb-0 font-normal">
              Business
            </Label>
          </div>
        </RadioGroup>
      </div>

      <button
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        type="submit"
      >
        Create Account
      </button>
    </div>
  ),
};
