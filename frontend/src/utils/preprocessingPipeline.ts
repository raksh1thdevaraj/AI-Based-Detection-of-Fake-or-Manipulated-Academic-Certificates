import {
  RealtimeVerificationPipeline,
  RealtimeProgressUpdate,
  VTUForensicVerdict,
  ForensicVerificationManager,
  ForensicVerificationManagerCallbacks
} from './RealtimeVerificationPipeline';

export { RealtimeVerificationPipeline, ForensicVerificationManager };
export type { RealtimeProgressUpdate, VTUForensicVerdict, ForensicVerificationManagerCallbacks };

export interface PipelineStageConfig {
  name: string;
  fullName?: string;
  durationMs: number;
  weight: number;
  startPercent?: number;
  endPercent?: number;
  description?: string;
}

export interface PreprocessingUpdatePayload {
  percentage: number;
  stageText: string;
  remainingSeconds: string;
  elapsedSeconds?: string;
  currentStageIndex?: number;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    name: "Validating certificate & rasterizing to 300 DPI...",
    fullName: "Validating certificate & rasterizing to 300 DPI...",
    durationMs: 200,
    weight: 15,
    startPercent: 0,
    endPercent: 15,
    description: "Document validation & canvas image rasterization (Target: 300 DPI)"
  },
  {
    name: "Performing deskewing & adaptive contrast enhancement...",
    fullName: "Performing deskewing & adaptive contrast enhancement...",
    durationMs: 350,
    weight: 20,
    startPercent: 15,
    endPercent: 35,
    description: "Computer Vision preprocessing (Adaptive contrast enhancement & deskewing)"
  },
  {
    name: "Extracting VTU typography & OCR geometry...",
    fullName: "Extracting VTU typography & OCR geometry...",
    durationMs: 500,
    weight: 30,
    startPercent: 35,
    endPercent: 65,
    description: "OCR text & spatial bounding-box extraction"
  },
  {
    name: "Scanning for digital signature & seal tampering (ELA)...",
    fullName: "Scanning for digital signature & seal tampering (ELA)...",
    durationMs: 400,
    weight: 15,
    startPercent: 65,
    endPercent: 80,
    description: "Artifact analysis (Error Level Analysis - ELA & seal perimeter checks)"
  },
  {
    name: "Executing high-speed VTU forensic engine...",
    fullName: "Executing high-speed VTU forensic engine...",
    durationMs: 450,
    weight: 20,
    startPercent: 80,
    endPercent: 100,
    description: "Live model inference & structured JSON parsing"
  }
];

export const totalDurationMs = PIPELINE_STAGES.reduce((sum, s) => sum + s.durationMs, 0);

/**
 * Event-driven real-time pipeline runner without fake setInterval timers.
 * Executes actual asynchronous milestones and recalculates dynamic ETA.
 */
export function runPreprocessingPipeline(
  onUpdate: (data: PreprocessingUpdatePayload) => void,
  onComplete?: () => void,
  filePayload?: any
): () => void {
  let isCancelled = false;

  const pipeline = new RealtimeVerificationPipeline((update: RealtimeProgressUpdate) => {
    if (isCancelled) return;
    const stageIdx = pipeline.stages.findIndex((s) => s.name === update.stageText);
    onUpdate({
      percentage: update.percentage,
      stageText: update.stageText,
      remainingSeconds: update.remainingSeconds,
      elapsedSeconds: update.elapsedSeconds,
      currentStageIndex: stageIdx >= 0 ? stageIdx : (update.percentage >= 100 ? 4 : 0)
    });
  });

  pipeline.runPipeline(filePayload)
    .then(() => {
      if (!isCancelled && onComplete) {
        onComplete();
      }
    })
    .catch((err) => {
      console.warn('Real-time verification pipeline encountered warning:', err);
      if (!isCancelled && onComplete) {
        onComplete();
      }
    });

  return () => {
    isCancelled = true;
  };
}
