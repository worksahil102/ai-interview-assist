import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

function CircularProgress({ score }) {
  const radius = 65;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(score * 10, 100);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getMessage = () => {
    if (score >= 8)
      return {
        title: "Excellent interview performance",
        sub: "You're ready for interviews.",
      };

    if (score >= 6)
      return {
        title: "Needs minor improvement before interviews.",
        sub: "Good foundation, refine articulation.",
      };

    if (score >= 4)
      return {
        title: "Average performance",
        sub: "Practice more real interview questions.",
      };

    return {
      title: "Needs significant improvement",
      sub: "Keep practicing consistently.",
    };
  };

  const msg = getMessage();

  return (
    <>
      <div className="flex justify-center ">
        <svg width="100%" height="100" viewBox="0 0 170 170">
          <circle
            stroke="#ECECEC"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="85"
            cy="85"
          />
          <circle
            stroke="#10B981"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "0.8s",
            }}
            r={normalizedRadius}
            cx="85"
            cy="85"
            transform="rotate(-90 85 85)"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="8"
            className="fill-red-400 text-2xl font-bold"
          >
            {score.toFixed(1)}/10
          </text>
        </svg>
      </div>

      <p className="text-center text-gray-500 mt-2">Out of 10</p>

      <h2 className="font-bold text-md mt-6 text-center">{msg.title}</h2>

      <p className="text-center text-gray-500 mt-1">{msg.sub}</p>
    </>
  );
}

function SkillBar({ title, value }) {
  return (
    <div className="mb-7">
      <div className="flex justify-between mb-2">
        <p className="font-medium">{title}</p>

        <p className="font-semibold text-emerald-600">{value.toFixed(1)}</p>
      </div>

      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all"
          style={{
            width: `${value * 10}%`,
          }}
        />
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  let bg = "bg-red-100 text-red-600";

  if (score >= 7) {
    bg = "bg-green-100 text-green-600";
  } else if (score >= 5) {
    bg = "bg-yellow-100 text-yellow-600";
  }

  return (
    <div className={`px-5 py-2 rounded-full font-bold ${bg}`}>{score}/10</div>
  );
}

function Step3Report({ report }) {
  console.log("REPORT ==========:", report);

  if (!report) return null;

  const {
    finalScore,
    confidence,
    communication,
    correctness,
    questionWiseScore,
  } = report;

  const chartData = questionWiseScore.map((q, i) => ({
    name: `Q${i + 1}`,
    score: q.score,
  }));
  console.log("chart data", chartData);
  return (
    <div className="min-h-screen bg-[#f7fbf9] p-4 md:p-6 lg:px-20 lg:py-10">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5 mb-8">
        <div className="flex items-start gap-4">
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow flex justify-center items-center">
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold text-gray-800">
              Interview Analytics Dashboard
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-lg">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 md:px-8 py-3 md:py-4 lg:px-4  lg:py-2  rounded-xl shadow-lg flex justify-center items-center gap-3">
          <FaDownload />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {" "}
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-center text-gray-500 text-lg">
              Overall Performance
            </h3>

            <CircularProgress score={finalScore} />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-8">Skill Evaluation</h2>

            <SkillBar title="Confidence" value={confidence} />

            <SkillBar title="Communication" value={communication} />

            <SkillBar title="Correctness" value={correctness} />
          </div>
        </div>
        {/* RIGHT */}
        <div className="lg:col-span-8 space-y-6">
          {/* Performance Trend */}

          <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 h-60 md:h-80 w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Performance Trend
            </h2>

            <ResponsiveContainer width="100%" width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />

                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" />

                <XAxis dataKey="name" axisLine={false} tickLine={false} />

                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={4}
                  fill="url(#green)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Question Analysis */}

          <div className="bg-white rounded-xl shadow-xl px-6 py-3">
            <h2 className="text-2xl font-bold mb-3">Question Analysis</h2>

            <div className="space-y-6">
              {questionWiseScore.map((item, index) => (
                <div
                  key={index}
                  className="border-gray-300 border rounded-xl p-2 md:p-4 hover:shadow-xl transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-emerald-600 font-semibold mb-2">
                        Question {index + 1}
                      </p>

                      <h3 className="font-semibold text-base md:text-lg lg:text-xs text-gray-800 leading-7">
                        {item.question}
                      </h3>
                    </div>

                    <ScoreBadge
                      score={item.score}
                      className={`self-start sm:self-auto px-4 md:px-5 py-2 rounded-full font-bold`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <div className="bg-gray-50 rounded-xl flex justify-center items-center py-1">
                      <p className="text-sm text-gray-500">Confidence :</p>

                      <span className="text-xl md:text-xl font-bold text-green-600 ml-3 ">
                        {item.confidence}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl flex justify-center items-center">
                      <p className="text-sm text-gray-500">Communication : </p>

                      <h4 className="text-xl md:text-xl font-bold text-green-600 ml-3">
                        {item.communication}
                      </h4>
                    </div>

                    <div className="bg-gray-50 rounded-xl flex justify-center items-center">
                      <p className="text-sm text-gray-500">Correctness :</p>

                      <h4 className="text-xl md:text-xl font-bold text-green-600 ml-3">
                        {item.correctness}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-2 bg-green-50 border lg:text-xs border-green-200 rounded-xl p-4 md:py-1">
                    <h4 className="text-gray-700 text-sm md:text-base text-green-600  lg:text-xs">
                      AI Feedback
                    </h4>

                    <p className="text-gray-700 leading-7">{item.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
