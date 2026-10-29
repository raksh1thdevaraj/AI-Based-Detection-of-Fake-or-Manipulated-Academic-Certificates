import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero3DCanvas, renderVTUCertificateCanvas } from '../components/landing/Hero3DCanvas';
import { PreprocessingProgressIndicator } from '../components/progress/PreprocessingProgressIndicator';
import {
  PIPELINE_STAGES,
} from '../utils/preprocessingPipeline';
import {
  RealtimeVerificationPipeline,
  VTU_USN_REGEX,
  ForensicVerificationManager,
} from '../utils/RealtimeVerificationPipeline';

describe('1. Landing Page: 3D Certificate Render & Metadata Update (VTU Specification)', () => {
  it('renders Hero3DCanvas fallback with updated VTU metadata (RAKSHITH DEVARAJ, 1RE22CS089, Controller of Examinations)', () => {
    render(<Hero3DCanvas />);

    // Check Institution Title & Sub-header
    expect(screen.getByText(/Visvesvaraya Technological University/i)).toBeInTheDocument();
    expect(screen.getByText(/Jnana Sangama, Belagavi, Karnataka - 590018/i)).toBeInTheDocument();

    // Check VTU emblem placeholder
    expect(screen.getByText('VTU')).toBeInTheDocument();

    // Check University Seat Number (USN) field
    expect(screen.getByText(/University Seat Number \(USN\)/i)).toBeInTheDocument();
    expect(screen.getByText('1RE22CS089')).toBeInTheDocument();

    // Check Candidate Name
    expect(screen.getByText('RAKSHITH DEVARAJ')).toBeInTheDocument();

    // Check Degree & Branch
    expect(screen.getByText(/Bachelor of Engineering in Computer Science and Engineering/i)).toBeInTheDocument();

    // Check holographic security seal & Controller of Examinations digital stamp
    expect(screen.getByText(/Holographic Security Seal/i)).toBeInTheDocument();
    expect(screen.getByText(/Controller of Examinations Digital Stamp/i)).toBeInTheDocument();
  });

  it('draws updated VTU credentials onto canvas texture context', () => {
    const filledTexts: string[] = [];

    const mockCtx = {
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillText: vi.fn((text: string) => filledTexts.push(text)),
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      textAlign: '',
      globalAlpha: 1,
    };

    renderVTUCertificateCanvas(mockCtx as any);

    // Verify drawing calls
    expect(filledTexts).toContain('VISVESVARAYA TECHNOLOGICAL UNIVERSITY');
    expect(filledTexts).toContain('Jnana Sangama, Belagavi, Karnataka - 590018');
    expect(filledTexts).toContain('1RE22CS089');
    expect(filledTexts).toContain('RAKSHITH DEVARAJ');
    expect(filledTexts).toContain('IN COMPUTER SCIENCE AND ENGINEERING');
    expect(filledTexts).toContain('CONTROLLER OF EXAMINATIONS');
  });
});

describe('2. Real-Time Synchronized Loading & Dynamic ETA Pipeline', () => {
  it('configures the 5 discrete asynchronous tasks with weights totaling 100', () => {
    expect(PIPELINE_STAGES).toHaveLength(5);

    expect(PIPELINE_STAGES[0].weight).toBe(15);
    expect(PIPELINE_STAGES[0].name).toContain('300 DPI');

    expect(PIPELINE_STAGES[1].weight).toBe(20);
    expect(PIPELINE_STAGES[1].name).toContain('deskewing');

    expect(PIPELINE_STAGES[2].weight).toBe(30);
    expect(PIPELINE_STAGES[2].name).toContain('typography');

    expect(PIPELINE_STAGES[3].weight).toBe(15);
    expect(PIPELINE_STAGES[3].name).toContain('digital signature');

    expect(PIPELINE_STAGES[4].weight).toBe(20);
    expect(PIPELINE_STAGES[4].name).toContain('VTU forensic engine');

    const totalWeight = PIPELINE_STAGES.reduce((sum, s) => sum + s.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('validates USN pattern against VTU specification ^[1-4][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$', () => {
    expect(VTU_USN_REGEX.test('1RE22CS089')).toBe(true);
    expect(VTU_USN_REGEX.test('1MS21CS089')).toBe(true);
    expect(VTU_USN_REGEX.test('2BA20EC045')).toBe(true);
    expect(VTU_USN_REGEX.test('INVALID_USN')).toBe(false);
    expect(VTU_USN_REGEX.test('9ZZ99ZZ999')).toBe(false);
  });

  it('executes RealtimeVerificationPipeline through all 5 stages and computes dynamic ETA', async () => {
    const progressUpdates: any[] = [];
    const pipeline = new RealtimeVerificationPipeline((update) => {
      progressUpdates.push(update);
    });

    const verdict = await pipeline.runPipeline({ test: true });

    // Completed weight should be 100
    expect(pipeline.completedWeight).toBe(100);

    // Progress updates should contain initial milestone and final completion
    expect(progressUpdates.length).toBeGreaterThanOrEqual(5);

    const firstUpdate = progressUpdates[0];
    expect(firstUpdate.percentage).toBe(0);
    expect(firstUpdate.stageText).toContain('300 DPI');

    const finalUpdate = progressUpdates[progressUpdates.length - 1];
    expect(finalUpdate.percentage).toBe(100);
    expect(finalUpdate.remainingSeconds).toBe('0.0');
    expect(parseFloat(finalUpdate.elapsedSeconds)).toBeGreaterThanOrEqual(0);

    // Verdict matches raw zero-shot forensic engine schema
    expect(verdict.institution_verified).toBe(true);
    expect(verdict.candidate_name).toBe('RAKSHITH DEVARAJ');
    expect(verdict.usn).toBe('1RE22CS089');
    expect(verdict.status).toBe('AUTHENTIC');
    expect(verdict.confidence_score).toBeGreaterThan(0.9);
    expect(verdict.recommendation).toBe('APPROVE');
    expect(Array.isArray(verdict.tampering_flags)).toBe(true);
  });

  it('calculates dynamic ETA correctly based on elapsed time and completed weight formula', () => {
    const mockOnProgress = vi.fn();
    const pipeline = new RealtimeVerificationPipeline(mockOnProgress);

    // Simulate pipeline start at t = 1000
    pipeline.startTime = 1000;
    vi.spyOn(performance, 'now').mockReturnValue(1600); // 600ms elapsed

    // Completed weight = 35% (Stage 1 + Stage 2 done)
    pipeline.completedWeight = 35;
    pipeline.updateMetrics(2);

    expect(mockOnProgress).toHaveBeenCalled();
    const callArg = mockOnProgress.mock.calls[0][0];

    // Elapsed time = 600ms
    // Estimated total = (600 / 35) * 100 = 1714.28ms
    // Remaining = 1714.28 - 600 = 1114.28ms = ~1.1s
    expect(callArg.percentage).toBe(35);
    expect(callArg.remainingSeconds).toBe('1.1');
    expect(callArg.elapsedSeconds).toBe('0.6');
    expect(callArg.stageText).toBe(pipeline.stages[2].name);

    vi.restoreAllMocks();
  });

  it('renders all 4 required UI elements in PreprocessingProgressIndicator component', () => {
    render(
      <PreprocessingProgressIndicator
        autoStart={false}
        fileName="vtu_degree_test.pdf"
        metricThroughput="DPI: 300 | Processing at 60 FPS"
      />
    );

    // 1. Animated Progress Bar
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');

    // 2. Active Stage Status Text
    const activeStageText = screen.getByTestId('active-stage-status-text');
    expect(activeStageText).toBeInTheDocument();
    expect(activeStageText.textContent).toContain('Validating certificate & rasterizing to 300 DPI');

    // 3. Live ETA Counter
    const etaCounter = screen.getByTestId('live-eta-counter');
    expect(etaCounter).toBeInTheDocument();
    expect(etaCounter.textContent).toContain('Estimated time remaining:');

    // 4. Metric Badge
    const metricBadge = screen.getByTestId('metric-badge');
    expect(metricBadge).toBeInTheDocument();
    expect(metricBadge.textContent).toContain('DPI: 300 | Processing at 60 FPS');

    // Filename badge
    expect(screen.getByText('vtu_degree_test.pdf')).toBeInTheDocument();

    // 5 Stages stepper cards
    expect(screen.getByTestId('stage-step-0')).toBeInTheDocument();
    expect(screen.getByTestId('stage-step-1')).toBeInTheDocument();
    expect(screen.getByTestId('stage-step-2')).toBeInTheDocument();
    expect(screen.getByTestId('stage-step-3')).toBeInTheDocument();
    expect(screen.getByTestId('stage-step-4')).toBeInTheDocument();
  });

  it('automatically runs real-time pipeline to 100% and invokes onComplete', async () => {
    const onComplete = vi.fn();

    render(
      <PreprocessingProgressIndicator
        autoStart={true}
        onComplete={onComplete}
      />
    );

    // Wait for the async tasks to complete
    await vi.waitFor(
      () => {
        expect(screen.getByTestId('progress-percentage').textContent).toBe('100%');
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('live-eta-counter').textContent).toContain('Estimated time remaining: 0.0s');
    expect(onComplete).toHaveBeenCalled();
  });

  it('renders PreprocessingProgressIndicator in controlled mode with progressOverride and progress-fill', () => {
    render(
      <PreprocessingProgressIndicator
        autoStart={false}
        controlled={true}
        progressOverride={{
          percentage: 92,
          stageText: 'Synthesizing forensic verdict...',
          remainingSeconds: '0.2',
          elapsedSeconds: '1.2',
          currentStageIndex: 3
        }}
      />
    );

    const progressBar = screen.getByTestId('animated-progress-bar');
    expect(progressBar).toHaveClass('progress-fill');
    expect(screen.getByTestId('progress-percentage').textContent).toBe('92%');
    expect(screen.getByTestId('active-stage-status-text').textContent).toBe('Synthesizing forensic verdict...');
    expect(screen.getByTestId('live-eta-counter').textContent).toContain('0.2s');
  });

  it('executes ForensicVerificationManager through all 5 stages with asymptotic 92% cap and requestAnimationFrame handoff', async () => {
    const progressHistory: { percent: number; stage: string; eta: string }[] = [];
    const prepopulatedReports: any[] = [];
    const displayReportImmediate = vi.fn();

    const manager = new ForensicVerificationManager({
      onProgress: (p) => progressHistory.push(p),
      prepopulateReport: (r) => prepopulatedReports.push(r),
      displayReportImmediate,
    });

    const mockPayload = { name: 'vtu_marks_card.png' };
    const verdict = await manager.executeVerification(mockPayload, async () => {
      // While custom inference is in-flight, check that progress is capped at 92%
      const latestProgress = progressHistory[progressHistory.length - 1];
      expect(latestProgress.percent).toBe(92);
      expect(latestProgress.stage).toBe('Synthesizing forensic verdict...');
      return {
        institution_verified: true,
        candidate: 'RAKSHITH DEVARAJ',
        usn: '1RE22CS089',
        status: 'AUTHENTIC',
        confidence: 0.99,
        flags: [],
        recommendation: 'APPROVE',
      };
    });

    // Verify Stage 1 to 4 milestones
    expect(progressHistory.some((p) => p.percent === 15)).toBe(true);
    expect(progressHistory.some((p) => p.percent === 45)).toBe(true);
    expect(progressHistory.some((p) => p.percent === 70)).toBe(true);
    expect(progressHistory.some((p) => p.percent === 92)).toBe(true);

    // Pre-mount/populate report occurs BEFORE 100% and before transition
    expect(prepopulatedReports.length).toBe(1);
    expect(prepopulatedReports[0].candidate).toBe('RAKSHITH DEVARAJ');

    // Final completion hits 100%
    const finalProgress = progressHistory[progressHistory.length - 1];
    expect(finalProgress.percent).toBe(100);
    expect(finalProgress.stage).toBe('Report Generated!');

    // Transition triggered without artificial delay in the next frame
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(displayReportImmediate).toHaveBeenCalled();
    expect(verdict.status).toBe('AUTHENTIC');
  });
});

