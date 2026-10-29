import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Clock,
  Activity,
  Layers,
  Sparkles,
  FileSearch,
  ScanLine
} from 'lucide-react';
import {
  PIPELINE_STAGES,
  runPreprocessingPipeline,
  PreprocessingUpdatePayload,
  totalDurationMs
} from '../../utils/preprocessingPipeline';

export interface PreprocessingProgressIndicatorProps {
  autoStart?: boolean;
  onComplete?: () => void;
  fileName?: string;
  filePayload?: any;
  metricThroughput?: string;
  className?: string;
  progressOverride?: PreprocessingUpdatePayload;
  controlled?: boolean;
}

const STAGE_ICONS = [
  ShieldCheck, // Stage 1: Validation
  Layers,      // Stage 2: Deskewing & Contrast
  FileSearch,  // Stage 3: OCR & USN
  ScanLine,    // Stage 4: ELA & Tamper
  Sparkles     // Stage 5: Forensic Classification
];

export const PreprocessingProgressIndicator: React.FC<PreprocessingProgressIndicatorProps> = ({
  autoStart = true,
  onComplete,
  fileName,
  filePayload,
  metricThroughput = 'DPI: 300 | Processing at 60 FPS',
  className = '',
  progressOverride,
  controlled = false
}) => {
  const [pipelineState, setPipelineState] = useState<PreprocessingUpdatePayload>(
    progressOverride || {
      percentage: 0,
      stageText: PIPELINE_STAGES[0].name,
      remainingSeconds: (totalDurationMs / 1000).toFixed(1),
      elapsedSeconds: '0.0',
      currentStageIndex: 0
    }
  );

  const [isFinished, setIsFinished] = useState<boolean>(
    Boolean(progressOverride && progressOverride.percentage >= 100)
  );

  useEffect(() => {
    if (controlled && progressOverride) {
      setPipelineState(progressOverride);
      if (progressOverride.percentage >= 100) {
        setIsFinished(true);
      }
    }
  }, [controlled, progressOverride]);

  useEffect(() => {
    if (!autoStart || controlled) return;

    const cancel = runPreprocessingPipeline(
      (update) => {
        setPipelineState(update);
        if (update.percentage >= 100) {
          setIsFinished(true);
        }
      },
      () => {
        setIsFinished(true);
        if (onComplete) {
          onComplete();
        }
      },
      filePayload
    );

    return () => {
      cancel();
    };
  }, [autoStart, controlled, onComplete, filePayload]);

  const activeIndex = pipelineState.currentStageIndex ?? 0;

  return (
    <div
      data-testid="preprocessing-progress-indicator"
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-6 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title & Metric Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              {!isFinished && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isFinished ? 'bg-emerald-500' : 'bg-emerald-400'
                }`}
              />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Preprocessing & Forensic Ingestion</span>
              {fileName && (
                <span className="text-xs font-mono text-slate-400 font-normal px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 truncate max-w-[200px]">
                  {fileName}
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time optical normalization, geometry rectification & digital tamper analysis
          </p>
        </div>

        {/* 4. Metric Badge: Preprocessing Throughput */}
        <div
          data-testid="metric-badge"
          className="inline-flex items-center space-x-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-inner font-semibold"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{metricThroughput}</span>
        </div>
      </div>

      {/* 1. Animated Progress Bar & Percentage */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="text-slate-400">Pipeline Execution:</span>
            <span className="text-emerald-400 font-bold">
              Stage {activeIndex + 1} of {PIPELINE_STAGES.length}
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5 font-bold">
            <span
              data-testid="progress-percentage"
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400"
            >
              {pipelineState.percentage}%
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="relative w-full bg-slate-950/80 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden shadow-inner">
          <div
            role="progressbar"
            aria-valuenow={pipelineState.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            data-testid="animated-progress-bar"
            className="progress-fill h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-500/30 relative overflow-hidden"
            style={{ width: `${Math.min(100, Math.max(0, pipelineState.percentage))}%` }}
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite] w-full" />
          </div>
        </div>
      </div>

      {/* 2. Active Stage Status Text & 3. Live ETA Counter */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
        {/* Active Stage Status Text */}
        <div className="md:col-span-8 flex items-center space-x-3 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20">
            {isFinished ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Active Background Task
            </span>
            <p
              data-testid="active-stage-status-text"
              className="text-xs sm:text-sm font-semibold text-slate-200 truncate"
              title={pipelineState.stageText}
            >
              {pipelineState.stageText}
            </p>
          </div>
        </div>

        {/* 3. Live ETA Counter */}
        <div className="md:col-span-4 flex items-center justify-start md:justify-end space-x-2 text-xs font-mono text-slate-300 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span data-testid="live-eta-counter" className="text-slate-300">
            Estimated time remaining:{' '}
            <strong className="text-cyan-400 font-bold">{pipelineState.remainingSeconds}s</strong>
            {pipelineState.elapsedSeconds && (
              <span className="text-[10px] text-slate-400 ml-1.5 hidden sm:inline">
                ({pipelineState.elapsedSeconds}s elapsed)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 5-Stage Stepper Pipeline Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = STAGE_ICONS[idx] || ShieldCheck;
          const isDone = idx < activeIndex || isFinished;
          const isCurrent = idx === activeIndex && !isFinished;

          return (
            <div
              key={stage.name}
              data-testid={`stage-step-${idx}`}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-slate-200 shadow-sm'
                  : isCurrent
                  ? 'bg-slate-800/90 border-emerald-400/80 shadow-lg shadow-emerald-950/40 text-slate-100 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  0{idx + 1}
                </span>
                <div
                  className={`p-1.5 rounded-lg ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold line-clamp-1 leading-tight text-slate-200">
                  {stage.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400">
                  <span>~{stage.durationMs}ms</span>
                  <span className="text-emerald-400 font-semibold">{stage.weight}% wt</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
