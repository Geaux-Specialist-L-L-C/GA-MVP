import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBolt, FaChalkboardTeacher, FaCompass, FaGraduationCap, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { motion as m, useReducedMotion } from 'framer-motion';
import { pageTransitions, itemVariants } from '../utils/animations';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FaqItem {
  question: string;
  answer: string;
}

const featureCards: FeatureCard[] = [
  {
    title: 'Adaptive Learning Plans',
    description: 'AI-tailored learning paths that adjust as students grow.',
    icon: <FaCompass />
  },
  {
    title: 'Real-Time Progress',
    description: 'Visual dashboards for mastery, confidence, and momentum.',
    icon: <FaBolt />
  },
  {
    title: 'Expert-Led Support',
    description: 'Guidance from educators who champion every learner.',
    icon: <FaChalkboardTeacher />
  },
  {
    title: 'Future-Ready Skills',
    description: 'Project-based learning that prepares students for tomorrow.',
    icon: <FaLightbulb />
  }
];

const steps: StepCard[] = [
  {
    title: 'Take the Assessment',
    description: 'Identify learning preferences in minutes with guided prompts.',
    icon: <FaGraduationCap />
  },
  {
    title: 'Get a Personalized Plan',
    description: 'Receive a dynamic learning blueprint built around strengths.',
    icon: <FaCompass />
  },
  {
    title: 'Learn with Confidence',
    description: 'Engage with lessons that feel intuitive and motivating.',
    icon: <FaLightbulb />
  },
  {
    title: 'Track & Celebrate Wins',
    description: 'See progress milestones and celebrate every achievement.',
    icon: <FaBolt />
  }
];

const testimonials = [
  {
    name: 'Ava T.',
    role: 'Student, Grade 8',
    quote: 'I finally understand how I learn best. Everything feels clearer and more fun.'
  },
  {
    name: 'Mr. Cole',
    role: 'Educator',
    quote: 'Geaux Academy helps me meet learners exactly where they are.'
  },
  {
    name: 'Jasmine R.',
    role: 'Parent',
    quote: 'The insights and progress tracking are a game-changer for our family.'
  }
];

const faqs: FaqItem[] = [
  {
    question: 'Is Geaux Academy suitable for every learning style?',
    answer: 'Yes. Our assessment identifies preferences and adapts content across visual, auditory, reading/writing, and kinesthetic styles.'
  },
  {
    question: 'How long does the assessment take?',
    answer: 'Most learners complete it in under 10 minutes. Results are available instantly.'
  },
  {
    question: 'Can parents and educators track progress?',
    answer: 'Absolutely. Dashboards are built for families and teachers to see growth and celebrate milestones.'
  },
  {
    question: 'Is there support for struggling students?',
    answer: 'Yes. We highlight support strategies and provide guided interventions when learners need more help.'
  },
  {
    question: 'Does the platform work on mobile?',
    answer: 'Geaux Academy is optimized for mobile-first learning across devices.'
  }
];

const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: pageTransitions
      };

  const handleToggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  return (
    <Page as={m.div} {...motionProps}>
      <Hero>
        <HeroContent>
          <HeroBadge>Futuristic Learning Lab</HeroBadge>
          <h1>Personalized learning that feels effortless.</h1>
          <p>
            Geaux Academy brings together adaptive learning, real-time feedback, and
            human-friendly guidance so every learner thrives.
          </p>
          <HeroActions>
            <Link className="btn btn-primary" to="/login">Take Assessment</Link>
            <Link className="btn btn-secondary" to="/learning-styles">Explore Learning Styles</Link>
          </HeroActions>
          <HeroHighlights>
            <HighlightCard className="glass-card">
              <FaShieldAlt />
              <div>
                <h4>Safe &amp; Guided</h4>
                <span>Privacy-first learning journeys for every family.</span>
              </div>
            </HighlightCard>
            <HighlightCard className="glass-card">
              <FaBolt />
              <div>
                <h4>Real-Time Insights</h4>
                <span>See progress, engagement, and confidence in one view.</span>
              </div>
            </HighlightCard>
          </HeroHighlights>
        </HeroContent>
        <HeroVisual className="glass-card" aria-hidden="true">
          <VisualGrid>
            <VisualTile className="accent">Assessment</VisualTile>
            <VisualTile>Learning Plan</VisualTile>
            <VisualTile>Feedback Loop</VisualTile>
            <VisualTile className="accent">Progress</VisualTile>
          </VisualGrid>
          <VisualGlow />
        </HeroVisual>
      </Hero>

      <Section as={m.section} variants={reduceMotion ? undefined : itemVariants}>
        <SectionHeader>
          <h2>How it works</h2>
          <p>Each step is crafted to reduce friction and elevate learner confidence.</p>
        </SectionHeader>
        <CardGrid>
          {steps.map((step, index) => (
            <InfoCard
              className="glass-card"
              key={step.title}
              as={m.div}
              variants={reduceMotion ? undefined : itemVariants}
              whileHover={reduceMotion ? undefined : 'hover'}
            >
              <span className="badge">Step {index + 1}</span>
              <div className="icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </InfoCard>
          ))}
        </CardGrid>
      </Section>

      <Section as={m.section} variants={reduceMotion ? undefined : itemVariants}>
        <SectionHeader>
          <h2>Features designed for growth</h2>
          <p>Modern tools and a warm learning vibe to support every pathway.</p>
        </SectionHeader>
        <CardGrid>
          {featureCards.map((feature) => (
            <FeatureCardStyled
              className="glass-card"
              key={feature.title}
              as={m.div}
              variants={reduceMotion ? undefined : itemVariants}
              whileHover={reduceMotion ? undefined : 'hover'}
            >
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCardStyled>
          ))}
        </CardGrid>
      </Section>

      <Section as={m.section} variants={reduceMotion ? undefined : itemVariants}>
        <SectionHeader>
          <h2>Trusted by learners, loved by families</h2>
          <p>Real stories from our community of curious, motivated learners.</p>
        </SectionHeader>
        <TestimonialGrid>
          {testimonials.map((testimonial) => (
            <TestimonialCard
              className="glass-card"
              key={testimonial.name}
              as={m.div}
              variants={reduceMotion ? undefined : itemVariants}
              whileHover={reduceMotion ? undefined : 'hover'}
            >
              <p>“{testimonial.quote}”</p>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </TestimonialCard>
          ))}
        </TestimonialGrid>
      </Section>

      <Section as={m.section} variants={reduceMotion ? undefined : itemVariants}>
        <SectionHeader>
          <h2>Frequently asked questions</h2>
          <p>Everything you need to feel confident starting with Geaux Academy.</p>
        </SectionHeader>
        <FaqList>
          {faqs.map((faq, index) => (
            <FaqItemRow key={faq.question}>
              <FaqButton
                type="button"
                onClick={() => handleToggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <span className="indicator">{openFaq === index ? '–' : '+'}</span>
              </FaqButton>
              {openFaq === index && <FaqAnswer>{faq.answer}</FaqAnswer>}
            </FaqItemRow>
          ))}
        </FaqList>
      </Section>

      <FinalCta>
        <div>
          <h2>Ready to spark a love of learning?</h2>
          <p>Start with a quick assessment and let us build the rest.</p>
        </div>
        <Link className="btn btn-primary" to="/login">Take Assessment</Link>
      </FinalCta>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  align-items: center;
  padding: 3.5rem 0 1rem;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1 {
    font-size: clamp(2.4rem, 3vw, 3.6rem);
    line-height: 1.1;
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const HeroBadge = styled.span`
  align-self: flex-start;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(225, 179, 84, 0.15);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.8rem;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeroHighlights = styled.div`
  display: grid;
  gap: 1rem;
`;

const HighlightCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;

  svg {
    font-size: 1.5rem;
    color: var(--accent-color);
  }

  h4 {
    margin-bottom: 0.25rem;
  }

  span {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  padding: 2.5rem;
  min-height: 280px;
  overflow: hidden;
`;

const VisualGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 1rem;
  position: relative;
  z-index: 1;
`;

const VisualTile = styled.div`
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.65);
  font-weight: 600;
  color: var(--text-primary);

  &.accent {
    background: rgba(70, 84, 246, 0.15);
  }

  :root[data-theme='dark'] & {
    background: rgba(18, 26, 47, 0.8);
  }
`;

const VisualGlow = styled.div`
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(70, 84, 246, 0.3);
  filter: blur(40px);
  top: -40px;
  right: -40px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  max-width: 720px;

  h2 {
    font-size: clamp(1.8rem, 2.5vw, 2.6rem);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
  }
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const InfoCard = styled.div`
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem;

  .icon {
    font-size: 1.6rem;
    color: var(--accent-color);
  }

  p {
    color: var(--text-secondary);
  }
`;

const FeatureCardStyled = styled(InfoCard)`
  .icon {
    font-size: 1.8rem;
    color: var(--primary-color);
  }
`;

const TestimonialGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const TestimonialCard = styled.div`
  padding: 1.5rem;
  display: grid;
  gap: 0.75rem;

  p {
    color: var(--text-secondary);
  }

  strong {
    font-size: 1rem;
  }

  span {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
`;

const FaqList = styled.div`
  display: grid;
  gap: 1rem;
`;

const FaqItemRow = styled.div`
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.65);

  :root[data-theme='dark'] & {
    background: rgba(18, 26, 47, 0.7);
  }
`;

const FaqButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: inherit;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  cursor: pointer;

  .indicator {
    font-size: 1.4rem;
    color: var(--accent-color);
  }
`;

const FaqAnswer = styled.div`
  padding: 0 1.25rem 1rem;
  color: var(--text-secondary);
`;

const FinalCta = styled.section`
  background: rgba(70, 84, 246, 0.15);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
  }
`;

export default memo(Home);
