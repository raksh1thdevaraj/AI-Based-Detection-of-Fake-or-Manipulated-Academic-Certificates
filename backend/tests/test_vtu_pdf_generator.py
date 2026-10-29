import io
import sys
from pathlib import Path
from pypdf import PdfReader

# Add backend directory to sys.path
backend_path = Path("backend").resolve()
sys.path.insert(0, str(backend_path))

from app.services.pdf_certificate_generator import ForensicCertificateGenerator

test_cases = [
    {
        "candidate_name": "RAKSHITH DEVARAJ",
        "usn": "1RE22CS089",
        "institution": "Visvesvaraya Technological University",
        "degree": "Bachelor of Engineering (Computer Science & Engineering)",
        "status": "FRAUDULENT",
        "confidence_score": 0.984,
        "scan_id": "VTU90412",
    },
    {
        "candidate_name": "RAKSHITH DEVARAJ",
        "usn": "1RE22CS089",
        "institution": "Visvesvaraya Technological University",
        "degree": "Bachelor of Engineering (Computer Science & Engineering)",
        "status": "AUTHENTIC",
        "confidence_score": 0.992,
        "scan_id": "VTU10488",
    },
    {
        "candidate_name": "RAKSHITH DEVARAJ",
        "usn": "1RE22CS089",
        "institution": "Visvesvaraya Technological University",
        "degree": "Bachelor of Engineering (Computer Science & Engineering)",
        "status": "SUSPICIOUS",
        "confidence_score": 0.745,
        "scan_id": "VTU55319",
    },
]

for tc in test_cases:
    pdf_bytes = ForensicCertificateGenerator.generate(tc)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    print(f"Verdict [{tc['status']}]: Generated {len(pdf_bytes)} bytes across {len(reader.pages)} pages.")
    assert len(reader.pages) == 3, f"Expected 3 pages, got {len(reader.pages)}"
    p1_txt = " ".join(reader.pages[0].extract_text().split()).upper()
    assert "RAKSHITH DEVARAJ" in p1_txt, "Candidate name missing on Page 1"
    assert "VISVESVARAYA TECHNOLOGICAL UNIVERSITY" in p1_txt, "Target institution VTU missing on Page 1"
    assert "1RE22CS089" in p1_txt, "USN missing on Page 1"
    assert "CERTISHIELD" in p1_txt, "CertiShield AI branding missing on Page 1"
    assert "TARGET INSTITUTION" in p1_txt, "Target institution parameter designation missing on Page 1"
    assert str(tc['status']) in p1_txt, f"Verdict status {tc['status']} missing on Page 1"

    p2_txt = reader.pages[1].extract_text()
    assert "SECTION A: VISUAL & TYPOGRAPHY FORENSIC AUDIT" in p2_txt, "Section A missing on Page 2"
    assert "SECTION D: FINAL INSTITUTIONAL RECOMMENDATION" in p2_txt, "Section D missing on Page 2"
    assert "CERTISHIELD AI" in p2_txt.upper(), "CertiShield AI auditor missing on Page 2"

    p3_txt = reader.pages[2].extract_text()
    assert "ATTACHED EVIDENCE DOSSIER" in p3_txt, "Evidence dossier missing on Page 3"
    assert "EXHIBIT A" in p3_txt, "Exhibit A missing on Page 3"
    assert "EXHIBIT B" in p3_txt, "Exhibit B missing on Page 3"

print("All CertiShield AI Forensic PDF generator test assertions PASSED successfully!")
