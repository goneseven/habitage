import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useHouseholdStore } from '../../store/useHouseholdStore';
import { useUIStore } from '../../store/useUIStore';
import { SUPPORTED_CURRENCIES } from '../../types';

const householdSchema = z.object({
  name: z.string().min(2, 'Household name must be at least 2 characters'),
  propertyType: z.enum([
    'single_family',
    'apartment',
    'townhouse',
    'estate',
    'vacation_home',
    'penthouse',
    'villa',
    'other',
  ]),
  currency: z.string().min(1, 'Please select a currency'),
  address: z.string().optional(),
  yearBuilt: z
    .preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().int().min(1700).max(2100).optional()),
  squareMeters: z
    .preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  insurancePolicyLimit: z
    .preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().nonnegative().optional()),
  insuranceDeductible: z
    .preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().nonnegative().optional()),
  notes: z.string().optional(),
});

type HouseholdFormData = z.infer<typeof householdSchema>;

const PROPERTY_TYPE_OPTIONS = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'villa', label: 'Villa / Manor' },
  { value: 'estate', label: 'Private Estate' },
  { value: 'apartment', label: 'Apartment / Condominium' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse / Brownstone' },
  { value: 'vacation_home', label: 'Vacation / Holiday Residence' },
  { value: 'other', label: 'Other Property' },
];

export const HouseholdModal: React.FC = () => {
  const { isHouseholdModalOpen, householdModalMode, closeHouseholdModal, showToast } = useUIStore();
  const { activeHousehold, createHousehold, updateHousehold } = useHouseholdStore();

  const isEdit = householdModalMode === 'edit' && activeHousehold !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: '',
      propertyType: 'single_family',
      currency: 'USD',
      address: '',
      yearBuilt: undefined,
      squareMeters: undefined,
      insurancePolicyLimit: undefined,
      insuranceDeductible: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (isEdit && activeHousehold) {
      reset({
        name: activeHousehold.name,
        propertyType: activeHousehold.propertyType,
        currency: activeHousehold.currency,
        address: activeHousehold.address || '',
        yearBuilt: activeHousehold.yearBuilt,
        squareMeters: activeHousehold.squareMeters,
        insurancePolicyLimit: activeHousehold.insurancePolicyLimit,
        insuranceDeductible: activeHousehold.insuranceDeductible,
        notes: activeHousehold.notes || '',
      });
    } else {
      reset({
        name: '',
        propertyType: 'single_family',
        currency: 'USD',
        address: '',
        yearBuilt: undefined,
        squareMeters: undefined,
        insurancePolicyLimit: undefined,
        insuranceDeductible: undefined,
        notes: '',
      });
    }
  }, [isEdit, activeHousehold, reset, isHouseholdModalOpen]);

  const onSubmit = async (data: HouseholdFormData) => {
    try {
      if (isEdit && activeHousehold) {
        await updateHousehold(activeHousehold.id, data);
        showToast({
          type: 'success',
          title: 'Household Updated',
          message: `"${data.name}" profile has been updated.`,
        });
      } else {
        const created = await createHousehold(data as any);
        showToast({
          type: 'success',
          title: 'Household Created',
          message: `"${created.name}" is now your active residence.`,
        });
      }
      closeHouseholdModal();
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save household details. Please try again.',
      });
    }
  };

  const currencyOptions = SUPPORTED_CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol}) — ${c.name}`,
  }));

  return (
    <Modal
      isOpen={isHouseholdModalOpen}
      onClose={closeHouseholdModal}
      maxWidth="lg"
      title={isEdit ? 'Edit Household Profile' : 'New Household Profile'}
      subtitle={
        isEdit
          ? 'Update property details, address, and default financial currency.'
          : 'Create a distinct archive for a new residence, estate, or holiday home.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Household / Residence Name *"
          placeholder="e.g. The Palm Grove Residence, Penthouse on Park"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Property Type"
            options={PROPERTY_TYPE_OPTIONS}
            error={errors.propertyType?.message}
            {...register('propertyType')}
          />
          <Select
            label="Default Currency"
            options={currencyOptions}
            error={errors.currency?.message}
            {...register('currency')}
          />
        </div>

        <Input
          label="Street Address / Location"
          placeholder="e.g. 420 Orchid Crest Avenue, Palm Terraces, CA"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Year Built (Optional)"
            type="number"
            placeholder="e.g. 1968"
            error={errors.yearBuilt?.message}
            {...register('yearBuilt')}
          />
          <Input
            label="Floor Area (m² or sq ft)"
            type="number"
            placeholder="e.g. 450"
            error={errors.squareMeters?.message}
            {...register('squareMeters')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Home Insurance Policy Limit"
            type="number"
            placeholder="e.g. 750000"
            helperText="Used for insurance coverage gap intelligence"
            error={errors.insurancePolicyLimit?.message}
            {...register('insurancePolicyLimit')}
          />
          <Input
            label="Policy Deductible"
            type="number"
            placeholder="e.g. 5000"
            error={errors.insuranceDeductible?.message}
            {...register('insuranceDeductible')}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800">
            Household Notes & Architectural Context
          </label>
          <textarea
            rows={3}
            placeholder="Key security instructions, construction notes, style descriptions..."
            className="flex w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-sm text-forest-950 placeholder:text-forest-400 transition-colors focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700 shadow-xs"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-200">
          <Button type="button" variant="outline" onClick={closeHouseholdModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Residence'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
