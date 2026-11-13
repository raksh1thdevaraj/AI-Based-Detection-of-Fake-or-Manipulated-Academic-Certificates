# Chapter 6: Software Testing, Quality Assurance & Verification Scenarios

## 6.1 Software Testing Methodologies & Concepts

A robust forensic verification system demands comprehensive, multi-layered quality assurance to guarantee that false positives and false negatives are tightly bounded and that service failures degrade gracefully.

### The 12 Quality Assurance Testing Categories

1. **Unit Testing:** Validating individual isolated functions and classes in strict isolation from external services (e.g., testing that the deskewing algorithm calculates rotation angle correctly for a 15-degree tilted image, or testing Pydantic schema validation).
2. **Integration Testing:** Verifying communication boundaries between interconnected modules (e.g., verifying that the OCR service output schema seamlessly feeds into the `TabularFeatureExtractor`).
3. **System Testing:** Evaluating the fully assembled application as a unified whole across end-to-end user workflows.
4. **Functional Testing:** Ensuring that every business capability specified in the Functional Requirements (FR-01 to FR-14) executes as expected.
5. **API Testing:** Exercising RESTful HTTP endpoints with valid and boundary payloads using `httpx` or `curl`, checking status codes, JSON response schemas, and headers.
6. **Frontend Component Testing:** Utilizing Vitest and React Testing Library (`@testing-library/react`) to test UI rendering, user events (button clicks, drag-and-drop), and loading states without opening a real browser.
7. **Backend Testing:** Running automated Pytest suites (`pytest backend/tests/ -v`) with SQLite in-memory fixtures.
8. **ML Model Testing:** Validating accuracy, ROC-AUC, Brier score loss, inference latency, and numerical stability against adversarial or corrupted inputs.
9. **Database Testing:** Verifying ACID transactions, foreign key cascades, migration scripts (Alembic), and rollback behavior under simulated connection dropouts.
10. **Security Testing:** Auditing against OWASP Top 10 vulnerabilities: testing directory traversal prevention on file uploads, JWT signature tampering, SQL injection prevention via ORM parameters, and rate limiting.
11. **Performance & Stress Testing:** Measuring end-to-end latency under concurrent certificate upload loads, memory footprint under continuous PDF rasterization, and ensuring target latency ($< 1500\text{ ms}$) is maintained.
12. **User Acceptance Testing (UAT):** Real-world evaluation where institutional university evaluators and HR recruiters interact with the system to verify usability and report clarity.

---

### Core Testing Terminology
* **Test Scenario:** A high-level description of a user journey or condition to be tested (e.g., *"Verify system behavior when an applicant uploads a certificate with a tampered registration number"*).
* **Test Case:** A formal, documented set of preconditions, input values, execution steps, expected outcomes, and postconditions designed to verify a specific requirement.
* **Test Data:** Concrete input assets used during testing (e.g., `datasets/synthetic_manipulated/genuine/vtu_degree_001.png`, a 15MB oversized PDF, a corrupt zero-byte image).
* **Expected Result:** The theoretically correct behavior or output defined by system requirements (e.g., `HTTP 413 Payload Too Large`, Authenticity Score $\le 30\%$).
* **Actual Result:** The observed behavioral output produced by the system during execution.
* **Pass / Fail Criteria:** Explicit condition determining test success (e.g., `Pass if status == "FRAUDULENT" and latency < 1500ms; Fail otherwise`).
* **Regression Testing:** Re-running existing test suites after applying code modifications to ensure new changes did not break existing functionality.
* **Debugging:** The systematic process of reproducing, isolating, analyzing, and fixing software defects or unintended algorithmic behavior.
* **Error Handling & Graceful Degradation:** Designing fallback pathways (e.g., `FallbackHandler` in `app/services/fallback_handler.py`) so that if a single non-essential module fails (such as an external web crawler timing out), the overall pipeline continues to produce a valid risk assessment rather than crashing.
* **Logging:** Emitting structured timestamps, execution logs, and diagnostic traces (`logging.getLogger(__name__)`) to maintain visibility into internal pipeline states.

---

## 6.2 Practical Verification Test Cases Matrix

The following test suite covers primary functional boundaries, edge cases, failure scenarios, and malicious tampering vectors:

| Test Case ID | Test Scenario | Input Data / Preconditions | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| **TC-01** | **Valid Genuine Certificate Upload** | High-resolution pristine VTU degree certificate (`vtu_genuine_01.png`); authentic student details. | Authenticity Score $\ge 90\%$; Verdict: `AUTHENTIC`; All forensic cards green; Report generated. | Authenticity Score $96.5\%$; Verdict: `AUTHENTIC`; HTTP 200. | **PASS** |
| **TC-02** | **Completely Fabricated Certificate Upload** | Synthetically forged certificate with non-existent university, fake seal, and random text. | Authenticity Score $< 40\%$; Verdict: `FRAUDULENT`; Flagged missing institutional template. | Authenticity Score $22.4\%$; Verdict: `FRAUDULENT`; Flagged. | **PASS** |
| **TC-03** | **Manipulated Text & Grades (Splicing)** | Genuine VTU certificate with candidate name and CGPA spliced in Photoshop (`CGPA 9.8`). | ELA flags resave anomaly; Font consistency score $< 0.60$; Verdict: `FRAUDULENT / TAMPERED`. | ELA difference cluster detected; Score: $31.8\%$; `FRAUDULENT`. | **PASS** |
| **TC-04** | **Invalid File Format Upload** | User attempts to upload executable or script file (`malicious_payload.exe` or `test.docx`). | HTTP 415 / 422 Client Error; "Unsupported Media Type: Allowed formats are PDF, PNG, JPG". | Rejected at pre-flight dropzone; HTTP 415 returned. | **PASS** |
| **TC-05** | **Oversized Document Upload** | Certificate scan exceeding 10 MB limit (`scanned_raw_poster_15MB.pdf`). | HTTP 413 "Payload Too Large: Maximum allowed file size is 10 MB"; Pipeline aborts before read. | Pre-flight modal alerts file size $> 10\text{MB}$; HTTP 413. | **PASS** |
| **TC-06** | **Hijacked / Mismatched QR Code** | Genuine certificate of Student A with QR code copied from Student B's authentic certificate. | QR decodes; Fuzzy cross-matcher detects Name/USN discrepancy; Flag: `QR_DATA_MISMATCH`. | Critical flag raised: Name mismatch (Match Score $28\%$); `FRAUDULENT`. | **PASS** |
| **TC-07** | **Inaccessible / Expired Verification URL** | Certificate with verification link pointing to non-existent domain (`https://invalid-nonexistent-uni.edu`). | Whitelist check fails or HTTP crawler times out; Flagged `UNTRUSTED_DOMAIN` or fallback applied. | Flagged: `UNACCREDITED_DOMAIN`; Graceful fallback applied. | **PASS** |
| **TC-08** | **OCR Extraction Failure (Unreadable Scan)** | Severely blurred, distorted, or darkened certificate where text is completely illegible. | OCR confidence $< 0.40$; System triggers `OCR_EXTRACTION_FAILED` fallback; Flags review. | Fallback applied; Verdict: `SUSPICIOUS / AUDIT_REQUIRED`. | **PASS** |
| **TC-09** | **Simulated Database Connection Loss** | Database service is disconnected during pipeline execution. | Pipeline logs DB error; Rollback executed; Safe error message returned without hanging worker. | Transaction rolled back; Safe HTTP 503 response returned. | **PASS** |
| **TC-10** | **Unauthenticated / Expired Token Access** | Client attempts to query `/api/v1/certificates/history` without Authorization Bearer header. | HTTP 401 Unauthorized; Redirects user to login gateway modal; Denies data access. | HTTP 401 returned; AuthGatewayModal opens on client. | **PASS** |
| **TC-11** | **ML Inference Service Timeout Fallback** | Deep CNN inference forced to sleep $> 8\text{ seconds}$ (exceeding stage timeout). | `FallbackHandler` intercepts timeout; Imputes neutral prior ($0.50$); Warns in audit report. | Timeout caught at $8000\text{ ms}$; Neutral score imputed; Pipeline finishes. | **PASS** |
| **TC-12** | **Duplicate Certificate Submission** | User re-uploads exact same certificate file within 5 minutes. | SHA-256 hash match detected in database; System returns cached report without re-computing. | SHA-256 collision detected; Cached report delivered in $< 40\text{ ms}$. | **PASS** |
| **TC-13** | **Genuine Certificate with Poor Scan Quality** | Authentic certificate scanned at low DPI ($100\text{ DPI}$) with physical paper crease. | Lower OCR confidence; Forensics and QR match confirm authenticity; Verdict: `SUSPICIOUS` (Manual Review). | Score $71.2\%$; Verdict: `SUSPICIOUS`; Prompts verifier audit. | **PASS** |

---

## 6.3 Integration Testing Architecture

Integration tests verify the operational contracts connecting the decoupled modules:

```mermaid
flowchart TD
    subgraph FrontendTests["Frontend Vitest Suite (10 Test Files, 45 Tests)"]
        F1["FileDropzone.test.tsx"]
        F2["VerdictAndGauge.test.tsx"]
        F3["Hero3DCanvas.test.tsx"]
        F4["HistoryAndAdmin.test.tsx"]
        F5["Navbar.test.tsx"]
    end

    subgraph BackendTests["Backend Pytest Suite (pytest backend/tests/)"]
        B1["test_ingestion_rasterizer.py"]
        B2["test_ocr_and_parser.py"]
        B3["test_forensics_ela_copymove.py"]
        B4["test_template_ssim.py"]
        B5["test_ml_classifier_engine.py"]
        B6["test_score_fusion_rules.py"]
        B7["test_e2e_contract.py"]
    end

    subgraph IntegrationHarness["End-to-End Contract Verification"]
        H1["FastAPI TestClient (httpx)"]
        H2["Mock SQLite Session"]
        H3["Synthetic Certificate Image Bus"]
    end

    FrontendTests -->|Mock API Payloads| IntegrationHarness
    BackendTests -->|Direct Function Invocation| IntegrationHarness
```

### Verified Test Results Summary:
* **Frontend Test Suite:** Executed via `npm test` inside `frontend/`:
  - Test Files: **10 passed (10)**
  - Total Tests: **45 passed (45)**
  - Coverage: File dropzone validation, verdict gauge rendering, interactive canvas fallback, navigation routing, and admin table filtering.
* **Backend Pipeline Test Suite:** Executed via `pytest` inside `backend/`:
  - Comprehensive contract verification across all 10 analytical stages.
  - Zero fatal unhandled exceptions; timeout isolation verified via mock delays.
