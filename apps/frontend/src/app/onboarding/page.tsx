'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
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

function QuestionnaireForm({
  questionnaire,
  setQuestionnaire,
  handleChange,
  handleInterestsToggle,
}: {
  questionnaire: QuestionnaireState;
  setQuestionnaire: React.Dispatch<React.SetStateAction<QuestionnaireState>>;
  handleChange: (setter: React.Dispatch<React.SetStateAction<QuestionnaireState>>, field: string, value: unknown) => void;
  handleInterestsToggle: (setter: React.Dispatch<React.SetStateAction<QuestionnaireState>>, interest: string) => void;
}) {
  return (
    <div className={styles.questionnaireForm}>
      <div className={styles.fieldGroup}>
        <label htmlFor="height">Height (optional)</label>
        <input
          id="height"
          type="text"
          value={questionnaire.height}
          onChange={(e) => handleChange(setQuestionnaire, 'height', e.target.value)}
          placeholder="e.g., 175 cm"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="build">Build (optional)</label>
        <select
          id="build"
          value={questionnaire.build}
          onChange={(e) => handleChange(setQuestionnaire, 'build', e.target.value)}
        >
          <option value="">Select...</option>
          <option value="slim">Slim</option>
          <option value="average">Average</option>
          <option value="athletic">Athletic</option>
          <option value="stocky">Stocky</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="ethnicity">Ethnicity (optional)</label>
        <input
          id="ethnicity"
          type="text"
          value={questionnaire.ethnicity}
          onChange={(e) => handleChange(setQuestionnaire, 'ethnicity', e.target.value)}
          placeholder="e.g., European, Asian, etc."
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="education">Education Level (optional)</label>
        <select
          id="education"
          value={questionnaire.education}
          onChange={(e) => handleChange(setQuestionnaire, 'education', e.target.value)}
        >
          <option value="">Select...</option>
          <option value="high-school">High School</option>
          <option value="bachelor">Bachelor&apos;s Degree</option>
          <option value="master">Master&apos;s Degree</option>
          <option value="phd">PhD</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label>Interests (select multiple)</label>
        <div className={styles.interestsGrid}>
          {['Music', 'Sports', 'Reading', 'Art', 'Science', 'Technology', 'Travel', 'Cooking', 'Gaming', 'Nature'].map(
            (interest) => (
              <button
                key={interest}
                type="button"
                className={`${styles.interestBtn} ${questionnaire.interests.includes(interest) ? styles.selected : ''}`}
                onClick={() => handleInterestsToggle(setQuestionnaire, interest)}
              >
                {interest}
              </button>
            ),
          )}
        </div>
      </div>
      <div className={styles.personalitySection}>
        <h3>Big Five Personality Traits</h3>
        <p className={styles.traitDescription}>Rate 1–10 for this parent</p>
        {[
          { key: 'openness', label: 'Openness to Experience' },
          { key: 'conscientiousness', label: 'Conscientiousness' },
          { key: 'extraversion', label: 'Extraversion' },
          { key: 'agreeableness', label: 'Agreeableness' },
          { key: 'neuroticism', label: 'Neuroticism' },
        ].map((trait) => (
          <div key={trait.key} className={styles.traitSlider}>
            <label>{trait.label}</label>
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
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.onboardingCard}>
        <header className={styles.header}>
          <h1>Welcome, {user?.firstName}!</h1>
          <p>Let's create your electronic child. We need a few things from you.</p>
        </header>

        <div className={styles.steps}>
          <div className={`${styles.stepIndicator} ${step === 'photos' ? styles.active : ''}`}>
            <span>1</span> Photos & Videos
          </div>
          <div className={`${styles.stepIndicator} ${step === 'questionnaire1' ? styles.active : ''}`}>
            <span>2</span> Your Questionnaire
          </div>
          <div className={`${styles.stepIndicator} ${step === 'questionnaire2' ? styles.active : ''}`}>
            <span>3</span> Partner&apos;s Questionnaire
          </div>
        </div>

        {step === 'photos' && (
          <div className={styles.stepContent}>
            <h2>Upload Photos & Videos</h2>
            <p className={styles.stepDescription}>
              Upload several photos (and optionally videos) of both parents. This helps AI generate your child's appearance.
            </p>

            <div className={styles.uploadSection}>
              <div className={styles.parentUpload}>
                <h3>{user?.role === 'mother' ? 'Your Photos (Mother)' : 'Partner Photos (Mother)'}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, user?.role === 'mother' ? 1 : 1)}
                />
                {parent1Photos.length > 0 && (
                  <p className={styles.fileCount}>{parent1Photos.length} photo(s) selected</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, user?.role === 'mother' ? 1 : 1)}
                />
                {parent1Videos.length > 0 && (
                  <p className={styles.fileCount}>{parent1Videos.length} video(s) selected</p>
                )}
              </div>

              <div className={styles.parentUpload}>
                <h3>{user?.role === 'father' ? 'Your Photos (Father)' : 'Partner Photos (Father)'}</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, user?.role === 'father' ? 2 : 2)}
                />
                {parent2Photos.length > 0 && (
                  <p className={styles.fileCount}>{parent2Photos.length} photo(s) selected</p>
                )}
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e, user?.role === 'father' ? 2 : 2)}
                />
                {parent2Videos.length > 0 && (
                  <p className={styles.fileCount}>{parent2Videos.length} video(s) selected</p>
                )}
              </div>
            </div>

            <button
              className={styles.nextBtn}
              onClick={() => setStep('questionnaire1')}
              disabled={parent1Photos.length === 0 || parent2Photos.length === 0}
            >
              Continue to Your Questionnaire →
            </button>
          </div>
        )}

        {step === 'questionnaire1' && (
          <div className={styles.stepContent}>
            <h2>Your Personality & Traits</h2>
            <p className={styles.stepDescription}>
              Tell us about yourself (parent 1). This helps determine your child&apos;s base personality.
            </p>
            <QuestionnaireForm
              questionnaire={questionnaire1}
              setQuestionnaire={setQuestionnaire1}
              handleChange={handleQuestionnaireChange}
              handleInterestsToggle={handleInterestsToggle}
            />
            {error && <p className={styles.formError}>{error}</p>}
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={() => setStep('photos')}>
                ← Back
              </button>
              <button className={styles.nextBtn} onClick={() => setStep('questionnaire2')}>
                Continue to Partner&apos;s Questionnaire →
              </button>
            </div>
          </div>
        )}

        {step === 'questionnaire2' && (
          <div className={styles.stepContent}>
            <h2>Partner&apos;s Personality & Traits</h2>
            <p className={styles.stepDescription}>
              Tell us about the second parent (partner, friend, or celebrity). Use defaults if you prefer.
            </p>
            <QuestionnaireForm
              questionnaire={questionnaire2}
              setQuestionnaire={setQuestionnaire2}
              handleChange={handleQuestionnaireChange}
              handleInterestsToggle={handleInterestsToggle}
            />
            {error && <p className={styles.formError}>{error}</p>}
            <div className={styles.actions}>
              <button className={styles.backBtn} onClick={() => setStep('questionnaire1')}>
                ← Back
              </button>
              <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
