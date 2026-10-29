import React, { useRef, useState } from 'react';
import {
  ForensicAuditCertificate,
  ForensicCertificateData,
} from './ForensicAuditCertificate';
import { exportCertificateElementToPdf } from '../../utils/pdfExport';
import apiClient from '../../services/api';
import {
  X,
  Download,
  Printer,
  FileCheck,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificateData: ForensicCertificateData;
}

export const CertificateExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  certificateData,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const cleanScanId = (certificateData.scan_id || 'CS889B')
        .replace(/^scan_/, '')
        .replace(/^CS-AUDIT-/, '')
        .replace(/^VTU-AUDIT-/, '')
        .slice(0, 8);
      const filename = `CertiShield_AI_Forensic_Audit_Dossier_${cleanScanId || 'EVAL'}.pdf`;

      // 1. First attempt: Stream authoritative 3-page court-admissible PDF from backend ReportLab generator
      try {
        const resp = await apiClient.post('/verify/export-pdf', certificateData, {
          responseType: 'blob',
        });
        if (resp && resp.data && resp.data.size > 500) {
          const blob = new Blob([resp.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          return;
        }
      } catch (backendErr) {
        console.warn(
          'Backend PDF export service unavailable, falling back to multi-page client-side renderer:',
          backendErr
        );
      }

      // 2. Client-side fallback: High-resolution multi-page canvas capture
      if (certificateRef.current) {
        await exportCertificateElementToPdf(certificateRef.current, {
          filename,
        });
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err: unknown) {
      console.error('PDF generation error:', err);
      alert('Unable to generate audit PDF. Please try Print Official Certificate instead.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                CertiShield AI • Forensic Audit Dossier & Verification Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Official 3-page court-admissible audit document evaluating Visvesvaraya Technological University (VTU) credential validation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling PDF Dossier...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Dossier Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Audit PDF</span>
                </>
              )}
            </button>

            {/* Print Certificate button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print</span>
            </button>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Viewer Area */}
        <div className="p-4 sm:p-8 max-h-[78vh] overflow-y-auto bg-slate-950/40 flex justify-center">
          <div ref={certificateRef} className="shadow-2xl">
            <ForensicAuditCertificate
              id="forensic-audit-certificate-print-root"
              data={certificateData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
