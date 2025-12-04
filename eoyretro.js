import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// CLEAN RESET VERSION — journaling only + animated summary map
export default function YearlyRecapRetro() {
  const [view, setView] = useState("landing");
  const [playerIndex, setPlayerIndex] = useState(null);
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [showMapAnimation, setShowMapAnimation] = useState(false);

  const players = [
    { name: "Sarah", avatar: "🐱" },
    { name: "Alexandre", avatar: "😼" },
    { name: "Mathieu", avatar: "🐈" },
    { name: "Keven", avatar: "😺" },
    { name: "Christopher", avatar: "🐾" }
  ];

  const questions = [
    { key: "flowers", island: "🌺 Flowers", prompt: "What brought you joy this year?" },
    { key: "rocks", island: "🪨 Rocks", prompt: "What challenges or obstacles did you face this year?" },
    { key: "water", island: "💧 Water", prompt: "What would you like to let go of from this year?" },
    { key: "weather", island: "🌤️ Weather", prompt: "Describe the overall vibe or energy of your year." },
    { key: "seeds", island: "🌱 Seeds", prompt: "What intentions or goals do you want to plant for next year?" }
  ];

  const [responses, setResponses] = useState({
    Sarah:{}, Alexandre:{}, Mathieu:{}, Keven:{}, Christopher:{}
  });

  const currentPlayer = playerIndex !== null ? players[playerIndex] : null;
  const currentQ = questions[step];

  useEffect(() => {
    if (view !== "journaling") return;
    const t = setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [view]);

  const updateAnswer = (v) => {
    if (!currentPlayer) return;
    setResponses(prev => ({
      ...prev,
      [currentPlayer.name]: {
        ...prev[currentPlayer.name],
        [currentQ.island]: v
      }
    }));
  };

  const nextQuestion = () => {
    if (step + 1 < questions.length) setStep(step + 1);
    else setView("summaryPending");
  };

  const triggerSummary = () => {
    // Only Sarah triggers summary
    if (currentPlayer?.name !== "Sarah") return;
    setShowMapAnimation(true);
    setTimeout(() => setView("summary"), 1500);
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <Card className="max-w-xl w-full p-6 bg-white/80 rounded-2xl shadow-xl backdrop-blur">
        <CardContent>

          {/* LANDING */}
          {view === "landing" && (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6">🏝️ Yearly Recap Retro</h1>
              <Button onClick={() => setView("playerSelect")}>Start Journaling</Button>
            </div>
          )}

          {/* PLAYER SELECT */}
          {view === "playerSelect" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Select Your Player</h2>
              {players.map((p, idx) => (
                <Button key={idx} className="w-full my-2" onClick={() => { setPlayerIndex(idx); setView("journaling"); setStep(0); }}>
                  {p.avatar} {p.name}
                </Button>
              ))}
            </div>
          )}

          {/* JOURNALING */}
          {view === "journaling" && currentPlayer && (
            <div>
              <h2 className="text-xl font-bold mb-2 text-center">{currentPlayer.avatar} {currentPlayer.name}</h2>
              <p className="text-center mb-4">Time Remaining: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</p>

              <h3 className="font-bold mb-2">{currentQ.prompt}</h3>
              <textarea
                className="w-full border rounded-xl p-3 mb-4"
                rows={5}
                value={responses[currentPlayer.name]?.[currentQ.island] || ""}
                onChange={(e) => updateAnswer(e.target.value)}
              />

              <Button className="w-full" onClick={nextQuestion}>Next</Button>
            </div>
          )}

          {/* SUMMARY PENDING — SARAH ONLY */}
          {view === "summaryPending" && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">You're Done!</h2>
              {currentPlayer?.name === "Sarah" ? (
                <Button className="w-full" onClick={triggerSummary}>Generate Team Summary</Button>
              ) : (
                <p className="text-gray-600">Waiting for Sarah to generate the summary…</p>
              )}
            </div>
          )}

          {/* SUMMARY MAP WITH ANIMATION */}
          {view === "summary" && (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Team Reflection Map</h2>

              <div className="relative w-full h-64 bg-purple-200 rounded-xl overflow-hidden">
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={showMapAnimation ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: idx * 0.3 }}
                    className="p-3 bg-white shadow rounded-xl absolute left-4 right-4"
                    style={{ top: 20 + idx * 55 }}
                  >
                    <h3 className="font-bold">{q.island}</h3>
                    <p className="text-xs italic text-gray-500 mb-2">{q.prompt}</p>
                    {Object.entries(responses).map(([player, data]) => (
                      <p key={player}><strong>{player}:</strong> {data[q.island] || "—"}</p>
                    ))}
                  </motion.div>
                ))}
              </div>

              <Button className="w-full mt-4" onClick={() => setView("landing")}>Back to Menu</Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
