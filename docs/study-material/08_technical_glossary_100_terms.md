# Chapter 8: Comprehensive 100-Term Technical Glossary

This glossary provides simple definitions, rigorous technical meanings, concrete practical examples, and exact repository file references for 100 essential technical concepts.

---

### Group 1: Artificial Intelligence & Machine Learning (Terms 1–15)

1. **Artificial Intelligence (AI)**
   * *Simple:* Machines exhibiting human-like problem-solving.
   * *Technical:* Computational systems designed to perform cognitive tasks such as visual perception, pattern recognition, and decision making.
   * *Example:* Automatically auditing an academic transcript for fraudulent edits.
   * *Project Usage:* Global system scope (`backend/app/main.py`).

2. **Machine Learning (ML)**
   * *Simple:* Algorithms that learn patterns from data instead of hardcoded rules.
   * *Technical:* Mathematical optimization of parameterized functions over empirical training datasets to minimize loss.
   * *Example:* Training an ensemble model on 1,200 certificate feature vectors.
   * *Project Usage:* `ml/scripts/train_baseline_models.py`.

3. **Supervised Learning**
   * *Simple:* Learning with input features paired with correct ground-truth labels.
   * *Technical:* Mapping function $f: \mathcal{X} \to \mathcal{Y}$ trained on $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^n$.
   * *Example:* Training with label `1` for manipulated certificates and `0` for genuine.
   * *Project Usage:* `backend/app/modules/ml_classifier/service.py`.

4. **Binary Classification**
   * *Simple:* Sorting inputs into one of two discrete classes.
   * *Technical:* Supervised classification where the label space $|\mathcal{Y}| = 2$, typically $y \in \{0, 1\}$.
   * *Example:* Classifying a certificate as either "AUTHENTIC" or "FRAUDULENT".
   * *Project Usage:* `unified_inference.py`.

5. **Decision Tree**
   * *Simple:* A flowchart-like model that makes decisions by asking sequential questions.
   * *Technical:* A non-parametric supervised model that recursively partitions the feature space into orthogonal hyper-rectangles based on split criteria (Gini, Entropy, or Gradient Gain).
   * *Example:* Splitting certificates on $\text{ela\_score} \le 0.45$.
   * *Project Usage:* Base learner inside `RandomForestClassifier`.

6. **Random Forest**
   * *Simple:* An ensemble of many decision trees voting together.
   * *Technical:* An ensemble of unpruned decision trees trained in parallel on bootstrap data subsets using random feature subsampling.
   * *Example:* 200 trees voting on whether a certificate's typography is consistent.
   * *Project Usage:* `ml/scripts/train_baseline_models.py`.

7. **Boosting**
   * *Simple:* Training models in a sequence where each model corrects the previous one's errors.
   * *Technical:* An iterative ensemble framework where weak base learners are sequentially fitted to the residual errors of the accumulated ensemble.
   * *Example:* Tree 2 learning to classify difficult certificates that Tree 1 got wrong.
   * *Project Usage:* `HistGradientBoostingClassifier` in `train_course_cert_model.py`.

8. **XGBoost (Extreme Gradient Boosting)**
   * *Simple:* A high-performance, regularized gradient boosted decision tree library.
   * *Technical:* An optimized distributed gradient boosting library implementing second-order Taylor expansions of the loss function with $\mathcal{L}_1/\mathcal{L}_2$ tree regularization.
   * *Example:* Rapid classification of 22-dimensional certificate feature vectors.
   * *Project Usage:* Evaluated in `ml/scripts/train_baseline_models.py`.

9. **Gradient Descent**
   * *Simple:* Moving down a hill step by step to find the lowest point of error.
   * *Technical:* First-order optimization algorithm that iteratively updates model parameters in the direction of the negative gradient of the loss function: $\theta \leftarrow \theta - \eta \nabla \mathcal{L}$.
   * *Example:* Adjusting weights in MobileNetV2 during backpropagation.
   * *Project Usage:* `train_visual_forensics.py`.

10. **Loss Function**
    * *Simple:* A mathematical formula measuring how wrong an AI's guess is.
    * *Technical:* A differentiable function $\mathcal{L}(\hat{y}, y)$ quantifying the cost between predicted probabilities and true targets.
    * *Example:* Binary Cross-Entropy (Log-Loss) penalizing confident wrong predictions.
    * *Project Usage:* `torch.nn.BCEWithLogitsLoss()` in `train_visual_forensics.py`.

11. **Learning Rate ($\eta$)**
    * *Simple:* The step size taken while learning.
    * *Technical:* A positive scalar hyperparameter scaling the step magnitude along the negative gradient vector during weight updates.
    * *Example:* Setting learning rate to $10^{-4}$ in Adam optimizer to avoid overshooting minima.
    * *Project Usage:* `train_visual_forensics.py`.

12. **Overfitting**
    * *Simple:* Memorizing the training data so well that the model fails on new, unseen examples.
    * *Technical:* High-variance phenomenon where a model fits training noise and peculiarities, resulting in low training loss but high generalization error on validation data.
    * *Example:* A model achieving 100% on training certificates but dropping to 60% on real scans.
    * *Project Usage:* Controlled via Dropout ($0.3$) and tree depth limits (`max_depth=5`).

13. **Regularization**
    * *Simple:* Rules added to an algorithm to stop it from getting overly complicated.
    * *Technical:* Additional penalty terms added to the loss function (e.g., $\mathcal{L}_2$ ridge penalty $\frac{1}{2}\lambda \sum w_j^2$) to constrain model capacity.
    * *Example:* Penalizing excessively deep tree branches in gradient boosting.
    * *Project Usage:* $\gamma$ and $\lambda$ penalties in tree split evaluation.

14. **Cross-Validation (K-Fold)**
    * *Simple:* Testing a model multiple times on different slices of data to ensure reliability.
    * *Technical:* Resampling method partitioning a dataset into $K$ mutually exclusive subsets, iteratively using $K-1$ folds for training and the remaining fold for validation.
    * *Example:* 5-Fold Stratified Cross-Validation on behavioral issuance logs.
    * *Project Usage:* `sklearn.model_selection.StratifiedKFold` in `train_behavioral.py`.

15. **SMOTE**
    * *Simple:* Creating realistic synthetic copies of rare events so the AI can learn them.
    * *Technical:* Synthetic Minority Over-sampling Technique; generates synthetic feature vectors along line segments connecting $k$-nearest minority class neighbors.
    * *Example:* Synthesizing fraudulent issuance event vectors to rebalance a 95:5 class imbalance.
    * *Project Usage:* `imblearn.over_sampling.SMOTE` in `train_behavioral.py`.

---

### Group 2: Deep Learning & Computer Vision (Terms 16–30)

16. **Deep Learning (DL)**
    * *Simple:* Neural networks with many layers learning directly from raw data.
    * *Technical:* Representation learning using multi-layered computational graphs capable of extracting hierarchical feature representations.
    * *Example:* Learning subtle pixel compression artifacts using deep convolutional filters.
    * *Project Usage:* PyTorch pipeline in `train_visual_forensics.py`.

17. **Convolutional Neural Network (CNN)**
    * *Simple:* A neural network specialized in analyzing images using visual filters.
    * *Technical:* Feedforward neural network utilizing convolutional kernels, activation functions, and spatial pooling to achieve translation equivariance on grid-structured inputs.
    * *Example:* Scanning certificate images for localized tampering patches.
    * *Project Usage:* MobileNetV2 architecture in `train_visual_forensics.py`.

18. **MobileNetV2**
    * *Simple:* A lightweight, ultra-fast neural network designed for mobile and edge devices.
    * *Technical:* Efficient CNN architecture employing inverted residual blocks, linear bottlenecks, and depthwise separable convolutions to minimize parameter count ($< 3.5\text{M}$).
    * *Example:* Classifying visual tampering in $< 60\text{ ms}$ on a laptop CPU.
    * *Project Usage:* `models/visual_tamper_mobilenet.pt`.

19. **Depthwise Separable Convolution**
    * *Simple:* Splitting an image filter into two simpler steps to save memory and time.
    * *Technical:* Factorizing standard convolution into a spatial depthwise convolution (one filter per input channel) followed by a pointwise $1 \times 1$ convolution (linear combination across channels).
    * *Example:* Reducing computational FLOPs by 85% compared to standard $3 \times 3$ convolutions.
    * *Project Usage:* Core building block of MobileNetV2 features.

20. **Transfer Learning**
    * *Simple:* Taking a model trained on millions of general photos and adapting it to our specific task.
    * *Technical:* Reusing the weights of a neural network pre-trained on a large source dataset (ImageNet) and fine-tuning its classification head on a target domain dataset.
    * *Example:* Initializing MobileNetV2 with ImageNet weights and retraining on certificate documents.
    * *Project Usage:* `MobileNet_V2_Weights.DEFAULT` in `train_visual_forensics.py`.

21. **Feature Map**
    * *Simple:* An intermediate visual image highlighting where certain patterns appear.
    * *Technical:* The 3D tensor output $H' \times W' \times C'$ produced by applying a bank of convolutional filters to an input tensor.
    * *Example:* A feature map highlighting edge boundaries and text baselines.
    * *Project Usage:* Intermediate layers in `MobileNetTamperDetector`.

22. **Global Average Pooling (GAP)**
    * *Simple:* Condensing an entire feature map into a single summary number.
    * *Technical:* Dimensionality reduction layer computing the arithmetic mean of all spatial values across each feature channel: $\frac{1}{H \times W} \sum_{i,j} X_{i,j,c}$.
    * *Example:* Reducing a $7 \times 7 \times 1280$ tensor to a $1 \times 1280$ feature vector.
    * *Project Usage:* `nn.AdaptiveAvgPool2d((1, 1))` in `unified_inference.py`.

23. **Dropout**
    * *Simple:* Randomly turning off some neurons during training to prevent over-reliance on any single feature.
    * *Technical:* Stochastic regularization technique zeroing out activation units with probability $p$ during training forward passes to prevent co-adaptation.
    * *Example:* Applying `Dropout(p=0.3)` before the final classification head.
    * *Project Usage:* `train_visual_forensics.py`.

24. **Rectified Linear Unit (ReLU)**
    * *Simple:* An activation switch that outputs zero for negative numbers and the number itself for positive numbers.
    * *Technical:* Piecewise linear activation function $f(x) = \max(0, x)$ providing non-linearity while preventing vanishing gradients.
    * *Example:* Activating intermediate neurons in dense layers.
    * *Project Usage:* Dense hidden layers in `MobileNetTamperDetector`.

25. **Sigmoid Function**
    * *Simple:* An S-shaped mathematical curve that squashes any number into a probability between 0 and 1.
    * *Technical:* Non-linear activation function $\sigma(z) = \frac{1}{1 + e^{-z}}$ mapping logits to continuous probabilities.
    * *Example:* Converting raw network logits into a tamper probability $P \in [0.0, 1.0]$.
    * *Project Usage:* `torch.sigmoid(logits)` in `unified_inference.py`.

26. **OpenCV**
    * *Simple:* An industry-standard open-source programming library for computer vision and image processing.
    * *Technical:* Highly optimized C++ computer vision library with Python bindings (`opencv-python-headless`) providing matrix transformations, filtering, and edge detection.
    * *Example:* Deskewing, cropping, and thresholding certificate image arrays.
    * *Project Usage:* `backend/app/modules/preprocessing/`.

27. **Structural Similarity Index Measure (SSIM)**
    * *Simple:* A formula measuring how similar two pictures look to a human eye.
    * *Technical:* Image quality metric assessing luminance, contrast, and structural covariance across localized sliding Gaussian windows.
    * *Example:* Comparing an uploaded certificate's layout against a reference VTU template.
    * *Project Usage:* `src/deterministic_checks.py` (`compute_ssim_score`).

28. **Canny Edge Detection**
    * *Simple:* An image processing algorithm that draws thin outlines around all distinct edges.
    * *Technical:* Multi-stage edge detector involving Gaussian smoothing, Sobel gradient magnitude/direction calculation, non-maximum suppression, and hysteresis thresholding.
    * *Example:* Extracting document borders, table grids, and signature outlines.
    * *Project Usage:* `src/deterministic_checks.py` (`compute_edge_difference_ratio`).

29. **Deskewing**
    * *Simple:* Straightening a crooked or tilted document scan.
    * *Technical:* Detecting the dominant angle of document text orientation and applying an affine rotation matrix to align text horizontally.
    * *Example:* Rotating a $7^\circ$ tilted smartphone photograph back to $0^\circ$.
    * *Project Usage:* `backend/app/modules/preprocessing/deskew.py`.

30. **CLAHE**
    * *Simple:* Enhancing dark or washed-out image regions without blowing out noise.
    * *Technical:* Contrast Limited Adaptive Histogram Equalization; enhances local contrast across grid tiles while clipping histogram peaks to limit noise amplification.
    * *Example:* Brightening faded embossed university seals while keeping paper background clean.
    * *Project Usage:* `backend/app/modules/preprocessing/enhancer.py`.

---

### Group 3: Digital Forensics & Optical Character Recognition (Terms 31–45)

31. **Error Level Analysis (ELA)**
    * *Simple:* Re-saving an image to see which parts compress differently due to tampering.
    * *Technical:* Digital forensic technique measuring pixel variance after intentional lossy re-quantization; freshly spliced elements exhibit distinct error levels from original backgrounds.
    * *Example:* Exposing a spliced student name that glows brightly in the ELA difference image.
    * *Project Usage:* `backend/app/modules/forensics/ela.py`.

32. **Copy-Move Forgery**
    * *Simple:* Copying a genuine stamp or signature and pasting it elsewhere on a document.
    * *Technical:* Image tampering attack where a source region is duplicated, transformed, and pasted into a target region within the same or companion document.
    * *Example:* Cloning an official registrar signature onto an unapproved certificate.
    * *Project Usage:* `backend/app/modules/forensics/copy_move.py`.

33. **SIFT (Scale-Invariant Feature Transform)**
    * *Simple:* Finding distinctive landmark points in an image that stay recognizable even if resized or rotated.
    * *Technical:* Computer vision algorithm identifying scale-space extrema in Difference-of-Gaussians and generating 128-dimensional local gradient orientation histograms.
    * *Example:* Detecting matching keypoint clusters between original and cloned university seals.
    * *Project Usage:* `backend/app/modules/forensics/copy_move.py`.

34. **ORB (Oriented FAST and Rotated BRIEF)**
    * *Simple:* An ultra-fast, patent-free alternative to SIFT for detecting image keypoints.
    * *Technical:* Binary feature point descriptor combining FAST corner detection, Harris corner filtering, and orientation-compensated BRIEF binary strings compared via Hamming distance.
    * *Example:* Rapidly finding matching visual landmarks in under 15 ms.
    * *Project Usage:* `src/deterministic_checks.py`.

35. **Noise Inconsistency Analysis**
    * *Simple:* Checking if the background graininess of a picture is uniform everywhere.
    * *Technical:* Estimating high-frequency noise variance across local document patches using high-pass Laplacian filtering; spliced regions often carry foreign sensor noise.
    * *Example:* Flagging an inserted grade box that has zero camera noise while the rest of the paper is grainy.
    * *Project Usage:* `backend/app/modules/forensics/noise_analysis.py`.

36. **Optical Character Recognition (OCR)**
    * *Simple:* Converting pictures of words into actual selectable computer text.
    * *Technical:* Automatic translation of rasterized text glyphs into machine-encoded character strings using neural segmentation and sequence modeling.
    * *Example:* Converting a scanned PNG marks card into a searchable text string.
    * *Project Usage:* `backend/app/modules/ocr/service.py`.

37. **Tesseract OCR**
    * *Simple:* The world's most popular open-source OCR engine developed by HP and Google.
    * *Technical:* OCR software utilizing an LSTM recurrent neural network engine to perform line recognition, word segmentation, and token bounding-box mapping.
    * *Example:* Extracting candidate names and USN codes from degree certificates.
    * *Project Usage:* `pytesseract` in `backend/app/modules/ocr/extractor.py`.

38. **Page Segmentation Mode (PSM)**
    * *Simple:* A setting telling Tesseract how the document page is laid out.
    * *Technical:* Tesseract operational mode defining layout analysis assumptions (e.g., PSM 3: fully automatic layout; PSM 6: single uniform block of text).
    * *Example:* Setting PSM 6 to parse structured certificate marks tables accurately.
    * *Project Usage:* Configured in `backend/app/modules/ocr/extractor.py`.

39. **Character Error Rate (CER)**
    * *Simple:* The percentage of letters that the OCR misread.
    * *Technical:* Metric evaluating OCR accuracy based on normalized Levenshtein edit distance: $\text{CER} = \frac{S + D + I}{N}$ (Substitutions, Deletions, Insertions divided by reference length).
    * *Example:* A CER of $2\%$ indicates high-quality OCR extraction.
    * *Project Usage:* Monitored during OCR validation benchmarks.

40. **Bounding Box**
    * *Simple:* A rectangular box drawn around an object or word in an image.
    * *Technical:* A 4-tuple of spatial coordinates $(x, y, w, h)$ or $(x_{\min}, y_{\min}, x_{\max}, y_{\max})$ defining the spatial boundaries of a detected region.
    * *Example:* Drawing a red outline around a tampered CGPA on the frontend preview.
    * *Project Usage:* `frontend/src/components/results/BoundingBoxOverlay.tsx`.

41. **Baseline Alignment**
    * *Simple:* The invisible straight line that typed letters sit on.
    * *Technical:* Linear regression fit across the bottom coordinates of connected text components on a single line; deviations indicate manual text splicing.
    * *Example:* A forged letter '8' sitting 3 pixels lower than the surrounding 'CS0' characters.
    * *Project Usage:* `backend/app/modules/text_consistency/service.py`.

42. **Stroke Weight Consistency**
    * *Simple:* The thickness of the ink lines making up typed letters.
    * *Technical:* Mean distance across orthogonal cross-sections of binarized character skeletons; spliced text often exhibits mismatched line boldness.
    * *Example:* Detecting that a changed grade is noticeably bolder than original text.
    * *Project Usage:* `backend/app/modules/text_consistency/service.py`.

43. **Kerning (Character Spacing)**
    * *Simple:* The horizontal space between neighboring letters in a word.
    * *Technical:* Spatial interval between consecutive character bounding boxes; irregular kerning reveals amateur digital cut-and-paste jobs.
    * *Example:* An unnatural gap between the letters 'R' and 'A' in a student's name.
    * *Project Usage:* `backend/app/modules/text_consistency/service.py`.

44. **EXIF Metadata**
    * *Simple:* Hidden camera and software details saved inside an image file.
    * *Technical:* Exchangeable Image File Format metadata recording camera model, lens parameters, date, and software editing history (e.g., Photoshop tags).
    * *Example:* Reading that an image was saved by "Adobe Photoshop 2024 (Windows)".
    * *Project Usage:* `backend/app/modules/ingestion/extractor.py`.

45. **Rasterization**
    * *Simple:* Converting a digital vector PDF into a flat pixel picture.
    * *Technical:* Rendering vector commands, fonts, and PostScript instructions into a discrete 2D matrix of pixels at a fixed resolution (DPI).
    * *Example:* Rasterizing a PDF degree certificate into a 300 DPI PNG image buffer.
    * *Project Usage:* `backend/app/modules/ingestion/rasterizer.py` (PyMuPDF).

---

### Group 4: Web Development, React & UI Engineering (Terms 46–60)

46. **Single Page Application (SPA)**
    * *Simple:* A website that loads once and updates dynamically without page refreshes.
    * *Technical:* Web application architecture loading a single HTML shell, dynamically rewriting the DOM as users interact via client-side JavaScript routers.
    * *Example:* Our React frontend navigating from `/upload` to `/verify` seamlessly.
    * *Project Usage:* `frontend/src/App.tsx`.

47. **React 18**
    * *Simple:* A popular JavaScript library for building interactive user interfaces.
    * *Technical:* Component-based declarative UI framework utilizing a Virtual DOM and fiber reconciliation engine with concurrent rendering capabilities.
    * *Example:* Re-rendering the authenticity gauge when backend results arrive.
    * *Project Usage:* `frontend/package.json`.

48. **TypeScript**
    * *Simple:* JavaScript with strict type-checking rules to prevent programming bugs.
    * *Technical:* Statically typed superset of JavaScript that compiles to plain JavaScript, enforcing compile-time type safety across interfaces and data contracts.
    * *Example:* Defining `interface FullVerificationReport` matching the backend schema.
    * *Project Usage:* `frontend/src/types/index.ts`.

49. **Vite**
    * *Simple:* An ultra-fast modern frontend build tool and local development server.
    * *Technical:* Next-generation frontend bundler serving source code over native ES Modules during development and bundling with Rollup for production.
    * *Example:* Starting the local frontend dev server in under 400 ms.
    * *Project Usage:* `frontend/vite.config.ts`.

50. **TailwindCSS**
    * *Simple:* A CSS framework that lets you style websites directly in your HTML tags.
    * *Technical:* Utility-first CSS framework providing atomic class names (`flex`, `bg-slate-900`, `text-emerald-400`) composed directly in JSX.
    * *Example:* Styling the dark institutional theme without writing custom CSS files.
    * *Project Usage:* `frontend/tailwind.config.js`.

51. **Virtual DOM (VDOM)**
    * *Simple:* A lightweight in-memory copy of the real web page kept by React.
    * *Technical:* In-memory tree representation of real DOM nodes used by React reconciliation algorithms (Diffing) to calculate minimal batch updates to the browser DOM.
    * *Example:* Updating only the progress bar percentage without re-drawing the entire navbar.
    * *Project Usage:* Core React rendering engine.

52. **React Hooks**
    * *Simple:* Special functions that let React components remember things and talk to APIs.
    * *Technical:* Functions (`useState`, `useEffect`, `useContext`, `useMemo`) allowing functional components to manage local state, context, and side effects.
    * *Example:* `const [status, setStatus] = useState("PROCESSING")`.
    * *Project Usage:* Used across all components in `frontend/src/components/`.

53. **Context API (`AuthContext`)**
    * *Simple:* A way to share information (like who is logged in) across all web pages.
    * *Technical:* React mechanism for passing global state through the component tree without manually passing props down through every nested level.
    * *Example:* Sharing the authenticated user's JWT token and role with all pages.
    * *Project Usage:* `frontend/src/context/AuthContext.tsx`.

54. **React Router DOM v6**
    * *Simple:* The component that switches what page you see based on the web address.
    * *Technical:* Declarative client-side routing library intercepting browser URL changes and mounting mapped component trees without full server roundtrips.
    * *Example:* Routing `/verify` to `PublicVerifyPage` and `/admin` to `AdminDashboardPage`.
    * *Project Usage:* `<Routes>` in `frontend/src/App.tsx`.

55. **Code Splitting & Lazy Loading**
    * *Simple:* Downloading web pages only when the user actually clicks on them.
    * *Technical:* Dynamic module importation (`React.lazy()`) splitting bundle chunks to minimize initial JavaScript download size and boost Largest Contentful Paint (LCP).
    * *Example:* Lazy-loading the heavy `AdminDashboardPage` so normal users don't download it.
    * *Project Usage:* `React.lazy(() => import('./pages/AdminDashboardPage'))` in `App.tsx`.

56. **Axios**
    * *Simple:* A JavaScript library for making HTTP requests to a backend server.
    * *Technical:* Promise-based HTTP client for browser and Node.js featuring request/response interceptors, automatic JSON transforms, and cancel tokens.
    * *Example:* Uploading a multipart certificate payload to the FastAPI server.
    * *Project Usage:* `frontend/src/services/api.ts`.

57. **Three.js**
    * *Simple:* A JavaScript 3D graphics library that renders 3D objects in the browser.
    * *Technical:* High-level WebGL wrapper library rendering interactive 3D scenes, meshes, lights, shaders, and materials directly onto an HTML `<canvas>`.
    * *Example:* Rendering a 3D rotating academic degree certificate on the landing page.
    * *Project Usage:* `frontend/src/components/landing/Hero3DCanvas.tsx`.

58. **Hot Module Replacement (HMR)**
    * *Simple:* Seeing your code changes in the browser instantly without losing your place.
    * *Technical:* Build tool capability injecting updated JavaScript modules into a running browser application at runtime without triggering a full page reload.
    * *Example:* Tweaking a button color in Vite and seeing it update in 50 ms.
    * *Project Usage:* Vite development server feature.

59. **Drag-and-Drop Ingestion**
    * *Simple:* Dropping a file from your desktop directly into a box on the website.
    * *Technical:* HTML5 Drag and Drop API implementation handling `dragover`, `dragleave`, and `drop` events to extract `FileList` objects from user input.
    * *Example:* Dropping a PDF certificate into `FileDropzone.tsx`.
    * *Project Usage:* `frontend/src/components/upload/FileDropzone.tsx`.

60. **Responsive Design**
    * *Simple:* Making a website look great on phones, tablets, laptops, and wide screens.
    * *Technical:* Designing UI layouts using CSS media queries, fluid grids, and flexible viewports ensuring usability across all device form factors ($320\text{px}$ to $4\text{K}$).
    * *Example:* Collapsing the verification history table into mobile card views on smartphones.
    * *Project Usage:* Tailwind responsive utility classes (`sm:`, `md:`, `lg:`).

---

### Group 5: Backend Engineering, FastAPI & REST APIs (Terms 61–75)

61. **FastAPI**
    * *Simple:* A modern, lightning-fast Python web framework for building APIs.
    * *Technical:* High-performance ASGI web framework built on Starlette and Pydantic, supporting asynchronous concurrency, auto-generated OpenAPI documentation, and dependency injection.
    * *Example:* Hosting our certificate verification endpoints on port 8000.
    * *Project Usage:* `backend/app/main.py`.

62. **Uvicorn**
    * *Simple:* The engine that runs our Python FastAPI application.
    * *Technical:* Lightning-fast Asynchronous Server Gateway Interface (ASGI) web server implementation for Python, built on `uvloop` and `httptools`.
    * *Example:* Serving incoming HTTP verification requests asynchronously: `uvicorn app.main:app`.
    * *Project Usage:* Declared in `backend/requirements.txt`.

63. **REST API**
    * *Simple:* A standard set of rules for how computers send and request data over the web.
    * *Technical:* Representational State Transfer; a stateless client-server architectural style utilizing standard HTTP methods, uniform resource URIs, and JSON payloads.
    * *Example:* Sending a `GET /api/v1/certificates/{id}` request to fetch report JSON.
    * *Project Usage:* Complete routing architecture in `backend/app/api/v1/`.

64. **HTTP Methods (GET, POST, PUT, DELETE)**
    * *Simple:* Standard verbs telling the server what action to perform.
    * *Technical:* Protocol action indicators: `GET` (retrieve), `POST` (create), `PUT` (replace/update), `DELETE` (remove).
    * *Example:* `POST /verify/upload` creates a new scan; `GET /reports/{id}` retrieves findings.
    * *Project Usage:* Route decorators in `verification_hub.py`.

65. **Pydantic V2**
    * *Simple:* A tool that validates and cleans data coming into our Python server.
    * *Technical:* Data validation and parsing library utilizing Python type hints and a core Rust validation engine, enforcing strict runtime schema validation.
    * *Example:* Enforcing that `file_size_bytes` is a non-negative integer.
    * *Project Usage:* `backend/app/schemas/pipeline.py`.

66. **Data Transfer Object (DTO)**
    * *Simple:* A neat package of data sent between the frontend and backend.
    * *Technical:* An object carrying data between software processes without containing business logic, ensuring strict API contracts.
    * *Example:* `FullVerificationReport` carrying forensic verdicts to the client.
    * *Project Usage:* Pydantic models in `backend/app/schemas/report.py`.

67. **Dependency Injection (`Depends`)**
    * *Simple:* Providing a function with the tools it needs without making it build them itself.
    * *Technical:* Design pattern where an external framework provides instantiated services or database sessions to route handlers dynamically.
    * *Example:* Passing `db: Session = Depends(get_db)` into an endpoint function.
    * *Project Usage:* `backend/app/api/deps.py`.

68. **Object-Relational Mapping (ORM)**
    * *Simple:* Translating database tables into normal Python objects so you don't write raw SQL.
    * *Technical:* Programming abstraction mapping relational database tables, columns, and foreign keys directly to object-oriented classes and attributes.
    * *Example:* `cert = db.query(CertificateModel).filter_by(id=cert_id).first()`.
    * *Project Usage:* SQLAlchemy 2.0 in `backend/app/models/`.

69. **SQLAlchemy 2.0**
    * *Simple:* The Python library that communicates with our database.
    * *Technical:* Enterprise database toolkit and declarative ORM providing connection pooling, transaction isolation, and database dialect translation.
    * *Example:* Defining `class CertificateModel(Base): ...` with relational foreign keys.
    * *Project Usage:* `backend/app/database.py`.

70. **Alembic**
    * *Simple:* Version control for your database structure.
    * *Technical:* Database migration tool for SQLAlchemy, tracking schema revisions and generating automated upgrade/downgrade DDL scripts.
    * *Example:* Adding a new column `qr_verified` to the database table without losing existing rows.
    * *Project Usage:* `backend/alembic.ini`.

71. **Asynchronous I/O (`async` / `await`)**
    * *Simple:* Letting the server work on other tasks while waiting for a file or database to respond.
    * *Technical:* Non-blocking cooperative multitasking concurrency model using an event loop, allowing thousands of concurrent connections on a single thread.
    * *Example:* `async def upload_and_verify_hub(...)` handling requests concurrently.
    * *Project Usage:* Endpoint definitions in `verification_hub.py`.

72. **CORS (Cross-Origin Resource Sharing)**
    * *Simple:* A security rule allowing our frontend to talk safely to our backend on a different port.
    * *Technical:* HTTP header mechanism (`Access-Control-Allow-Origin`) allowing a browser on `http://localhost:5173` to make requests to `http://localhost:8000`.
    * *Example:* Configuring `CORSMiddleware` in FastAPI.
    * *Project Usage:* Configured in `backend/app/main.py`.

73. **Multipart Form-Data**
    * *Simple:* The format used to upload files over the internet.
    * *Technical:* MIME specification encoding mixed payloads (binary files alongside text fields) separated by boundary strings within an HTTP POST body.
    * *Example:* Uploading a PDF certificate alongside a user ID.
    * *Project Usage:* Handled by `python-multipart` in `verification_hub.py`.

74. **Graceful Degradation**
    * *Simple:* If one feature breaks, the rest of the app keeps working smoothly.
    * *Technical:* Architectural capability maintaining partial system functionality when specific components or external network calls experience failure or timeout.
    * *Example:* Continuing verification with neutral scores if an external university URL times out.
    * *Project Usage:* `backend/app/services/fallback_handler.py`.

75. **Pipeline Orchestrator**
    * *Simple:* The master controller running every verification step in the correct sequence.
    * *Technical:* Central service coordinating multi-stage pipeline execution, dependency passing, stage timeout guards, and state persistence.
    * *Example:* `VerificationPipelineOrchestrator.run_pipeline()`.
    * *Project Usage:* `backend/app/services/pipeline_orchestrator.py`.

---

### Group 6: Cloud Computing, Databases & Firebase (Terms 76–85)

76. **Cloud Computing**
    * *Simple:* Renting servers, storage, and databases over the internet instead of buying physical computers.
    * *Technical:* On-demand delivery of compute power, database storage, and applications via the internet with dynamic resource elasticity.
    * *Example:* Deploying our backend on containerized cloud infrastructure.
    * *Project Usage:* Documented in `docs/TECH_STACK.md`.

77. **Relational Database (RDBMS)**
    * *Simple:* A database organizing information into structured tables with rows, columns, and relationships.
    * *Technical:* Data storage system based on relational algebra, strictly enforcing ACID properties and foreign key constraints (e.g., PostgreSQL, SQLite).
    * *Example:* Storing user accounts and verification job logs.
    * *Project Usage:* `dev.db` and PostgreSQL configuration.

78. **Document Database (NoSQL)**
    * *Simple:* A flexible database storing information in JSON-like documents rather than rigid tables.
    * *Technical:* Non-relational database storing semi-structured hierarchical documents with dynamic schemas (e.g., MongoDB, Cloud Firestore).
    * *Example:* Storing complex nested forensic finding trees inside Firestore.
    * *Project Usage:* Cloud Firestore in `docs/firestore_schema.md`.

79. **Firebase Authentication**
    * *Simple:* Google's ready-to-use user login and identity service.
    * *Technical:* Managed Identity-as-a-Service (IDaaS) handling user registration, multi-factor authentication, OAuth identity federation, and JWT token issuance.
    * *Example:* Authenticating verifiers via email/password and attaching a JWT token.
    * *Project Usage:* `frontend/src/context/AuthContext.tsx`.

80. **Cloud Firestore**
    * *Simple:* A fast, real-time, cloud-hosted NoSQL database from Google.
    * *Technical:* Horizontally scaling, serverless cloud document database with real-time listeners and declarative rule-based security enforcement.
    * *Example:* Storing immutable audit log entries in the `/audit_logs/` collection.
    * *Project Usage:* `firestore.rules` and `functions/src/index.ts`.

81. **Firebase Storage**
    * *Simple:* Secure cloud folder storage for user-uploaded pictures and files.
    * *Technical:* Scalable object storage built on Google Cloud Storage, supporting streaming uploads and granular path-based security rules.
    * *Example:* Storing uploaded certificate PDFs at `/certificates/{uid}/{certId}/`.
    * *Project Usage:* `storage.rules`.

82. **Serverless Computing (Cloud Functions v2)**
    * *Simple:* Running code in the cloud automatically without managing or renting a full server.
    * *Technical:* Event-driven Function-as-a-Service (FaaS) executing stateless code containers in response to HTTP calls or cloud storage events (e.g., `onObjectFinalized`).
    * *Example:* Triggering automated fraud scans the millisecond a student uploads a file.
    * *Project Usage:* `functions/src/index.ts`.

83. **Firebase App Check**
    * *Simple:* A digital shield blocking unauthorized bots and scripts from calling your backend.
    * *Technical:* Anti-abuse infrastructure attesting that incoming requests originate from legitimate, verified client applications using providers like reCAPTCHA Enterprise.
    * *Example:* Rejecting automated scraper attacks targeting our verification API.
    * *Project Usage:* `frontend/src/config/appCheck.ts`.

84. **Database Migration**
    * *Simple:* Safely updating your database structure as your app grows without deleting data.
    * *Technical:* Programmatic, version-controlled execution of DDL scripts that alter database schema tables, indexes, and constraints incrementally.
    * *Example:* Upgrading local SQLite schemas to production PostgreSQL schemas.
    * *Project Usage:* `docs/data_migration.md`.

85. **Decentralized Storage (IPFS)**
    * *Simple:* A global peer-to-peer network for storing and sharing files without a central owner.
    * *Technical:* InterPlanetary File System; a content-addressable, distributed hypermedia protocol where files are referenced by immutable cryptographic hashes (`Qm...`).
    * *Example:* Permanently archiving an academic degree hash so it can never be deleted or censored.
    * *Project Usage:* Evaluated in `docs/Abstract.md` and Phase 22 roadmap.

---

### Group 7: Cybersecurity, Cryptography & Blockchain (Terms 86–95)

86. **Cryptographic Hash (SHA-256)**
    * *Simple:* A one-way mathematical fingerprint of a file that changes completely if a single letter is altered.
    * *Technical:* Deterministic cryptographic algorithm mapping arbitrary-length data to a 256-bit digest exhibiting strong collision and pre-image resistance.
    * *Example:* Calculating `hashlib.sha256(file_bytes).hexdigest()` upon upload.
    * *Project Usage:* `backend/app/api/v1/endpoints/verification_hub.py`.

87. **Avalanche Effect**
    * *Simple:* Changing one tiny pixel in a file makes the entire hash code completely unrecognizable.
    * *Technical:* Cryptographic property where a single-bit flip in the input data results in an uncorrelated, roughly 50% change in output hash bits.
    * *Example:* Changing a grade from "B" to "A" generates an entirely different SHA-256 string.
    * *Project Usage:* Demonstrates hash-based tamper evidence during viva defense.

88. **JSON Web Token (JWT)**
    * *Simple:* A secure, digitally signed passport that proves who you are to the server.
    * *Technical:* An open standard (RFC 7519) encoding claims in a compact, URL-safe JSON format composed of Header, Payload, and Signature: `xxxxx.yyyyy.zzzzz`.
    * *Example:* Sending `Authorization: Bearer <token>` with every authenticated API call.
    * *Project Usage:* `backend/app/core/security.py`.

89. **Bcrypt**
    * *Simple:* A secure, intentionally slow password scrambler with built-in protection against hackers.
    * *Technical:* Password hashing function based on the Blowfish cipher incorporating adaptive work factors (iteration rounds) and random 128-bit salts to defeat rainbow tables.
    * *Example:* Hashing the admin master password before database insertion.
    * *Project Usage:* `passlib.context.CryptContext` in `backend/app/core/security.py`.

90. **Public Key Infrastructure (PKI)**
    * *Simple:* A system of digital locks and keys that allows computers to securely sign and verify documents.
    * *Technical:* Asymmetric cryptographic framework utilizing public/private key pairs and digital certificates issued by Certificate Authorities (CAs) to prove identity.
    * *Example:* Verifying official university digital signatures on native PDF certificates.
    * *Project Usage:* Discussed in digital signature analysis (`docs/DESIGN.md`).

91. **QR-Code Hijacking (Swapping)**
    * *Simple:* Copying a real QR code from a genuine degree and pasting it onto a fake certificate.
    * *Technical:* Forgery attack where a valid cryptographic QR matrix is extracted from an authentic document and composited onto a counterfeit document with altered visual text.
    * *Example:* Pasting Alice's authentic VTU QR code onto Bob's forged marks card.
    * *Project Usage:* Detected via automated cross-matching in `src/deterministic_checks.py`.

92. **Blockchain**
    * *Simple:* An unchangeable shared digital ledger that records transactions across thousands of computers.
    * *Technical:* Decentralized, distributed, append-only ledger of cryptographic blocks linked via hash pointers and maintained via consensus protocols (PoW, PoS).
    * *Example:* Recording an immutable anchor of a degree certificate hash.
    * *Project Usage:* Evaluated in literature survey (`Chapter 2`).

93. **Smart Contract**
    * *Simple:* Self-executing computer programs running on a blockchain that enforce rules automatically.
    * *Technical:* Turing-complete programs deployed to an immutable ledger address executing deterministic state transitions upon receiving signed transactions.
    * *Example:* A university smart contract minting an educational Soulbound Token (SBT).
    * *Project Usage:* Proposed in Phase 22 architecture.

94. **Phishing Domain Spoofing**
    * *Simple:* Creating a fake university website that looks real to trick people into believing a fake degree.
    * *Technical:* Social engineering and network attack registering deceptive typosquatted domain names (e.g., `vtu-verification.com`) to host counterfeit verification databases.
    * *Example:* A forged certificate printing a QR code linking to an attacker's fake lookup portal.
    * *Project Usage:* Defeated by `ACCREDITED_DOMAINS_WHITELIST` in `src/deterministic_checks.py`.

95. **Role-Based Access Control (RBAC)**
    * *Simple:* Giving users permission to see only what their job allows.
    * *Technical:* Security policy restricting system authorization based on predefined organizational roles (`student`, `institution_verifier`, `admin`).
    * *Example:* Preventing students from accessing raw fraud vector analysis logic or admin templates.
    * *Project Usage:* `backend/app/api/deps.py` (`require_admin_role`).

---

### Group 8: Software Testing & Quality Assurance (Terms 96–100)

96. **Unit Testing**
    * *Simple:* Testing individual small functions one by one to ensure they work in isolation.
    * *Technical:* Verification practice testing individual software units (functions, methods, classes) isolated from external databases or networks using mock fixtures.
    * *Example:* Testing `compute_ssim_score()` on two identical images to verify it returns `1.0`.
    * *Project Usage:* `tests/test_qr_and_extractor.py`.

97. **Integration Testing**
    * *Simple:* Testing whether different modules fit together and communicate without errors.
    * *Technical:* Quality assurance phase evaluating the flow of data between interconnected subsystems (e.g., frontend API contracts, database queries, and ML feature passing).
    * *Example:* Verifying that `pipeline_orchestrator.py` correctly passes OCR fields to the ML engine.
    * *Project Usage:* `test_e2e_contract.py`.

98. **Regression Testing**
    * *Simple:* Running all tests again after fixing a bug to make sure you didn't accidentally break anything else.
    * *Technical:* Selective re-execution of test suites confirming that recent code changes or bug fixes have not degraded existing functional or non-functional baselines.
    * *Example:* Re-running `npm test` after editing `vite.config.ts` to ensure all 45 UI tests still pass.
    * *Project Usage:* Executed during our development verification turns.

99. **Mocking / Test Fixture**
    * *Simple:* Using fake data or simulated servers during testing to avoid touching real databases.
    * *Technical:* Creating simulated objects mimicking the behavior of real dependencies (databases, external HTTP endpoints) to ensure deterministic, fast test execution.
    * *Example:* Mocking the university verification server using an in-memory dictionary.
    * *Project Usage:* `frontend/src/tests/setup.ts`.

100. **Test Coverage**
     * *Simple:* The percentage of your software's code that was actually tested by automated test scripts.
     * *Technical:* Metric quantifying the degree to which source code lines, branches, and execution paths are executed by automated test suites: $\frac{\text{Executed Lines}}{\text{Total Lines}} \times 100\%$.
     * *Example:* Generating a test coverage report via `pytest --cov=backend/app`.
     * *Project Usage:* `pytest-cov` declared in `backend/pyproject.toml`.
