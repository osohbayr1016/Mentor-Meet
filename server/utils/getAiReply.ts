import { OpenAI } from "openai";
import { IntentType } from "./detectIntent";

// =======================
// Interfaces
// =======================
export interface StudentProfile {
  name?: string;
  email: string;
  phoneNumber?: string;
  goal?: string;
  level?: string;
}

export interface Feedback {
  studentEmail: string;
  mentorId: string;
  rating: number; // 1-5
  comment?: string;
  date: string; // ISO date string
}

export interface MentorInfo {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profession?: string;
  experience?: {
    careerDuration?: string;
  };
  category?: {
    categoryId?: string;
  };
  feedbacks?: Feedback[];
  averageRating?: number;
}

export const calculateAverageRating = (feedbacks?: Feedback[]): number => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
  return parseFloat((sum / feedbacks.length).toFixed(2));
};

// analyzeMentorQuality функц нь зөвхөн feedback дүн шинжилгээнд зориулагдсан
// Одоогийн AI хариу системд ашиглахгүй байна
// const analyzeMentorQuality = async (feedbacks: Feedback[]): Promise<string> => {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
//   const comments = feedbacks.map(fb => fb.comment).filter(Boolean).join("\n");

//   const prompt = `
//   Та дараах менторын сэтгэгдэлүүдийг уншаад чанарын талаар товч дүгнэлт өгнө үү:
//   ${comments}
//   `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: "Та менторын чанарын шинжээч юм." },
//       { role: "user", content: prompt },
//     ],
//     temperature: 0.5,
//   });

//   return response.choices[0].message.content || "Дүгнэлт авах боломжгүй байна.";
// };

// =======================
// Category keyword map
// =======================
export const categoryKeywordMap: Record<string, string[]> = {
  "Программчлал ба Технологи": [
    "программ",
    "код",
    "technology",
    "developer",
    "software",
    "software engineer",
    "технологи",
    "javascript",
    "python",
    "java",
    "c++",
    "web development",
    "app development",
    "mobile app",
    "frontend",
    "backend",
    "fullstack",
    "database",
    "sql",
    "nosql",
    "api",
    "react",
    "angular",
    "vue",
    "node.js",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "flutter",
    "react native",
  ],
  Дизайн: [
    "дизайн",
    "график",
    "ux",
    "ui",
    "design",
    "photoshop",
    "illustrator",
    "figma",
    "sketch",
  ],
  "Бизнес ба Менежмент": [
    "бизнес",
    "менежмент",
    "startup",
    "business",
    "project management",
    "product management",
  ],
  Маркетинг: [
    "маркетинг",
    "зар",
    "сошиал",
    "marketing",
    "digital marketing",
    "social media",
    "seo",
    "sem",
  ],
  Санхүү: [
    "санхүү",
    "мөнгө",
    "төсөв",
    "finance",
    "accounting",
    "investment",
    "banking",
  ],
  Инженерчлэл: [
    "инженер",
    "инженерчлэл",
    "engineer",
    "engineering",
    "mechanical",
    "electrical",
    "civil engineering",
    "mechanical engineer",
    "electrical engineer",
    "civil engineer",
    "software engineer",
    "hardware engineer",
    "system engineer",
    "network engineer",
    "data engineer",
    "devops engineer",
    "cloud engineer",
    "security engineer",
    "robotics engineer",
    "automation engineer",
    "process engineer",
    "quality engineer",
    "test engineer",
    "reliability engineer",
    "maintenance engineer",
    "project engineer",
    "field engineer",
    "application engineer",
    "sales engineer",
    "support engineer",
    "research engineer",
    "design engineer",
    "product engineer",
    "manufacturing engineer",
    "industrial engineer",
    "chemical engineer",
    "biomedical engineer",
    "environmental engineer",
    "structural engineer",
    "transportation engineer",
    "geotechnical engineer",
    "water resources engineer",
    "construction engineer",
    "mining engineer",
    "petroleum engineer",
    "nuclear engineer",
    "aerospace engineer",
    "marine engineer",
    "ocean engineer",
    "materials engineer",
    "metallurgical engineer",
    "ceramic engineer",
    "polymer engineer",
    "textile engineer",
    "food engineer",
    "agricultural engineer",
    "forestry engineer",
    "fisheries engineer",
    "energy engineer",
    "power engineer",
    "control engineer",
    "instrumentation engineer",
    "telecommunications engineer",
    "optical engineer",
    "photonics engineer",
    "semiconductor engineer",
    "microelectronics engineer",
    "vlsi engineer",
    "embedded engineer",
    "firmware engineer",
    "hardware design engineer",
    "pcb engineer",
    "rf engineer",
    "antenna engineer",
    "satellite engineer",
    "wireless engineer",
    "mobile engineer",
    "web engineer",
    "frontend engineer",
    "backend engineer",
    "fullstack engineer",
    "database engineer",
    "data scientist engineer",
    "machine learning engineer",
    "ai engineer",
    "deep learning engineer",
    "computer vision engineer",
    "nlp engineer",
    "robotics engineer",
    "autonomous systems engineer",
    "game engineer",
    "graphics engineer",
    "audio engineer",
    "video engineer",
    "streaming engineer",
    "network security engineer",
    "cybersecurity engineer",
    "information security engineer",
    "penetration testing engineer",
    "forensic engineer",
    "compliance engineer",
    "privacy engineer",
    "blockchain engineer",
    "cryptocurrency engineer",
    "fintech engineer",
    "quantitative engineer",
    "algorithm engineer",
    "optimization engineer",
    "simulation engineer",
    "modeling engineer",
    "analytics engineer",
    "business intelligence engineer",
    "etl engineer",
    "data warehouse engineer",
    "big data engineer",
    "distributed systems engineer",
    "scalability engineer",
    "performance engineer",
    "load testing engineer",
    "stress testing engineer",
    "chaos engineering engineer",
    "site reliability engineer",
    "platform engineer",
    "infrastructure engineer",
    "systems administrator engineer",
    "network administrator engineer",
    "database administrator engineer",
    "security administrator engineer",
    "cloud architect engineer",
    "solution architect engineer",
    "enterprise architect engineer",
    "technical architect engineer",
    "application architect engineer",
    "data architect engineer",
    "integration engineer",
    "api engineer",
    "middleware engineer",
    "messaging engineer",
    "queue engineer",
    "cache engineer",
    "search engineer",
    "recommendation engineer",
    "personalization engineer",
    "a/b testing engineer",
    "experimentation engineer",
    "feature flag engineer",
    "configuration engineer",
    "deployment engineer",
    "release engineer",
    "build engineer",
    "ci/cd engineer",
    "automation testing engineer",
    "quality assurance engineer",
    "test automation engineer",
    "manual testing engineer",
    "user acceptance testing engineer",
    "regression testing engineer",
    "performance testing engineer",
    "security testing engineer",
    "penetration testing engineer",
    "vulnerability assessment engineer",
    "code review engineer",
    "static analysis engineer",
    "dynamic analysis engineer",
    "fuzzing engineer",
    "reverse engineering engineer",
    "malware analysis engineer",
    "threat hunting engineer",
    "incident response engineer",
    "digital forensics engineer",
    "compliance audit engineer",
    "risk assessment engineer",
    "business continuity engineer",
    "disaster recovery engineer",
    "backup engineer",
    "storage engineer",
    "backup and recovery engineer",
    "data protection engineer",
    "privacy protection engineer",
    "gdpr compliance engineer",
    "data governance engineer",
    "data lineage engineer",
    "data catalog engineer",
    "metadata engineer",
    "data modeling engineer",
    "schema design engineer",
    "database design engineer",
    "data migration engineer",
    "data transformation engineer",
    "data validation engineer",
    "data quality engineer",
    "master data management engineer",
    "reference data engineer",
    "data integration engineer",
    "data synchronization engineer",
    "real-time data engineer",
    "streaming data engineer",
    "batch processing engineer",
    "event processing engineer",
    "complex event processing engineer",
    "rule engine engineer",
    "workflow engine engineer",
    "business process engineer",
    "process automation engineer",
    "robotic process automation engineer",
    "intelligent automation engineer",
    "cognitive automation engineer",
    "decision automation engineer",
    "knowledge management engineer",
    "expert system engineer",
    "ontology engineer",
    "semantic web engineer",
    "linked data engineer",
    "graph database engineer",
    "knowledge graph engineer",
    "natural language processing engineer",
    "computational linguistics engineer",
    "speech recognition engineer",
    "text-to-speech engineer",
    "speech-to-text engineer",
    "voice assistant engineer",
    "chatbot engineer",
    "conversational ai engineer",
    "dialogue system engineer",
    "intent recognition engineer",
    "entity extraction engineer",
    "sentiment analysis engineer",
    "emotion detection engineer",
    "facial recognition engineer",
    "biometric engineer",
    "fingerprint recognition engineer",
    "iris recognition engineer",
    "voice recognition engineer",
    "gait recognition engineer",
    "behavioral biometrics engineer",
    "multimodal biometrics engineer",
    "fusion biometrics engineer",
    "template matching engineer",
    "pattern recognition engineer",
    "signal processing engineer",
    "digital signal processing engineer",
    "image processing engineer",
    "video processing engineer",
    "audio processing engineer",
    "speech processing engineer",
    "radar signal processing engineer",
    "sonar signal processing engineer",
    "seismic signal processing engineer",
    "medical signal processing engineer",
    "biomedical signal processing engineer",
    "ecg signal processing engineer",
    "eeg signal processing engineer",
    "emg signal processing engineer",
    "eog signal processing engineer",
    "ppg signal processing engineer",
    "respiratory signal processing engineer",
    "blood pressure signal processing engineer",
    "temperature signal processing engineer",
    "accelerometer signal processing engineer",
    "gyroscope signal processing engineer",
    "magnetometer signal processing engineer",
    "gps signal processing engineer",
    "gnss signal processing engineer",
    "satellite navigation engineer",
    "inertial navigation engineer",
    "dead reckoning engineer",
    "sensor fusion engineer",
    "kalman filter engineer",
    "particle filter engineer",
    "bayesian filter engineer",
    "adaptive filter engineer",
    "wiener filter engineer",
    "matched filter engineer",
    "correlation filter engineer",
    "convolution filter engineer",
    "fourier transform engineer",
    "wavelet transform engineer",
    "hilbert transform engineer",
    "laplace transform engineer",
    "z-transform engineer",
    "discrete cosine transform engineer",
    "fast fourier transform engineer",
    "short-time fourier transform engineer",
    "spectrogram engineer",
    "power spectral density engineer",
    "cross-spectral density engineer",
    "coherence engineer",
    "phase engineer",
    "amplitude engineer",
    "frequency engineer",
    "wavelength engineer",
    "period engineer",
    "harmonic engineer",
    "fundamental frequency engineer",
    "overtone engineer",
    "resonance engineer",
    "damping engineer",
    "attenuation engineer",
    "amplification engineer",
    "gain engineer",
    "loss engineer",
    "noise engineer",
    "signal-to-noise ratio engineer",
    "carrier-to-noise ratio engineer",
    "bit error rate engineer",
    "packet error rate engineer",
    "frame error rate engineer",
    "block error rate engineer",
    "symbol error rate engineer",
    "word error rate engineer",
    "character error rate engineer",
    "levenshtein distance engineer",
    "hamming distance engineer",
    "edit distance engineer",
    "jaccard similarity engineer",
    "cosine similarity engineer",
    "euclidean distance engineer",
    "manhattan distance engineer",
    "chebyshev distance engineer",
    "minkowski distance engineer",
    "mahalanobis distance engineer",
    "bhattacharyya distance engineer",
    "kullback-leibler divergence engineer",
    "jensen-shannon divergence engineer",
    "wasserstein distance engineer",
    "earth mover's distance engineer",
    "hausdorff distance engineer",
    "frechet distance engineer",
    "dynamic time warping engineer",
    "longest common subsequence engineer",
    "longest common substring engineer",
    "sequence alignment engineer",
    "global alignment engineer",
    "local alignment engineer",
    "pairwise alignment engineer",
    "multiple sequence alignment engineer",
    "progressive alignment engineer",
    "iterative alignment engineer",
    "consensus sequence engineer",
    "profile engineer",
    "hidden markov model engineer",
    "viterbi algorithm engineer",
    "baum-welch algorithm engineer",
    "forward algorithm engineer",
    "backward algorithm engineer",
    "expectation maximization engineer",
    "gibbs sampling engineer",
    "metropolis-hastings engineer",
    "monte carlo engineer",
    "bootstrap engineer",
    "jackknife engineer",
    "cross-validation engineer",
    "k-fold cross-validation engineer",
    "leave-one-out engineer",
    "stratified sampling engineer",
    "random sampling engineer",
    "systematic sampling engineer",
    "cluster sampling engineer",
    "multistage sampling engineer",
    "probability sampling engineer",
    "non-probability sampling engineer",
    "convenience sampling engineer",
    "quota sampling engineer",
    "snowball sampling engineer",
    "purposive sampling engineer",
    "theoretical sampling engineer",
    "maximum variation sampling engineer",
    "homogeneous sampling engineer",
    "typical case sampling engineer",
    "extreme case sampling engineer",
    "critical case sampling engineer",
    "negative case sampling engineer",
    "opportunistic sampling engineer",
    "mixed sampling engineer",
    "sequential sampling engineer",
    "adaptive sampling engineer",
    "active learning engineer",
    "semi-supervised learning engineer",
    "unsupervised learning engineer",
    "supervised learning engineer",
    "reinforcement learning engineer",
    "deep reinforcement learning engineer",
    "inverse reinforcement learning engineer",
    "imitation learning engineer",
    "apprenticeship learning engineer",
    "behavioral cloning engineer",
    "generative adversarial network engineer",
    "variational autoencoder engineer",
    "flow-based model engineer",
    "energy-based model engineer",
    "score-based model engineer",
    "diffusion model engineer",
    "normalizing flow engineer",
    "autoregressive model engineer",
    "transformer engineer",
    "attention mechanism engineer",
    "self-attention engineer",
    "multi-head attention engineer",
    "cross-attention engineer",
    "relative attention engineer",
    "sparse attention engineer",
    "linear attention engineer",
    "performer engineer",
    "reformer engineer",
    "longformer engineer",
    "bigbird engineer",
    "linformer engineer",
    "synthesizer engineer",
    "switch transformer engineer",
    "mixture of experts engineer",
    "sparse mixture of experts engineer",
    "gated linear unit engineer",
    "highway network engineer",
    "residual network engineer",
    "dense network engineer",
    "u-net engineer",
    "v-net engineer",
    "segnet engineer",
    "deeplab engineer",
    "mask r-cnn engineer",
    "faster r-cnn engineer",
    "yolo engineer",
    "ssd engineer",
    "retinanet engineer",
    "efficientdet engineer",
    "centernet engineer",
    "cornernet engineer",
    "fcos engineer",
    "atss engineer",
    "foveabox engineer",
    "reppoints engineer",
    "freeanchor engineer",
    "guided anchoring engineer",
    "dynamic r-cnn engineer",
    "cascade r-cnn engineer",
    "htc engineer",
    "hybrid task cascade engineer",
    "panoptic segmentation engineer",
    "instance segmentation engineer",
    "semantic segmentation engineer",
    "panoptic deeplab engineer",
    "mask2former engineer",
    "maskformer engineer",
    "k-net engineer",
    "swin transformer engineer",
    "vision transformer engineer",
    "data-efficient image transformer engineer",
    "deit engineer",
    "cait engineer",
    "tnt engineer",
    "crossvit engineer",
    "nest engineer",
    "convit engineer",
    "cvt engineer",
    "t2t vit engineer",
    "pit engineer",
    "levit engineer",
    "mobilevit engineer",
    "efficientvit engineer",
    "fastvit engineer",
    "tinyvit engineer",
    "minivit engineer",
    "flexivit engineer",
    "maxvit engineer",
    "coatnet engineer",
    "convnext engineer",
    "repvgg engineer",
    "regnet engineer",
    "efficientnet engineer",
    "mobilenet engineer",
    "shufflenet engineer",
    "squeezenet engineer",
    "densenet engineer",
    "resnext engineer",
    "senet engineer",
    "sknet engineer",
    "cbam engineer",
    "eca engineer",
    "se engineer",
    "ge engineer",
    "gc engineer",
    "non-local engineer",
    "relation network engineer",
    "graph neural network engineer",
    "message passing engineer",
    "graph attention network engineer",
    "graph convolutional network engineer",
    "graphsage engineer",
    "gin engineer",
    "diffpool engineer",
    "edgeconv engineer",
    "dynamic graph cnn engineer",
    "pointnet engineer",
    "pointnet++ engineer",
    "pointconv engineer",
    "pointcnn engineer",
    "dgcnn engineer",
    "rs-cnn engineer",
    "point transformer engineer",
    "point cloud engineer",
    "3d vision engineer",
    "stereo vision engineer",
    "multi-view stereo engineer",
    "structure from motion engineer",
    "simultaneous localization and mapping engineer",
    "visual odometry engineer",
    "visual inertial odometry engineer",
    "visual slam engineer",
    "orb-slam engineer",
    "lsd-slam engineer",
    "dtam engineer",
    "kinectfusion engineer",
    "elasticfusion engineer",
    "surfelmeshing engineer",
    "bundlefusion engineer",
    "infinitam engineer",
    "voxelnet engineer",
    "pointpillars engineer",
    "second engineer",
    "pointrcnn engineer",
    "voxel r-cnn engineer",
    "part-a2 engineer",
    "centerpoint engineer",
    "smoke engineer",
    "monocon engineer",
    "monoflex engineer",
    "monopair engineer",
    "monogrnet engineer",
    "monoscene engineer",
    "monoloco engineer",
    "monoloco++ engineer",
    "monstereo engineer",
    "pseudo-lidar engineer",
    "pseudo-lidar++ engineer",
    "pseudo-lidar end-to-end engineer",
    "pseudo-lidar with depth hints engineer",
    "pseudo-lidar with semantic guidance engineer",
    "pseudo-lidar with geometric constraints engineer",
    "pseudo-lidar with temporal consistency engineer",
    "pseudo-lidar with multi-scale fusion engineer",
    "pseudo-lidar with attention mechanism engineer",
    "pseudo-lidar with transformer engineer",
    "pseudo-lidar with graph neural network engineer",
    "pseudo-lidar with point cloud engineer",
    "pseudo-lidar with voxel engineer",
    "pseudo-lidar with pillar engineer",
    "pseudo-lidar with range view engineer",
    "pseudo-lidar with bird's eye view engineer",
    "pseudo-lidar with perspective view engineer",
    "pseudo-lidar with multi-view engineer",
    "pseudo-lidar with stereo engineer",
    "pseudo-lidar with monocular engineer",
    "pseudo-lidar with rgb engineer",
    "pseudo-lidar with depth engineer",
    "pseudo-lidar with optical flow engineer",
    "pseudo-lidar with scene flow engineer",
    "pseudo-lidar with motion engineer",
    "pseudo-lidar with trajectory engineer",
    "pseudo-lidar with prediction engineer",
    "pseudo-lidar with forecasting engineer",
    "pseudo-lidar with planning engineer",
    "pseudo-lidar with control engineer",
    "pseudo-lidar with navigation engineer",
    "pseudo-lidar with localization engineer",
    "pseudo-lidar with mapping engineer",
    "pseudo-lidar with reconstruction engineer",
    "pseudo-lidar with completion engineer",
    "pseudo-lidar with upsampling engineer",
    "pseudo-lidar with downsampling engineer",
    "pseudo-lidar with filtering engineer",
    "pseudo-lidar with denoising engineer",
    "pseudo-lidar with enhancement engineer",
    "pseudo-lidar with restoration engineer",
    "pseudo-lidar with super-resolution engineer",
    "pseudo-lidar with compression engineer",
    "pseudo-lidar with quantization engineer",
    "pseudo-lidar with pruning engineer",
    "pseudo-lidar with distillation engineer",
    "pseudo-lidar with knowledge transfer engineer",
    "pseudo-lidar with domain adaptation engineer",
    "pseudo-lidar with transfer learning engineer",
    "pseudo-lidar with few-shot learning engineer",
    "pseudo-lidar with zero-shot learning engineer",
    "pseudo-lidar with one-shot learning engineer",
    "pseudo-lidar with meta-learning engineer",
    "pseudo-lidar with lifelong learning engineer",
    "pseudo-lidar with continual learning engineer",
    "pseudo-lidar with incremental learning engineer",
    "pseudo-lidar with online learning engineer",
    "pseudo-lidar with batch learning engineer",
    "pseudo-lidar with stochastic gradient descent engineer",
    "pseudo-lidar with adam engineer",
    "pseudo-lidar with rmsprop engineer",
    "pseudo-lidar with adagrad engineer",
    "pseudo-lidar with momentum engineer",
    "pseudo-lidar with nesterov momentum engineer",
    "pseudo-lidar with adadelta engineer",
    "pseudo-lidar with adamax engineer",
    "pseudo-lidar with nadam engineer",
    "pseudo-lidar with amsgrad engineer",
    "pseudo-lidar with radam engineer",
    "pseudo-lidar with lookahead engineer",
    "pseudo-lidar with rectified adam engineer",
    "pseudo-lidar with yellowfin engineer",
    "pseudo-lidar with qhadam engineer",
    "pseudo-lidar with apollo engineer",
    "pseudo-lidar with adabound engineer",
    "pseudo-lidar with amsbound engineer",
    "pseudo-lidar with padam engineer",
    "pseudo-lidar with diffgrad engineer",
    "pseudo-lidar with lamb engineer",
    "pseudo-lidar with novograd engineer",
    "pseudo-lidar with ranger engineer",
    "pseudo-lidar with rangerqlh engineer",
    "pseudo-lidar with madgrad engineer",
    "pseudo-lidar with lion engineer",
    "pseudo-lidar with sophia engineer",
    "pseudo-lidar with sophiag engineer",
    "pseudo-lidar with sophiah engineer",
    "pseudo-lidar with sophiaa engineer",
    "pseudo-lidar with sophiab engineer",
    "pseudo-lidar with sophiac engineer",
    "pseudo-lidar with sophiad engineer",
    "pseudo-lidar with sophiae engineer",
    "pseudo-lidar with sophiaf engineer",
    "pseudo-lidar with sophiag engineer",
    "pseudo-lidar with sophiah engineer",
    "pseudo-lidar with sophiai engineer",
    "pseudo-lidar with sophiaj engineer",
    "pseudo-lidar with sophiak engineer",
    "pseudo-lidar with sophial engineer",
    "pseudo-lidar with sophiam engineer",
    "pseudo-lidar with sophian engineer",
    "pseudo-lidar with sophiao engineer",
    "pseudo-lidar with sophiap engineer",
    "pseudo-lidar with sophiaq engineer",
    "pseudo-lidar with sophiar engineer",
    "pseudo-lidar with sophias engineer",
    "pseudo-lidar with sophiat engineer",
    "pseudo-lidar with sophiau engineer",
    "pseudo-lidar with sophiav engineer",
    "pseudo-lidar with sophiaw engineer",
    "pseudo-lidar with sophiax engineer",
    "pseudo-lidar with sophiay engineer",
    "pseudo-lidar with sophiaz engineer",
  ],
  "Аудио ба Дууны инженерчлэл": [
    "sound engineer",
    "sound engineering",
    "аудио",
    "дуу",
    "микшер",
    "recording",
    "studio",
    "music production",
    "хөгжмийн",
    "дууны",
    "аудио инженер",
    "дууны инженер",
    "studio engineer",
    "mixing",
    "mastering",
    "pro tools",
    "ableton",
    "logic pro",
    "cubase",
    "fl studio",
  ],
  "Хэлний орчуулга ба Хэл сургалт": [
    "орчуулагч",
    "орчуулга",
    "хэл",
    "translation",
    "translator",
    "interpreter",
    "language",
    "english",
    "mongolian",
    "chinese",
    "russian",
    "korean",
    "japanese",
    "german",
    "french",
    "spanish",
    "хэлний",
    "орчуулагч",
    "толмач",
  ],
  Урлаг: [
    "урлаг",
    "уран",
    "art",
    "painting",
    "drawing",
    "sculpture",
    "music",
    "dance",
    "theater",
  ],
  "Computer Science": [
    "computer",
    "cs",
    "informatics",
    "informatics",
    "algorithm",
    "data structure",
    "machine learning",
    "ai",
    "artificial intelligence",
  ],
  "Хууль ба Эрх зүй": ["хууль", "эрх", "law", "legal", "attorney", "lawyer"],
  "Спорт ба Фитнес": [
    "спорт",
    "фитнес",
    "exercise",
    "биеийн",
    "fitness",
    "gym",
    "workout",
    "training",
  ],
  "Захиргаа, хүний нөөц": [
    "захиргаа",
    "hr",
    "хүний нөөц",
    "human resources",
    "administration",
  ],
  "Барилга ба Архитектур": [
    "барилга",
    "архитектур",
    "construction",
    "architecture",
  ],
  "Уул уурхай": ["уул", "уурхай", "mining", "geology", "mineral"],
  "Аялал жуулчлал, хоол үйлдвэрлэл": [
    "аялал",
    "хоол",
    "жуулчлал",
    "tourism",
    "hotel",
    "restaurant",
    "cooking",
    "chef",
  ],
  "Гэрэл зураг": ["гэрэл", "зураг", "фото", "photo", "photography", "camera"],
  "Эрүүл мэнд ба Анагаах ухаан": [
    "эрүүл",
    "анагаах",
    "health",
    "эмч",
    "medical",
    "doctor",
    "nurse",
    "pharmacy",
  ],
  "Боловсрол ба Сургалт": [
    "сургалт",
    "боловсрол",
    "сургууль",
    "education",
    "teaching",
    "teacher",
    "tutor",
  ],
  "Хөдөө аж ахуй": [
    "хөдөө",
    "мал",
    "тарилга",
    "farmer",
    "agriculture",
    "farming",
  ],
  "Байгаль орчин": [
    "байгаль",
    "eco",
    "эколог",
    "тогтвортой",
    "environment",
    "ecology",
  ],
  "Тээвэр ба Логистик": [
    "тээвэр",
    "логистик",
    "ачаалал",
    "transport",
    "logistics",
    "supply chain",
  ],
  "Үйлчилгээ ба Худалдаа": [
    "үйлчилгээ",
    "худалдаа",
    "sales",
    "retail",
    "customer service",
  ],
  "Мэдээлэл ба Хэвлэл": [
    "мэдээлэл",
    "хэвлэл",
    "сэтгүүл",
    "media",
    "journalism",
    "news",
    "publishing",
  ],
  "Үйлдвэрлэл ба Технологи": [
    "үйлдвэр",
    "технологи",
    "техник",
    "manufacturing",
    "production",
  ],
  "Сэргээгдэх эрчим хүч": [
    "сэргээгдэх",
    "эрчим",
    "нар",
    "цахилгаан",
    "renewable energy",
    "solar",
    "wind",
  ],
  "Боловсрол, шинжлэх ухаан": [
    "шинжлэх",
    "science",
    "боловсрол",
    "research",
    "academic",
  ],
};

// =======================
// MAIN ENTRY
// =======================
export const getAiReply = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  const messageLower = userMessage.toLowerCase();

  try {
    // Хэрвээ гомдол, санал байвал шууд тусгай хариу буцаах
    if (isComplaintOrFeedback(messageLower)) {
      return getComplaintResponse();
    }

    if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
      return await getAIResponse(userMessage, intent, studentProfile, mentors);
    }

    return getRuleBasedResponseWithMentors(messageLower, mentors);
  } catch (error) {
    console.error("Error in getAiReply:", error);
    return getRuleBasedResponseWithMentors(messageLower, mentors);
  }
};

const complaintKeywords = [
  "гомдол",
  "санаа зовнил",
  "алдаа",
  "буруу",
  "санаа",
  "сэтгэл дундуур",
  "муу",
  "сэтгэл гонсойлгох",
  "санаа зовох",
];

const isComplaintOrFeedback = (message: string): boolean => {
  const msg = message.toLowerCase();
  return complaintKeywords.some((kw) => msg.includes(kw));
};

const getComplaintResponse = (): string => {
  return `Таны санал, гомдлыг хүлээн авлаа. Бид үүнийг сайжруулахад анхааралтай хандах болно. Таны үнэлгээ, зөвлөгөөг бид үнэлж байна. Баярлалаа!`;
};

// export const getAiReply = async (
//   userMessage: string,
//   intent?: IntentType,
//   studentProfile?: StudentProfile,
//   mentors?: MentorInfo[]
// ): Promise<string> => {
//   const messageLower = userMessage.toLowerCase();

//   try {
//     // Хэрвээ гомдол, санал байвал шууд тусгай хариу буцаах
//     if (isComplaintOrFeedback(messageLower)) {
//       return getComplaintResponse();
//     }

//     if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
//       return await getAIResponse(userMessage, intent, studentProfile, mentors);
//     }

//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   } catch (error) {
//     console.error("Error in getAiReply:", error);
//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   }
// };

// =======================
// Detect category dynamically
// =======================
const getCategoryFromMessage = (message: string): string | null => {
  for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
    if (keywords.some((kw) => message.includes(kw))) {
      return category;
    }
  }
  return null;
};

// =======================
// Get relevant mentors
// =======================
const getRelevantMentors = (
  message: string,
  mentors?: MentorInfo[]
): MentorInfo[] => {
  const matchedCategory = getCategoryFromMessage(message);
  if (!mentors) return [];

  // Хэрэв category олдсон бол тухайн category-ийн менторуудыг эхэнд тавих
  if (matchedCategory) {
    const categoryMentors = mentors.filter(
      (m) =>
        m.category?.categoryId?.toLowerCase() === matchedCategory.toLowerCase()
    );

    // Category-ийн менторууд байвал тэднийг эхэнд тавих
    if (categoryMentors.length > 0) {
      return categoryMentors.slice(0, 3);
    }
  }

  // Хэрэв category олдохгүй эсвэл тухайн category-ийн ментор байхгүй бол
  // бүх менторуудаас хамгийн тохирохыг сонгох
  const messageLower = message.toLowerCase();

  // Менторуудыг тохирох байдлаар эрэмбэлэх
  const scoredMentors = mentors.map((mentor) => {
    let score = 0;

    // Професс, bio, category-д keyword хайх
    const mentorText = [
      mentor.profession || "",
      mentor.bio || "",
      mentor.category?.categoryId || "",
      `${mentor.firstName || ""} ${mentor.lastName || ""}`,
    ]
      .join(" ")
      .toLowerCase();

    // Keyword-үүдийг шалгах
    for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
      for (const keyword of keywords) {
        if (messageLower.includes(keyword) && mentorText.includes(keyword)) {
          score += 2; // Тохирох keyword олдсон
        }
      }
    }

    // Category тохирсон бол нэмэлт оноо
    if (
      matchedCategory &&
      mentor.category?.categoryId?.toLowerCase() ===
        matchedCategory.toLowerCase()
    ) {
      score += 5;
    }

    return { mentor, score };
  });

  // Оноогоор эрэмбэлээд хамгийн тохирох 3-г авах
  return scoredMentors
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.mentor);
};

// =======================
// Format mentor text
// =======================
const formatMentorSuggestions = (
  mentors: MentorInfo[],
  category: string
): string => {
  if (!mentors.length) {
    return " Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  const list = mentors
    .map((m) => {
      const name = `${m.firstName || ""} ${m.lastName || ""}`.trim();
      const prof = m.profession || "Ментор";
      const exp = m.experience?.careerDuration
        ? `, ${m.experience.careerDuration} жил туршлагатай`
        : "";
      return `• ${name} (${prof}${exp})`;
    })
    .join("\n");

  return `\n\n${category} чиглэлээр санал болгох менторууд:\n${list}\n\nТэдний профайлыг үзэж холбогдоорой.`;
};

// =======================
// Rule-based fallback (dynamic)
// =======================
const getRuleBasedResponseWithMentors = (
  message: string,
  mentors?: MentorInfo[]
): string => {
  const category = getCategoryFromMessage(message);
  const relevantMentors = getRelevantMentors(message, mentors);
  const suggestions = formatMentorSuggestions(
    relevantMentors,
    category || "Ерөнхий"
  );

  if (category) {
    return `${category} чиглэлээр таны сонирхол илэрхийлэгдсэн байна.${suggestions}`;
  }

  return `Таны илгээсэн мэдээлэлд үндэслэн дараах менторуудыг санал болгож байна.${suggestions}`;
};

// =======================
// AI-powered reply
// =======================
const getAIResponse = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const studentInfo = studentProfile
    ? `Сурагчийн мэдээлэл:\n${JSON.stringify(studentProfile, null, 2)}`
    : "Сурагчийн мэдээлэл байхгүй.";

  const mentorsInfo = JSON.stringify(mentors || [], null, 2);

  const prompt = `
${studentInfo}

Менторуудын мэдээлэл:
${mentorsInfo}

Сурагчийн асуулт: "${userMessage}"
Intent: ${intent || "unknown"}

Чи Mentor Meet платформын AI туслах. Хэрэглэгчийн илгээсэн асуулт болон профайлын мэдээлэл дээр үндэслэн хамгийн тохирох ментор(ууд)-ыг санал болго. Яагаад тохирох талаар товч тайлбар өг. Хариултаа зөвхөн монголоор бич.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Чи Mentor Meet платформын туслах чатбот.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  return (
    response.choices[0].message.content ||
    "AI хариу боловсруулахад алдаа гарлаа."
  );
};

// =======================
// Simple rule-based only fallback
// =======================
export const getSimpleResponse = (message: string): string => {
  return getRuleBasedResponseWithMentors(message.toLowerCase());
};
