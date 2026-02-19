'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/LocaleContext';
import styles from './home.module.css';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.homePage}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{t('home.title')}</h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>
        <p className={styles.description}>{t('home.description')}</p>
        <div className={styles.cta}>
          <Link href="/register" className={styles.primaryBtn}>
            {t('common.getStarted')}
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            {t('common.logIn')}
          </Link>
        </div>
      </header>

      <section className={styles.howItWorks}>
        <h2>{t('home.howItWorks')}</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>{t('home.step1Title')}</h3>
            <p>{t('home.step1Text')}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>{t('home.step2Title')}</h3>
            <p>{t('home.step2Text')}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>{t('home.step3Title')}</h3>
            <p>{t('home.step3Text')}</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>{t('home.features')}</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>{t('home.feature1Title')}</h3>
            <p>{t('home.feature1Text')}</p>
          </div>
          <div className={styles.feature}>
            <h3>{t('home.feature2Title')}</h3>
            <p>{t('home.feature2Text')}</p>
          </div>
          <div className={styles.feature}>
            <h3>{t('home.feature3Title')}</h3>
            <p>{t('home.feature3Text')}</p>
          </div>
          <div className={styles.feature}>
            <h3>{t('home.feature4Title')}</h3>
            <p>{t('home.feature4Text')}</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>{t('home.footerText')}</p>
        <Link href="/register" className={styles.footerBtn}>
          {t('home.registerNow')}
        </Link>
      </footer>
    </div>
  );
}
