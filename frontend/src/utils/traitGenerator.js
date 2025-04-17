export const generateRandomTraits = () => {
    const genres = ["Lo-fi", "Techno", "Ambient", "Synthwave", "Jazzhop"];
    const keys = ["C Major", "D Minor", "A Minor", "F Major", "G Dorian"];
  
    return {
      tempo: Math.floor(Math.random() * (180 - 60 + 1)) + 60, // 60–180
      genre: genres[Math.floor(Math.random() * genres.length)],
      melodyComplexity: Math.floor(Math.random() * 10) + 1,   // 1–10
      bassDepth: Math.floor(Math.random() * 10) + 1,
      percussionIntensity: Math.floor(Math.random() * 10) + 1,
      reverbAmount: Math.floor(Math.random() * 101),          // 0–100
      key: keys[Math.floor(Math.random() * keys.length)],
    };
  };
  