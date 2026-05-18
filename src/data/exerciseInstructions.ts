import type { ExerciseInstructions } from '@/types'

export const EXERCISE_INSTRUCTIONS: Record<string, ExerciseInstructions> = {
  'incline-db-press': {
    setup:
      'Set bench to 30–45°. Sit back with dumbbells on thighs, kick them up to chest height as you lie back. Feet flat on floor.',
    execution:
      'Press dumbbells up and slightly together, lower under control to chest level with elbows at ~45° from torso. Full stretch at bottom, squeeze at top.',
    breathing: 'Inhale on the way down, exhale on the way up through the sticking point.',
    keyCues: [
      'Retract and depress scapula before pressing',
      'Keep wrists stacked over elbows',
      'Do not let dumbbells drift too wide',
      'Controlled 2-sec descent',
    ],
    commonMistakes: [
      'Flaring elbows to 90° — puts shoulder in impingement',
      'Bouncing off chest instead of controlled stretch',
      'Letting lower back arch excessively',
    ],
    adamsNotes:
      'Wrist symptoms: use a neutral grip if wrists ache, or switch to an EZ-grip dumbbell variation. Avoid locking out hard at the top — keep tension on the muscle, not the joint.',
  },

  'machine-shoulder-press': {
    setup:
      'Adjust seat so handles are at shoulder height. Sit tall with back pressed into pad, feet flat.',
    execution:
      'Press handles straight up to full extension (do not lock out hard), lower until elbows are just below shoulder line.',
    breathing: 'Exhale on press, inhale on controlled lowering.',
    keyCues: [
      'Keep core braced throughout',
      'Do not shrug traps — keep shoulders packed down',
      'Full range without losing back contact with pad',
    ],
    commonMistakes: [
      'Setting seat too low (elbows behind body — shoulder impingement risk)',
      'Shrugging traps to assist at the top',
      'Going too heavy and cutting range of motion',
    ],
    adamsNotes:
      'Machine preferred over barbell OHP given wrist symptoms — neutral or semi-neutral grip handles reduce wrist load significantly. If any clicking in the shoulder, drop weight and focus on full controlled range.',
  },

  'pec-deck': {
    setup:
      'Sit with back flat against pad. Adjust arm pads so forearms are vertical and elbows are at shoulder height.',
    execution:
      'Bring arms together in an arc, squeezing chest at peak contraction. Control the return — do not let weight stack slam.',
    breathing: 'Exhale as you close, inhale on the way back.',
    keyCues: [
      'Lead with elbows, not hands',
      'Hold 1 sec squeeze at peak',
      'Keep chest up and shoulders down',
    ],
    commonMistakes: [
      'Letting shoulders roll forward — lose back contact with pad',
      'Going so far back that front of shoulder is under excessive stretch tension',
      'Using momentum to swing the arms closed',
    ],
    adamsNotes:
      'No wrist load — safe choice on days when wrists are irritated. Adjust starting position conservatively; the pec deck can overstretch the anterior shoulder if taken too far back.',
  },

  'cable-lateral-raise': {
    setup:
      'Stand side-on to low cable pulley. Grip the handle with the hand furthest from the machine, slight forward lean from hips.',
    execution:
      'Raise arm to just above shoulder height with slight elbow bend. Lead with elbow, not wrist. Lower under full control.',
    breathing: 'Exhale on the raise, inhale on the descent.',
    keyCues: [
      'Slight forward tilt of torso keeps tension on mid-delt',
      'Thumb slightly down (internal rotation) at top for max mid-delt stimulus',
      'No momentum or shrug — slow and controlled',
    ],
    commonMistakes: [
      'Raising elbow behind the plane of the body (shifts to rear delt)',
      'Shrugging at the top',
      'Going too heavy and using body sway',
    ],
    adamsNotes:
      'Cable keeps constant tension throughout the range unlike dumbbells. Keep weight light enough for strict form — this is an isolation exercise.',
  },

  'tricep-pushdown': {
    setup:
      'Stand facing cable stack, rope attachment at high pulley. Grip rope with thumbs up, elbows pinned to sides.',
    execution:
      'Push rope down until arms are fully extended, spreading rope ends apart at the bottom. Return controlled — stop when forearms are parallel to floor.',
    breathing: 'Exhale on push, inhale on return.',
    keyCues: [
      'Keep elbows stationary at sides',
      'Spread rope apart at bottom for full tricep contraction',
      'Do not lean too far forward — keep torso upright',
    ],
    commonMistakes: [
      'Letting elbows flare out or drift forward',
      'Using body sway to push heavy weight',
      'Not achieving full elbow extension',
    ],
    adamsNotes:
      'Rope attachment is preferred over bar — neutral grip is much easier on wrists. If wrists are flaring, try holding rope with thumbs pointing more toward ceiling throughout the movement.',
  },

  'lat-pulldown': {
    setup:
      'Adjust thigh pad snugly. Grip bar slightly wider than shoulder-width with overhand grip. Lean back 10–15°.',
    execution:
      'Pull bar to upper chest, driving elbows down and back. Squeeze lats at bottom. Control bar back to full arm extension.',
    breathing: 'Exhale as you pull, inhale as you return.',
    keyCues: [
      'Initiate with lats — depress scapula before bending elbows',
      'Keep chest tall and up to meet the bar',
      'Full stretch at top — let scapula elevate',
    ],
    commonMistakes: [
      'Pulling with biceps instead of initiating with lats',
      'Excessive backward lean turning it into a row',
      'Not achieving full extension at top (half-repping)',
    ],
    adamsNotes:
      'If wrists ache with overhand grip, use a neutral-grip attachment (parallel grip bar or D-handles). Same lat stimulus with far less wrist stress.',
  },

  'seated-cable-row': {
    setup:
      'Sit on pad with slight knee bend. Use a close-grip V-handle attachment. Brace core and sit tall.',
    execution:
      'Row handle to lower abdomen, driving elbows back past the body. Hold 1 sec. Return under full control to a slight forward lean — let scapula protract.',
    breathing: 'Exhale on row, inhale on return.',
    keyCues: [
      'Keep torso mostly vertical — minimal forward/back sway',
      'Retract and depress scapula at peak contraction',
      'Allow full scapular protraction at start for full range',
    ],
    commonMistakes: [
      'Excessive torso swing to generate momentum',
      'Shrugging instead of retracting',
      'Pulling to chest instead of lower abdomen (bicep-dominant)',
    ],
    adamsNotes:
      'The V-handle neutral grip is easiest on wrists. If lower back is flared up on a given day, keep reps strict and reduce range of forward lean.',
  },

  'face-pull': {
    setup:
      'Set cable to eye height. Use rope attachment. Grip ends with thumbs pointing back, step back 2–3 feet.',
    execution:
      'Pull rope toward face, spreading ends apart so hands land beside ears. Hold briefly. Return under control.',
    breathing: 'Exhale on pull, inhale on return.',
    keyCues: [
      'External rotation at end of movement — elbows high',
      'Keep upper arms parallel to floor throughout',
      'Light weight, high reps — this is rehab/prehab work',
    ],
    commonMistakes: [
      'Going too heavy — turns into a row instead of face pull',
      'Letting elbows drop below shoulder height',
      'Pulling to chin instead of face (loses external rotation)',
    ],
    adamsNotes:
      'This is shoulder health work — treat it that way. External rotation helps counteract internal rotation dominance from pressing. Program consistently, never skip.',
  },

  'incline-db-curl': {
    setup:
      'Set bench to 45–60°. Sit back with arms hanging fully extended, dumbbells beside hips. Do not let shoulders round forward.',
    execution:
      'Curl both dumbbells simultaneously, keeping upper arm perpendicular to floor. Squeeze at top, lower to full extension.',
    breathing: 'Exhale on curl, inhale on descent.',
    keyCues: [
      'The stretch at the bottom is the point — let arms hang fully extended',
      'Do not swing torso',
      'Keep elbows pointing straight down throughout',
    ],
    commonMistakes: [
      'Bench angle too steep (reduces stretch, defeats purpose)',
      'Letting elbows drift forward at top',
      'Cutting the descent short',
    ],
    adamsNotes:
      'The incline position creates max bicep stretch — this is the purpose. If wrists ache, use a neutral/hammer grip instead of supinated throughout the movement.',
  },

  'hammer-curl': {
    setup: 'Stand or sit, dumbbells at sides with neutral grip (palms facing each other).',
    execution:
      'Curl dumbbell up keeping neutral grip — do not rotate to supinated. Squeeze at top, lower under control.',
    breathing: 'Exhale up, inhale down.',
    keyCues: [
      'Neutral grip trains brachialis and brachioradialis alongside bicep',
      'Keep elbow pinned to side',
      'Slow controlled descent',
    ],
    commonMistakes: [
      'Swinging torso to get the weight up',
      'Rotating to supinated at top (becomes a standard curl)',
    ],
    adamsNotes:
      'Neutral grip is significantly easier on wrists than supinated curls. This is the safer curl option on days wrists are irritated.',
  },

  'leg-press': {
    setup:
      'Place feet shoulder-width apart, mid-platform. Back flat against pad. Do not allow low back to round off the seat.',
    execution:
      'Lower platform until thighs are parallel to the platform (or slightly past if hips allow). Press through full foot — drive heels and mid-foot, not just toes.',
    breathing: 'Inhale as platform lowers, exhale as you press.',
    keyCues: [
      'Do not lock out knees at top',
      'Feet placement affects muscle emphasis: higher = more glute/ham, lower = more quad',
      'Stop the descent before lower back rounds off pad',
    ],
    commonMistakes: [
      'Knees caving inward',
      'Low back peeling off pad at bottom (dangerous spinal flexion under load)',
      'Locking knees hard at top',
    ],
    adamsNotes:
      'Knee symptoms: reduce depth until pain-free range is found — parallel may not be achievable every session. Wider stance and higher foot placement reduces knee shear. Never push through knee clicking or sharp pain.',
  },

  'romanian-deadlift': {
    setup:
      'Stand with bar or dumbbells in front, feet hip-width. Slight knee bend — soft knees, not squatting. Grip just outside hips.',
    execution:
      'Hinge at hips, pushing hips back while keeping bar close to legs. Lower until hamstring tension is felt (typically mid-shin). Drive hips forward to return — not hyperextend at top.',
    breathing: 'Inhale as you hinge, exhale as you drive back up.',
    keyCues: [
      'Hip hinge not a squat — knees stay soft but barely bend more as you descend',
      'Bar stays in contact with legs throughout',
      'Neutral spine — do not round lower back',
    ],
    commonMistakes: [
      'Squatting down instead of hip-hinging',
      'Rounding lower back at bottom',
      'Hyperextending lumbar at top of rep',
    ],
    adamsNotes:
      'Hip symptoms: avoid going past the point where you feel hip joint pressure (not just hamstring tension). If there is clicking or pinching in the hip, reduce range of motion and consider single-leg RDL variation which often reduces hip impingement.',
  },

  'leg-curl': {
    setup: 'Lie face down on machine. Pad should sit just above Achilles, not on the heel.',
    execution:
      'Curl legs to full flexion (~130° or until pad meets glutes if flexible). Lower under control to just above starting position.',
    breathing: 'Exhale on curl, inhale on descent.',
    keyCues: [
      'Point toes down (plantarflex) for more bicep femoris activation',
      'Keep hips pressed into pad — do not let them rise',
      'Full extension at bottom (do not half-rep)',
    ],
    commonMistakes: [
      'Hips lifting off pad at peak flexion',
      'Using momentum — the concentric should be controlled',
      'Stopping descent before full extension',
    ],
    adamsNotes:
      'Knee symptoms: if there is pain at end range, reduce the peak flexion angle slightly. Seated leg curl machine is an alternative that may be more comfortable for some knee conditions.',
  },

  'leg-extension': {
    setup:
      'Adjust seat so knee joint is aligned with machine pivot point. Pad sits just above ankle.',
    execution:
      'Extend legs to full lockout. Hold 1 sec squeeze. Lower under control — do not let weight stack drop.',
    breathing: 'Exhale on extension, inhale on return.',
    keyCues: [
      'Pause and squeeze at full extension',
      'Control the eccentric (lowering) — this is where quad growth happens',
      'Keep back against pad',
    ],
    commonMistakes: [
      'Going too heavy and using momentum',
      'Knee not aligned with pivot point (shear stress on knee)',
      'Cutting extension short',
    ],
    adamsNotes:
      'Knee symptoms: leg extensions can aggravate patellofemoral issues. If you feel grinding or pain under the kneecap, use a lighter weight and shorter range of motion (e.g., 60–90° instead of full extension). May need to skip on bad knee days.',
  },

  'seated-calf-raise': {
    setup:
      'Sit with pad resting just above knees. Balls of feet on platform edge, heels hanging.',
    execution:
      'Lower heels as far as comfortable for a full gastrocnemius/soleus stretch. Press to full plantarflexion. Hold 1 sec at top.',
    breathing: 'Inhale on lowering, exhale on press.',
    keyCues: [
      'Seated variation targets soleus more than standing',
      'Full stretch at bottom is key',
      'Slow controlled rep — avoid bouncing',
    ],
    commonMistakes: [
      'Bouncing at the bottom instead of a slow controlled stretch',
      'Not achieving full plantarflexion at top',
      'Going too heavy and cutting range of motion',
    ],
    adamsNotes:
      'Plantar fasciitis (right foot): the fascial stretch at the bottom of this movement can aggravate PF. Do not force range of motion — lower only to where there is no PF pain. May need to limit depth on the affected foot. Strengthen the foot and Achilles — this exercise is therapeutic if done conservatively.',
  },

  'cable-chest-fly': {
    setup:
      'Set both cables to chest height. Stand in the middle, slight forward lean. Arms extended to sides with slight elbow bend.',
    execution:
      'Bring hands together in an arc in front of chest. Allow a slight crossing of hands at the finish. Return under full control.',
    breathing: 'Exhale as hands come together, inhale on return.',
    keyCues: [
      'Hug a tree — keep the arc shape throughout',
      'Do not let shoulders roll forward',
      'Control the eccentric — where the pec stretch lives',
    ],
    commonMistakes: [
      'Turning it into a press by bending elbows too much',
      'Shoulders rolling forward at peak contraction',
      'Going too heavy and losing the arc',
    ],
    adamsNotes:
      'No wrist load in this position — good choice on days wrists are sensitive. The standing cable version provides constant tension throughout the range, unlike dumbbell flyes.',
  },

  'machine-row': {
    setup:
      'Adjust chest pad height so arms are roughly parallel to floor when gripping handles. Sit tall with chest pressed into pad.',
    execution:
      'Row handles back driving elbows past body. Squeeze scapula together at peak. Return to full arm extension.',
    breathing: 'Exhale on row, inhale on return.',
    keyCues: [
      'Retract and depress scapula at peak',
      'Keep chest pressed into pad throughout',
      'Full arm extension at return for scapular protraction',
    ],
    commonMistakes: [
      'Shrugging traps instead of retracting scapula',
      'Using torso momentum (chest leaves pad)',
      'Partial range — not achieving full retraction',
    ],
    adamsNotes:
      "Machine row is a great option when lower back is fatigued from deadlifts or RDLs — it's fully supported. Use neutral grip handle if available to reduce wrist stress.",
  },

  'arnold-press': {
    setup:
      'Sit on upright bench. Hold dumbbells at shoulder height, palms facing you (pronated to neutral). Elbows in front of body.',
    execution:
      'As you press up, rotate hands so palms face forward at full extension overhead. Reverse on the way down. Full range of motion.',
    breathing: 'Exhale as you press up, inhale as you lower.',
    keyCues: [
      'The rotation is the exercise — do not skip it',
      'Keep core braced — do not arch lower back',
      'Full press at top without locking out aggressively',
    ],
    commonMistakes: [
      'Not rotating through the full range',
      'Leaning back excessively to press heavy weight',
      'Too fast — the rotation needs to be deliberate',
    ],
    adamsNotes:
      'Wrist symptoms: the rotation adds wrist demand. If wrists are irritated, do a standard neutral-grip dumbbell press instead of the Arnold variation. Do not push through wrist pain here — the shoulder benefit does not outweigh joint risk.',
  },

  'overhead-tricep-ext': {
    setup:
      'Use a rope or EZ-bar attachment at low cable. Face away from machine or stand facing it. Grip overhead with elbows pointing at ceiling.',
    execution:
      'Extend forearms up to full lockout, keeping upper arms stationary beside ears. Lower under control until forearms are 90° to upper arm.',
    breathing: 'Exhale on extension, inhale on lowering.',
    keyCues: [
      'Keep upper arms vertical and stationary — elbow flare is the enemy',
      'Full lockout at top',
      'Max stretch at bottom',
    ],
    commonMistakes: [
      'Elbows flaring out to sides during extension',
      'Upper arms drifting forward (turns into a press)',
      'Going too heavy and losing elbow position',
    ],
    adamsNotes:
      'Wrist symptoms: rope is preferred over straight bar — neutral grip at the top of the extension. If wrists ache in overhead position, try a single-arm version with neutral dumbbell grip as an alternative.',
  },

  'cable-curl': {
    setup:
      'Face cable stack, low pulley with straight bar or EZ-bar attachment. Stand with slight forward lean.',
    execution:
      'Curl bar to chin height, squeezing biceps. Slowly lower to full extension. Keep elbows pinned to sides.',
    breathing: 'Exhale on curl, inhale on descent.',
    keyCues: [
      'Keep elbows stationary',
      'Full range — complete extension at the bottom',
      'Supinate the wrist fully at top if using straight bar',
    ],
    commonMistakes: [
      'Swinging hips and back to generate momentum',
      'Elbows drifting forward at top',
      'Not achieving full extension at the bottom',
    ],
    adamsNotes:
      'Wrist symptoms: use EZ-bar attachment instead of straight bar to get wrists into a more comfortable semi-supinated position. Cable keeps constant tension at the bottom of the curl unlike dumbbells.',
  },

  'hip-thrust': {
    setup:
      'Sit on floor with upper back against a bench. Roll barbell or place pad over hips. Feet hip-width, flat on floor, knees bent ~90° at top.',
    execution:
      'Drive hips up to full extension — form a straight line from shoulders to knees. Squeeze glutes hard at top. Lower hips to just above floor.',
    breathing: 'Inhale at bottom, exhale as you drive hips up.',
    keyCues: [
      'Chin tucked — do not hyperextend neck',
      'Drive through mid-foot and heel, not toes',
      'Full glute squeeze at top — do not just reach height',
    ],
    commonMistakes: [
      'Hyperextending the lower back instead of achieving posterior pelvic tilt at top',
      'Knees caving inward',
      'Not achieving full hip extension',
    ],
    adamsNotes:
      'Hip symptoms: hip thrusts train the glutes through a range that most people do not have pain in. If there is hip discomfort at the bottom, do not let hips drop all the way to floor — keep a shortened range. Check that feet are not too far from the bench.',
  },

  'goblet-squat': {
    setup:
      'Hold a single dumbbell vertically at chest height (goblet position). Feet shoulder-width or slightly wider, toes turned out 15–30°.',
    execution:
      'Squat down keeping chest tall and knees tracking over toes. Aim for at least parallel. Drive through full foot to return.',
    breathing: 'Inhale on the way down, exhale on the drive up.',
    keyCues: [
      'Elbows inside knees at the bottom — can use to gently push knees out',
      'Keep weight in mid-foot and heel — do not let heels rise',
      'Chest must remain upright throughout',
    ],
    commonMistakes: [
      'Heels rising — indicates ankle mobility limitation',
      'Knees caving inward',
      'Forward lean from loss of core or chest position',
    ],
    adamsNotes:
      'Knee symptoms: reduce depth to pain-free range. A slightly wider stance often allows more depth with less knee discomfort. Hip symptoms: if there is pinching at the bottom of the squat, try elevating heels slightly on a plate or reduce depth until the hip impingement resolves.',
  },

  'nordic-curl': {
    setup:
      'Kneel on pad with ankles secured under pad or heavy bar. Body in upright position. Cross arms at chest or extend for counterbalance.',
    execution:
      'Slowly lower torso toward floor under hamstring control — resist the fall. Use hands to push off floor at the bottom and explosively curl back up.',
    breathing: 'Inhale on lowering, exhale on curl up.',
    keyCues: [
      'The eccentric (lowering) is the main training stimulus — make it as slow as possible',
      'Keep hips extended — do not break at the hip',
      'Start with very short range if new to this exercise',
    ],
    commonMistakes: [
      'Breaking at hips — this makes it a hip extension exercise, not hamstring curl',
      'Dropping too fast — losing the eccentric',
      'Not progressing gradually — this exercise has high DOMS risk',
    ],
    adamsNotes:
      'Knee symptoms: nordic curls have low knee joint loading (force is at the ankle) but the hamstring pull on the tibia could irritate some conditions. If you feel discomfort behind the knee, reduce range of motion. Lying leg curl is a safer alternative on bad knee days.',
  },

  'hip-abduction': {
    setup:
      'Sit in machine with back against pad, knees bent 90°, legs together in starting position.',
    execution:
      'Press legs outward against pads to full range of motion. Slowly return to start — do not let weight stack slam.',
    breathing: 'Exhale on abduction, inhale on return.',
    keyCues: [
      'Sit upright — do not slump',
      'Full controlled range on return',
      'Moderate weight with full ROM beats heavy weight with partial',
    ],
    commonMistakes: [
      'Going too heavy and not achieving full range',
      'Slumping torso — reduces glute med activation',
    ],
    adamsNotes:
      'Hip symptoms: this is generally well-tolerated for hip issues as it trains abductors in a seated, supported position. If there is clicking in the hip during the movement, reduce weight and range of motion.',
  },

  'cable-crunch': {
    setup:
      'Kneel in front of cable stack, rope attachment at high pulley. Hold rope at sides of head. Start in upright kneeling position.',
    execution:
      'Crunch down, pulling elbows toward knees, rounding the spine. The movement is spinal flexion — not a hip hinge. Return under control.',
    breathing: 'Exhale forcefully on crunch, inhale on return.',
    keyCues: [
      'Movement comes from abs — elbows to knees, spine rounds',
      'Do not hip-hinge — the hips stay relatively still',
      'Keep hands at face level throughout',
    ],
    commonMistakes: [
      'Hip-hinging instead of spinal flexion',
      'Letting arms/shoulders do the work',
      'Going too heavy and losing form',
    ],
    adamsNotes:
      'Lower back should feel fine in this exercise — it trains flexion which is different from extension-loaded movements. If there is any lumbar discomfort, reduce the weight significantly.',
  },
}
