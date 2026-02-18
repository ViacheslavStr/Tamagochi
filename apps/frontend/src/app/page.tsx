import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Tamagochi</h1>
        <p className={styles.subtitle}>Your Electronic Child</p>
        <p className={styles.description}>
          Experience parenthood simulation: upload photos, fill out a questionnaire, and watch your AI-generated child grow, learn, and interact with you.
        </p>
        <div className={styles.cta}>
          <Link href="/register" className={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            Log In
          </Link>
        </div>
      </header>

      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Register & Upload</h3>
            <p>Create your account and upload photos/videos of both parents. Fill out a questionnaire about your traits and characteristics.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>AI Generation</h3>
            <p>Our AI creates a model of your future child — combining facial features from both parents and personality traits from your questionnaire.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Watch Them Grow</h3>
            <p>Your child lives in the app: they grow, develop, communicate, and express emotions based on their age, personality, and what you teach them.</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>Realistic Appearance</h3>
            <p>AI-generated child face combining features from both parents, with age progression over time.</p>
          </div>
          <div className={styles.feature}>
            <h3>Dynamic Personality</h3>
            <p>Your child's personality develops based on parent traits and interactions, expressed through emotions and behavior.</p>
          </div>
          <div className={styles.feature}>
            <h3>Interactive Communication</h3>
            <p>Chat with your child using AI. Their responses adapt to their age, personality, and what they've learned from you.</p>
          </div>
          <div className={styles.feature}>
            <h3>Growth & Development</h3>
            <p>Watch your child progress through different life stages, learning new words and skills as you teach them.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to start your journey?</p>
        <Link href="/register" className={styles.footerBtn}>
          Register Now
        </Link>
      </footer>
    </div>
  );
}
