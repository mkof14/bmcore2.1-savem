import { describe, expect, it } from 'vitest';
import {
  classifySavenCommandText,
  createSavenPrivacyReview,
  getSavenPrivacyDecision,
  redactSavenSensitiveText,
  savenPrivacyPolicyMatrix,
} from '../savenPrivacyGuardrailsService';

describe('savenPrivacyGuardrailsService', () => {
  it('classifies SAVEN commands by support data class', () => {
    expect(classifySavenCommandText('Hey SAVEN, request nurse follow-up.')).toBe('care_contact');
    expect(classifySavenCommandText('Hey SAVEN, check robot physical approval.')).toBe('robot_gate');
    expect(classifySavenCommandText('Hey SAVEN, urgent emergency help now.')).toBe('emergency_route');
    expect(classifySavenCommandText('Hey SAVEN, check wearable sensor.')).toBe('device_signal');
  });

  it('redacts sensitive free text before broad sharing', () => {
    const redacted = redactSavenSensitiveText('Medication dose: 10mg, email anna@example.com, SSN 123-45-6789.');

    expect(redacted).toContain('[redacted]');
    expect(redacted).not.toContain('anna@example.com');
    expect(redacted).not.toContain('123-45-6789');
  });

  it('keeps robot and emergency rules restricted', () => {
    expect(getSavenPrivacyDecision('robot_gate').allowedRoles).toEqual(['Caregiver', 'Admin']);
    expect(getSavenPrivacyDecision('emergency_route').redactBeforeFamilyDigest).toBe(true);
    expect(getSavenPrivacyDecision('admin_audit').allowedRoles).toEqual(['Admin']);
  });

  it('has a policy decision for every SAVEN data class', () => {
    expect(savenPrivacyPolicyMatrix.map((item) => item.dataClass)).toEqual([
      'support_command',
      'care_contact',
      'clinical_context',
      'device_signal',
      'robot_gate',
      'emergency_route',
      'admin_audit',
    ]);
  });

  it('creates a family-safe review for clinical text', () => {
    const review = createSavenPrivacyReview('Prepare doctor clinical summary. Diagnosis: recovery concern.');

    expect(review.dataClass).toBe('clinical_context');
    expect(review.familyDigestText).toContain('[redacted]');
  });
});
