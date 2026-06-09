// Muskle UI kit — seed data (mirrors src/data in the production repo).
window.MuskleData = (function () {
  const exercises = [
    { id: 'plank', name: 'Planche', category: 'Gainage', cat: 'autre', description: 'Position de gainage sur les avant-bras, corps aligné de la tête aux talons.', type: 'duration', defaultDuration: 30, defaultSets: 3 },
    { id: 'side-plank', name: 'Planche latérale', category: 'Gainage', cat: 'autre', description: 'Gainage sur un avant-bras, corps de côté, hanches décollées.', type: 'duration', defaultDuration: 20, defaultSets: 3 },
    { id: 'dead-bug', name: 'Dead bug', category: 'Gainage', cat: 'autre', description: 'Allongé sur le dos, abaisser alternativement bras et jambe opposée.', type: 'reps', defaultReps: 10, defaultSets: 3 },
    { id: 'squat', name: 'Squat', category: 'Cuisses & Fessiers', cat: 'musculation', description: "Pieds à largeur d'épaules, descendre jusqu'à ce que les cuisses soient parallèles au sol.", type: 'reps', defaultReps: 12, defaultSets: 4 },
    { id: 'bulgarian-split-squat', name: 'Squat bulgare', category: 'Cuisses & Fessiers', cat: 'musculation', description: 'Pied arrière sur un banc, descendre la hanche avant. Alternatif.', type: 'reps', defaultReps: 10, defaultSets: 3 },
    { id: 'wall-sit', name: 'Wall sit', category: 'Cuisses & Fessiers', cat: 'renforcement', description: 'Dos contre un mur, cuisses parallèles au sol, tenir la position.', type: 'duration', defaultDuration: 40, defaultSets: 3 },
    { id: 'glute-bridge', name: 'Pont fessier', category: 'Ischio-jambiers', cat: 'renforcement', description: 'Allongé sur le dos, pousser les hanches vers le haut en contractant les fessiers.', type: 'reps', defaultReps: 15, defaultSets: 3 },
    { id: 'push-up', name: 'Pompes', category: 'Pectoraux', cat: 'musculation', description: "Mains à largeur d'épaules, corps gainé. Descendre la poitrine vers le sol puis repousser.", type: 'reps', defaultReps: 12, defaultSets: 4 },
    { id: 'pull-up', name: 'Traction', category: 'Dos', cat: 'musculation', description: "Barre en pronation, tirer le corps vers le haut jusqu'au menton.", type: 'reps', defaultReps: 8, defaultSets: 4 },
    { id: 'bicep-curl', name: 'Curl biceps', category: 'Biceps', cat: 'musculation', description: 'Haltères en supination, fléchir les coudes. Coudes fixes.', type: 'reps', defaultReps: 12, defaultSets: 3 },
    { id: 'mountain-climber', name: 'Mountain climber', category: 'Cardio / Full Body', cat: 'cardio', description: 'En position de pompe, ramener les genoux vers la poitrine à rythme rapide.', type: 'duration', defaultDuration: 30, defaultSets: 3 },
    { id: 'burpee', name: 'Burpee', category: 'Cardio / Full Body', cat: 'cardio', description: 'Pompe au sol, remonter en saut. Enchaîner sans pause.', type: 'reps', defaultReps: 10, defaultSets: 3 },
  ];

  const muscleGroups = ['Tous', 'Gainage', 'Cuisses & Fessiers', 'Ischio-jambiers', 'Pectoraux', 'Dos', 'Biceps', 'Cardio / Full Body'];

  const blocks = [
    { id: 'gainage-base', name: 'Gainage de base', mode: 'circuit', rounds: 3, restBetweenRounds: 60, exercises: [
      { exerciseId: 'plank', duration: 30, restSeconds: 15 },
      { exerciseId: 'side-plank', duration: 20, restSeconds: 15 },
      { exerciseId: 'dead-bug', reps: 10, restSeconds: 20 },
    ] },
    { id: 'cuisses-force', name: 'Cuisses — force', mode: 'list', exercises: [
      { exerciseId: 'squat', sets: 4, reps: 12, restSeconds: 90 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10, restSeconds: 90 },
      { exerciseId: 'wall-sit', sets: 3, duration: 40, restSeconds: 60 },
    ] },
    { id: 'haut-du-corps', name: 'Haut du corps', mode: 'list', exercises: [
      { exerciseId: 'push-up', sets: 4, reps: 12, restSeconds: 75 },
      { exerciseId: 'pull-up', sets: 4, reps: 8, restSeconds: 90 },
      { exerciseId: 'bicep-curl', sets: 3, reps: 12, restSeconds: 60 },
    ] },
  ];

  const sessions = [
    { id: 'full-body-1', name: 'Full body — débutant', description: 'Gainage + cuisses, 45 min environ', blockIds: ['gainage-base', 'cuisses-force'] },
    { id: 'haut-corps-1', name: 'Push & Pull', description: 'Séance haut du corps, 30 min', blockIds: ['haut-du-corps', 'gainage-base'] },
  ];

  function exerciseById(id) { return exercises.find((e) => e.id === id); }
  function blockById(id) { return blocks.find((b) => b.id === id); }
  function formatDefaults(ex) {
    return ex.type === 'duration'
      ? `${ex.defaultDuration}s × ${ex.defaultSets} séries`
      : `${ex.defaultReps} reps × ${ex.defaultSets} séries`;
  }

  // Flatten a session into player steps (prepare → work/reps → rest).
  function buildSteps(session) {
    const steps = [];
    session.blockIds.forEach((bid) => {
      const block = blockById(bid);
      if (!block) return;
      const rounds = block.mode === 'circuit' ? (block.rounds || 1) : 1;
      for (let r = 0; r < rounds; r++) {
        block.exercises.forEach((be, exIdx) => {
          const ex = exerciseById(be.exerciseId);
          const sets = block.mode === 'circuit' ? 1 : (be.sets || 1);
          for (let s = 0; s < sets; s++) {
            steps.push({ phase: 'prepare', duration: 5, blockTitle: block.name,
              exerciseTitle: ex.name, exerciseDescription: ex.description,
              set: s + 1, totalSets: sets, exIdx, totalEx: block.exercises.length });
            if (be.duration) {
              steps.push({ phase: 'work', duration: be.duration, blockTitle: block.name,
                exerciseTitle: ex.name, exerciseDescription: ex.description,
                set: s + 1, totalSets: sets, exIdx, totalEx: block.exercises.length });
            } else {
              steps.push({ phase: 'work', duration: 0, reps: be.reps, blockTitle: block.name,
                exerciseTitle: ex.name, exerciseDescription: ex.description,
                set: s + 1, totalSets: sets, exIdx, totalEx: block.exercises.length });
            }
            if (be.restSeconds) {
              steps.push({ phase: 'rest', duration: be.restSeconds, blockTitle: block.name,
                exerciseTitle: 'Repos', exerciseDescription: '',
                set: s + 1, totalSets: sets, exIdx, totalEx: block.exercises.length });
            }
          }
        });
      }
    });
    return steps;
  }

  return { exercises, muscleGroups, blocks, sessions, exerciseById, blockById, formatDefaults, buildSteps };
})();
