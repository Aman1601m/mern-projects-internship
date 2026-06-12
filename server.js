import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

// middleware
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});

app.use(limiter);