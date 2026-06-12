/**
 * @deprecated Ce fichier est conservé uniquement pour référence locale (assets).
 * Les données sérialisables sont dans `scripts/exerciseDefinitions.ts` (migration).
 * Ne pas utiliser dans l'application — préférer `useCatalogExercises()`.
 */
import birdDogImage from '../assets/exercises/bird-dog.png'
import chairDipsImage from '../assets/exercises/chair-dips.png'
import crunchImage from '../assets/exercises/crunch.png'
import crunchVideo from '../assets/exercises/crunch.mp4'
import curlBicepsImage from '../assets/exercises/curl-biceps.png'
import curlBicepsVideo from '../assets/exercises/curl-biceps.mp4'
import curlHammerImage from '../assets/exercises/curl-hammer.png'
import deadBugImage from '../assets/exercises/dead-bug.png'
import diamondPumpsImage from '../assets/exercises/diamond-pumps.png'
import extensionTricepsImage from '../assets/exercises/extension-triceps.png'
import forwardLungeImage from '../assets/exercises/forward-lunge.png'
import forwardLungeVideo from '../assets/exercises/forward-lunge.mp4'
import gluteBridgeImage from '../assets/exercises/glute-bridge.png'
import gluteBridgeVideo from '../assets/exercises/glute-bridge.mp4'
import jumpSquatImage from '../assets/exercises/jump-squat.png'
import kneePushUpImage from '../assets/exercises/knee-push-up.png'
import mountainClimberImage from '../assets/exercises/mountain-climber.png'
import mountainClimberVideo from '../assets/exercises/mountain-climber.mp4'
import pikePushUpImage from '../assets/exercises/pike-push-up.png'
import plankImage from '../assets/exercises/plank.png'
import pushUpImage from '../assets/exercises/push-up.png'
import pushUpVideo from '../assets/exercises/push-up.mp4'
import sidePlankImage from '../assets/exercises/side-plank.png'
import sidePlankVideo from '../assets/exercises/side-plank.mp4'
import squatImage from '../assets/exercises/squat.png'
import standingBurpeeImage from '../assets/exercises/standing-burpee.png'
import supermanImage from '../assets/exercises/superman.png'
import widePushUpImage from '../assets/exercises/wide-push-up.png'
import {
  exerciseDefinitions,
  type ExerciseDefinition,
} from '../../scripts/exerciseDefinitions'

type StaticExercise = ExerciseDefinition & {
  image?: string
  video?: string
}

const EXERCISE_IMAGES: Partial<Record<string, string>> = {
  plank: plankImage,
  'side-plank': sidePlankImage,
  'dead-bug': deadBugImage,
  'bird-dog': birdDogImage,
  crunch: crunchImage,
  squat: squatImage,
  lunge: forwardLungeImage,
  'glute-bridge': gluteBridgeImage,
  'push-up': pushUpImage,
  'knee-push-up': kneePushUpImage,
  'wide-push-up': widePushUpImage,
  'diamond-push-up': diamondPumpsImage,
  dips: chairDipsImage,
  'pike-push-up': pikePushUpImage,
  superman: supermanImage,
  'bicep-curl': curlBicepsImage,
  'hammer-curl': curlHammerImage,
  'tricep-extension': extensionTricepsImage,
  burpee: standingBurpeeImage,
  'mountain-climber': mountainClimberImage,
  'jump-squat': jumpSquatImage,
}

const EXERCISE_VIDEOS: Partial<Record<string, string>> = {
  'side-plank': sidePlankVideo,
  crunch: crunchVideo,
  lunge: forwardLungeVideo,
  'glute-bridge': gluteBridgeVideo,
  'push-up': pushUpVideo,
  'bicep-curl': curlBicepsVideo,
  'mountain-climber': mountainClimberVideo,
}

/** @deprecated Use Firestore catalogExercises via useCatalogExercises() */
export const exercisesDB: StaticExercise[] = exerciseDefinitions.map((exercise) => ({
  ...exercise,
  image: EXERCISE_IMAGES[exercise.id],
  video: EXERCISE_VIDEOS[exercise.id],
}))

export { exerciseDefinitions }
