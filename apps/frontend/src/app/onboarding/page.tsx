'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAccessToken } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './onboarding.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

type QuestionnaireState = {
  firstName: string;
  lastName: string;
  age: string;
  role: 'mother' | 'father' | '';
  height: string;
  build: string;
  ethnicity: string;
  education: string;
  interests: string[];
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

type TFunction = (key: string, vars?: Record<string, string>) => string;

const INTEREST_KEYS = ['Music', 'Sports', 'Reading', 'Art', 'Science', 'Technology', 'Travel', 'Cooking', 'Gaming', 'Nature'];

function QuestionnaireForm({
  questionnaire,
  setQuestionnaire,
  handleChange,
  handleInterestsToggle,
  t,
}: {
  questionnaire: QuestionnaireState;
  setQuestionnaire: React.Dispatch<React.SetStateAction<QuestionnaireState>>;
  handleChange: (setter: React.Dispatch<React.SetStateAction<QuestionnaireState>>, field: string, value: unknown) => void;
  handleInterestsToggle: (setter: React.Dispatch<React.SetStateAction<QuestionnaireState>>, interest: string) => void;
  t: TFunction;
}) {
  return (
    <div className={styles.questionnaireForm}>
      <div className={styles.fieldGroup}>
        <label htmlFor="firstName">{t('register.firstName')}</label>
        <input
          id="firstName"
          type="text"
          value={questionnaire.firstName}
          onChange={(e) => handleChange(setQuestionnaire, 'firstName', e.target.value)}
          placeholder={t('register.firstNamePlaceholder')}
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="lastName">{t('register.lastName')}</label>
        <input
          id="lastName"
          type="text"
          value={questionnaire.lastName}
          onChange={(e) => handleChange(setQuestionnaire, 'lastName', e.target.value)}
          placeholder={t('register.lastNamePlaceholder')}
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="age">{t('register.age')}</label>
        <input
          id="age"
          type="number"
          min={18}
          max={120}
          value={questionnaire.age}
          onChange={(e) => handleChange(setQuestionnaire, 'age', e.target.value)}
          placeholder={t('register.agePlaceholder')}
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <span className={styles.label}>{t('register.iAm')}</span>
        <div className={styles.roleOptions}>
          <button
            type="button"
            className={`${styles.roleBtn} ${questionnaire.role === 'mother' ? styles.active : ''}`}
            onClick={() => handleChange(setQuestionnaire, 'role', 'mother')}
          >
            {t('register.mother')}
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${questionnaire.role === 'father' ? styles.active : ''}`}
            onClick={() => handleChange(setQuestionnaire, 'role', 'father')}
          >
            {t('register.father')}
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="height">{t('onboarding.height')}</label>
        <input
          id="height"
          type="text"
          value={questionnaire.height}
          onChange={(e) => handleChange(setQuestionnaire, 'height', e.target.value)}
          placeholder={t('onboarding.heightPlaceholder')}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="build">{t('onboarding.build')}</label>
        <select
          id="build"
          value={questionnaire.build}
          onChange={(e) => handleChange(setQuestionnaire, 'build', e.target.value)}
        >
          <option value="">{t('common.select')}</option>
          <option value="slim">{t('onboarding.buildSlim')}</option>
          <option value="average">{t('onboarding.buildAverage')}</option>
          <option value="athletic">{t('onboarding.buildAthletic')}</option>
          <option value="stocky">{t('onboarding.buildStocky')}</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="ethnicity">{t('onboarding.ethnicity')}</label>
        <input
          id="ethnicity"
          type="text"
          value={questionnaire.ethnicity}
          onChange={(e) => handleChange(setQuestionnaire, 'ethnicity', e.target.value)}
          placeholder={t('onboarding.ethnicityPlaceholder')}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="education">{t('onboarding.education')}</label>
        <select
          id="education"
          value={questionnaire.education}
          onChange={(e) => handleChange(setQuestionnaire, 'education', e.target.value)}
        >
          <option value="">{t('common.select')}</option>
          <option value="high-school">{t('onboarding.educationHighSchool')}</option>
          <option value="bachelor">{t('onboarding.educationBachelor')}</option>
          <option value="master">{t('onboarding.educationMaster')}</option>
          <option value="phd">{t('onboarding.educationPhd')}</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label>{t('onboarding.interests')}</label>
        <div className={styles.interestsGrid}>
          {INTEREST_KEYS.map((interest) => (
            <button
              key={interest}
              type="button"
              className={`${styles.interestBtn} ${questionnaire.interests.includes(interest) ? styles.selected : ''}`}
              onClick={() => handleInterestsToggle(setQuestionnaire, interest)}
            >
              {t(`onboarding.interest${interest}`)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.personalitySection}>
        <h3>{t('onboarding.bigFive')}</h3>
        <p className={styles.traitDescription}>{t('onboarding.traitDescription')}</p>
        {[
          { key: 'openness', labelKey: 'onboarding.openness' },
          { key: 'conscientiousness', labelKey: 'onboarding.conscientiousness' },
          { key: 'extraversion', labelKey: 'onboarding.extraversion' },
          { key: 'agreeableness', labelKey: 'onboarding.agreeableness' },
          { key: 'neuroticism', labelKey: 'onboarding.neuroticism' },
        ].map((trait) => (
          <div key={trait.key} className={styles.traitSlider}>
            <label>{t(trait.labelKey)}</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="1"
                max="10"
                value={questionnaire[trait.key as keyof QuestionnaireState] as number}
                onChange={(e) => handleChange(setQuestionnaire, trait.key, parseInt(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.sliderValue}>
                {questionnaire[trait.key as keyof QuestionnaireState]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const initialQuestionnaire: QuestionnaireState = {
    firstName: '',
    lastName: '',
    age: '',
    role: '',
    height: '',
    build: '',
    ethnicity: '',
    education: '',
    interests: [] as string[],
    openness: 5,
    conscientiousness: 5,
    extraversion: 5,
    agreeableness: 5,
    neuroticism: 5,
  };
  const [step, setStep] = useState<'photos' | 'questionnaire1' | 'questionnaire2'>('photos');
  const [parent1Photos, setParent1Photos] = useState<File[]>([]);
  const [parent2Photos, setParent2Photos] = useState<File[]>([]);
  const [parent1Videos, setParent1Videos] = useState<File[]>([]);
  const [parent2Videos, setParent2Videos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionnaire1, setQuestionnaire1] = useState(initialQuestionnaire);
  const [questionnaire2, setQuestionnaire2] = useState(initialQuestionnaire);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!mounted || !user) {
    return null;
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, parent: 1 | 2) => {
    const files = Array.from(e.target.files || []);
    if (parent === 1) {
      setParent1Photos((prev) => [...prev, ...files]);
    } else {
      setParent2Photos((prev) => [...prev, ...files]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, parent: 1 | 2) => {
    const files = Array.from(e.target.files || []);
    if (parent === 1) {
      setParent1Videos((prev) => [...prev, ...files]);
    } else {
      setParent2Videos((prev) => [...prev, ...files]);
    }
  };

  const handleQuestionnaireChange = (
    setter: React.Dispatch<React.SetStateAction<typeof initialQuestionnaire>>,
    field: string,
    value: unknown,
  ) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestsToggle = (
    setter: React.Dispatch<React.SetStateAction<typeof initialQuestionnaire>>,
    interest: string,
  ) => {
    setter((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  async function uploadFiles(files: File[], mediaType: 'photo' | 'video', userId?: string): Promise<void> {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('mediaType', mediaType);
    if (userId) {
      formData.append('userId', userId);
    }

    const token = getAccessToken();
    const res = await fetch(`${API_URL}/profiles/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to upload files');
    }
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      // Validate questionnaires
      if (!questionnaire1.firstName || !questionnaire1.lastName || !questionnaire1.age || !questionnaire1.role) {
        setError('Please fill all required fields in your questionnaire');
        setLoading(false);
        return;
      }
      if (!questionnaire2.firstName || !questionnaire2.lastName || !questionnaire2.age || !questionnaire2.role) {
        setError('Please fill all required fields in partner questionnaire');
        setLoading(false);
        return;
      }

      const token = getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // 1. Create profile for current user (parent 1)
      const profile1Res = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          firstName: questionnaire1.firstName,
          lastName: questionnaire1.lastName,
          age: parseInt(questionnaire1.age, 10),
          role: questionnaire1.role as 'mother' | 'father',
          height: questionnaire1.height || undefined,
          build: questionnaire1.build || undefined,
          ethnicity: questionnaire1.ethnicity || undefined,
          education: questionnaire1.education || undefined,
          interests: questionnaire1.interests,
          openness: questionnaire1.openness,
          conscientiousness: questionnaire1.conscientiousness,
          extraversion: questionnaire1.extraversion,
          agreeableness: questionnaire1.agreeableness,
          neuroticism: questionnaire1.neuroticism,
        }),
      });

      if (!profile1Res.ok) {
        const data = await profile1Res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save your profile');
      }

      const profile1Data = await profile1Res.json();
      const currentUserId = profile1Data.userId;

      // 2. Upload media for current user
      await uploadFiles(parent1Photos, 'photo');
      await uploadFiles(parent1Videos, 'video');

      // 3. Create partner user and profile (parent 2)
      const partnerRes = await fetch(`${API_URL}/profiles/partner`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          firstName: questionnaire2.firstName,
          lastName: questionnaire2.lastName,
          age: parseInt(questionnaire2.age, 10),
          role: questionnaire2.role as 'mother' | 'father',
          height: questionnaire2.height || undefined,
          build: questionnaire2.build || undefined,
          ethnicity: questionnaire2.ethnicity || undefined,
          education: questionnaire2.education || undefined,
          interests: questionnaire2.interests,
          openness: questionnaire2.openness,
          conscientiousness: questionnaire2.conscientiousness,
          extraversion: questionnaire2.extraversion,
          agreeableness: questionnaire2.agreeableness,
          neuroticism: questionnaire2.neuroticism,
        }),
      });

      if (!partnerRes.ok) {
        const data = await partnerRes.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create partner profile');
      }

      const partnerData = await partnerRes.json();
      const partnerUserId = partnerData.user?.id;

      // 4. Upload media for partner
      await uploadFiles(parent2Photos, 'photo', partnerUserId);
      await uploadFiles(parent2Videos, 'video', partnerUserId);

      // 5. Create family
      const fatherId = questionnaire1.role === 'father' ? currentUserId : partnerUserId;
      const motherId = questionnaire1.role === 'mother' ? currentUserId : partnerUserId;

      const familyRes = await fetch(`${API_URL}/families`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ fatherId, motherId }),
      });

      if (!familyRes.ok) {
        const data = await familyRes.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create family');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('onboarding.errorSubmit'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.onboardingCard}>
        <header className={styles.header}>
          <h1>{t('onboarding.welcome', { name: user?.email?.split('@')[0] || 'User' })}</h1>
          <p>{t('onboarding.intro')}</p>
        </header>

        <div className={styles.steps}>
          <div className={`${styles.stepIndicator} ${step === 'photos' ? styles.active : ''}`}>
            <span>1</span> {t('onboarding.step1')}
          </div>
          <div className={`${styles.stepIndicator} ${step === 'questionnaire1' ? styles.active : ''}`}>
            <span>2</span> {t('onboarding.step2')}
          </div>
          <div className={`${styles.stepIndicator} ${step === 'questionnaire2' ? styles.active : ''}`}>
            <span>3</span> {t('onboarding.step3')}
          </div>
        </div>

        {step === 'photos' && (
          <div className={styles.stepContent}>
            <h2>{t('onboarding.uploadTitle')}</h2>
            <p className={styles.stepDescription}>
              {t('onboarding.uploadDesc')}
            </p>

            <div className={styles.uploadSection}>
              <div className={styles.parentUpload}>
                <h3>{t('onboarding.yourPhotosMother')}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, 1)}
                />
                {parent1Photos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.photosSelected', { count: String(parent1Photos.length) })}</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, 1)}
                />
                {parent1Videos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.videosSelected', { count: String(parent1Videos.length) })}</p>
                )}
              </div>

              <div className={styles.parentUpload}>
                <h3>{t('onboarding.partnerPhotosFather')}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, 2)}
                />
                {parent2Photos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.photosSelected', { count: String(parent2Photos.length) })}</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, 2)}
                />
                {parent2Videos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.videosSelected', { count: String(parent2Videos.length) })}</p>
                )}
              </div>
            </div>

            <button
              className={styles.nextBtn}
              onClick={() => setStep('questionnaire1')}
              disabled={parent1Photos.length === 0 || parent2Photos.length === 0}
            >
              {t('onboarding.continueToQuestionnaire')}
            </button>
          </div>
        )}

        {step === 'questionnaire1' && (
          <div className={styles.stepContent}>
            <h2>{t('onboarding.yourTraitsTitle')}</h2>
            <p className={styles.stepDescription}>
              {t('onboarding.yourTraitsDesc')}
            </p>
            <QuestionnaireForm
              questionnaire={questionnaire1}
              setQuestionnaire={setQuestionnaire1}
              handleChange={handleQuestionnaireChange}
              handleInterestsToggle={handleInterestsToggle}
              t={t}
            />
            {error && <p className={styles.formError}>{error}</p>}
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={() => setStep('photos')}>
                ← {t('common.back')}
              </button>
              <button className={styles.nextBtn} onClick={() => setStep('questionnaire2')}>
                {t('onboarding.continueToPartner')}
              </button>
            </div>
          </div>
        )}

        {step === 'questionnaire2' && (
          <div className={styles.stepContent}>
            <h2>{t('onboarding.partnerTraitsTitle')}</h2>
            <p className={styles.stepDescription}>
              {t('onboarding.partnerTraitsDesc')}
            </p>
            <QuestionnaireForm
              questionnaire={questionnaire2}
              setQuestionnaire={setQuestionnaire2}
              handleChange={handleQuestionnaireChange}
              handleInterestsToggle={handleInterestsToggle}
              t={t}
            />
            {error && <p className={styles.formError}>{error}</p>}
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={() => setStep('questionnaire1')}>
                ← {t('common.back')}
              </button>
              <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? t('onboarding.creating') : t('onboarding.completeSetup')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
