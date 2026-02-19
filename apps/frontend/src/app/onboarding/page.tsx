'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './onboarding.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300';

type QuestionnaireState = {
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

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      // TODO: Upload photos/videos and submit questionnaire
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch {
      setError(t('onboarding.errorSubmit'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.onboardingCard}>
        <header className={styles.header}>
          <h1>{t('onboarding.welcome', { name: user?.firstName ?? '' })}</h1>
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
                <h3>{user?.role === 'mother' ? t('onboarding.yourPhotosMother') : t('onboarding.partnerPhotosMother')}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, user?.role === 'mother' ? 1 : 1)}
                />
                {parent1Photos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.photosSelected', { count: String(parent1Photos.length) })}</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, user?.role === 'mother' ? 1 : 1)}
                />
                {parent1Videos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.videosSelected', { count: String(parent1Videos.length) })}</p>
                )}
              </div>

              <div className={styles.parentUpload}>
                <h3>{user?.role === 'father' ? t('onboarding.yourPhotosFather') : t('onboarding.partnerPhotosFather')}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, user?.role === 'father' ? 2 : 2)}
                />
                {parent2Photos.length > 0 && (
                  <p className={styles.fileCount}>{t('onboarding.photosSelected', { count: String(parent2Photos.length) })}</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, user?.role === 'father' ? 2 : 2)}
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
