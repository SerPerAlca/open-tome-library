import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";

const PlayerConfig = () => {
  const navigate = useNavigate();
  const { initializeGame } = useGame();
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [step, setStep] = useState<"count" | "names">("count");

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill("").map((_, i) => playerNames[i] || ""));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleConfirmCount = () => {
    setStep("names");
  };

  const handleConfirmNames = () => {
    // Use default names if empty
    const finalNames = playerNames.map((name, i) =>
      name.trim() || `Jugador ${i + 1}`
    );
    initializeGame(finalNames);
    navigate("/seleccion-heroes");
  };

  const handleBack = () => {
    if (step === "names") {
      setStep("count");
    } else {
      navigate("/");
    }
  };

  const allNamesValid = playerNames.every((name, i) =>
    name.trim() !== "" || `Jugador ${i + 1}`
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Parchment-style container */}
      <div className="paper-texture paper-aged max-w-lg w-full p-8 md:p-12 rounded-sm shadow-2xl border-2 border-gold/30">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="text-gold text-2xl mb-2">☙</div>
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
            {step === "count" ? "Número de Aventureros" : "Nombres de los Héroes"}
          </h1>
          <div className="divider-ornament mx-auto max-w-xs" />
        </div>

        {step === "count" ? (
          /* Player count selection */
          <div className="space-y-6">
            <p className="font-body text-center text-muted-foreground italic mb-6">
              ¿Cuántos valientes emprenderán esta aventura?
            </p>
            <p className="font-body text-center text-muted-foreground italic mb-6">
              (El jugador Master no cuenta como jugador activo de la aventura)
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`w-14 h-14 rounded-sm font-display text-xl transition-all duration-300
                    ${playerCount === count
                      ? "bg-gold text-primary-foreground shadow-lg scale-110"
                      : "bg-secondary text-foreground hover:bg-gold/20 border border-gold/30"
                    }`}
                >
                  {count}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={handleBack} className="btn-vintage px-6 py-2 opacity-70 hover:opacity-100">
                ◂ Volver
              </button>
              <button onClick={handleConfirmCount} className="btn-vintage px-6 py-2">
                Continuar ▸
              </button>
            </div>
          </div>
        ) : (
          /* Player names input */
          <div className="space-y-4">
            <p className="font-body text-center text-muted-foreground italic mb-6">
              Inscribid vuestros nombres en el libro de los héroes
            </p>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="font-display text-gold w-8 text-right">{index + 1}.</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Jugador ${index + 1}`}
                    className="flex-1 bg-secondary/50 border border-gold/30 rounded-sm px-4 py-2
                               font-body text-foreground placeholder:text-muted-foreground/50
                               focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50
                               transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={handleBack} className="btn-vintage px-6 py-2 opacity-70 hover:opacity-100">
                ◂ Volver
              </button>
              <button
                onClick={handleConfirmNames}
                className="btn-vintage px-6 py-2"
              >
                Comenzar Aventura ▸
              </button>
            </div>
          </div>
        )}

        {/* Decorative footer */}
        <div className="text-center mt-8">
          <div className="text-gold text-2xl">❧</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerConfig;
