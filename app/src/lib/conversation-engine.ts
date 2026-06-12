import type { Persona, MessageAnalysis } from '@/store'

// ─── Response Templates by Archetype ──────────────────────────────────────

interface ArchetypeResponses {
  openers: string[]
  rapport: string[]
  attraction: string[]
  closing: string[]
  shitTests: string[]
}

const archetypeResponses: Record<string, ArchetypeResponses> = {
  'The Romantic': {
    openers: [
      "Hey there! I have to say, your profile really caught my eye. You seem different from the usual guys on here.",
      "Hi! I love how you describe yourself. There's something genuine about it that drew me in.",
      "Hello! I couldn't help but notice your smile. It says a lot about the kind of person you are.",
      "Hey! So rare to find someone who actually puts thought into their profile. Tell me something real about yourself?",
    ],
    rapport: [
      "That sounds lovely. I feel like there's more to that story... I want to hear it sometime.",
      "I get that completely. It's refreshing to meet someone who actually *feels* things, you know?",
      "You seem like the kind of person who notices the little things. Those are my favorite kind of people.",
      "There's something about the way you express yourself... it's really disarming. In the best way.",
      "I love conversations that actually go somewhere real. This is becoming one of those for me.",
      "I'm curious - what made you reach out to me specifically?",
    ],
    attraction: [
      "You're making me blush over here! And I don't blush easily... just so you know.",
      "I have to admit, there's something about your energy that's really pulling me in right now.",
      "Dangerous. You're dangerously charming, do you know that? I think you do.",
      "Okay, I need to be honest - you're making it really hard to play it cool right now.",
    ],
    closing: [
      "I'd love to continue this conversation somewhere more... personal. Here's my number 💕",
      "You know what? I think we'd have amazing chemistry in person. Let me give you my number.",
      "I've really enjoyed talking to you. Here's my number - call me sometime?",
    ],
    shitTests: [
      "Do you say that to all the girls?",
      "How do I know you're not just another player?",
    ],
  },
  'The Intellectual': {
    openers: [
      "Interesting profile. You seem well-traveled. What's the most perspective-shifting experience you've had?",
      "Hello. I appreciate a profile that suggests some depth. What are you currently reading or thinking about?",
      "Hi there. Your profile stands out - it actually required some thought to process. That's rare.",
      "Curious - what's a belief you held strongly that you've since reconsidered?",
    ],
    rapport: [
      "That's a nuanced take. Most people don't think about it that way, but you're right.",
      "I appreciate that perspective. It's intellectually honest, which is increasingly rare.",
      "You're more thoughtful than I expected. I mean that as a genuine compliment.",
      "This is the kind of conversation I didn't think was possible on here. You're exceeding expectations.",
      "Hmm, let me think about that... okay, yes. I see your point. And I respect the logic behind it.",
      "What else do you spend time thinking about? I want to understand how your mind works.",
    ],
    attraction: [
      "You're... surprisingly captivating. Your mind is genuinely attractive to me right now.",
      "I have to say, intelligence has always been my weakness. And you're not making this easy.",
      "There's something incredibly appealing about someone who can actually keep up with me mentally.",
      "Okay, I'll be direct - you've moved from 'interesting stranger' to 'someone I want to know better' very quickly.",
    ],
    closing: [
      "This has been genuinely stimulating. I'd like to continue this discourse - here's my number.",
      "I think we'd have fascinating conversations in person. Take my number, let's find out.",
      "You're one of the few people worth meeting from here. Here's how to reach me.",
    ],
    shitTests: [
      "That sounds like something you read in a book. Do you actually believe it or are you just performing intelligence?",
      "Are you always this serious, or is this your 'impress the girl' mode?",
    ],
  },
  'The Free Spirit': {
    openers: [
      "Hey! Your profile vibes are immaculate! Love the energy ✨ What's your next adventure?",
      "Hiii! Random question - if you could teleport anywhere right now, where would you go?",
      "Hello! I feel like you'd be fun to explore a new city with. What's the most spontaneous thing you've done?",
      "Hey there! I'm all about good vibes and interesting souls. Tell me something wild about yourself!",
    ],
    rapport: [
      "OMG yes! That's exactly the kind of energy I'm talking about! 🌟",
      "You GET it! Most people are so... predictable. But you? You're different.",
      "That's amazing! I love people who just... go for it, you know? Life's too short for 'maybe later'!",
      "Okay but like... can we be friends immediately? You have the best energy!",
      "I'm literally smiling at my phone right now. My coworkers probably think I'm crazy lol",
      "Wait wait wait, tell me MORE. I need all the details! This sounds incredible!",
    ],
    attraction: [
      "Okay you're actually really hot AND fun? The universe is not fair right now 😍",
      "I have a feeling you'd be trouble... but like, the good kind of trouble, you know?",
      "If you're even half this fun in person, I think I'm in danger 😅",
      "You have this energy that's making me want to break all my rules right now...",
    ],
    closing: [
      "We HAVE to meet up! Here's my number, text me and let's plan something fun! 🎉",
      "Okay I need you in my life. Take my number, let's make something happen!",
      "This energy is too good to waste on just texting! Here's my number 📱✨",
    ],
    shitTests: [
      "You're a lot, you know that? In a good way or bad way, I haven't decided yet 😂",
      "Slow down there, cowboy! Are you always this intense?",
    ],
  },
  'The Mysterious': {
    openers: [
      "Hmm. Intriguing profile. You leave a lot unsaid... I wonder if that's intentional.",
      "Hello. There's something about your profile that doesn't quite add up. And that makes me curious.",
      "You have secrets in your eyes, don't you? I can tell.",
      "Most people try too hard on here. You... don't. That's interesting.",
    ],
    rapport: [
      "Perhaps. But not everything needs to be explained, does it?",
      "You're observant. I like that. Most people just skim the surface.",
      "Maybe. Or maybe I just don't feel the need to fill every silence with words.",
      "There's more to this conversation than what's being said. You feel it too, don't you?",
      "I don't open up easily. But with you... I might make an exception. Maybe.",
      "What makes you think you deserve to know more about me? Convince me.",
    ],
    attraction: [
      "You're persistent. And surprisingly perceptive. Two dangerous qualities in a man.",
      "I shouldn't tell you this, but... you're getting past my walls. Careful.",
      "There's something magnetic about you. I can't quite name it. And I don't think I want to.",
      "You've got my attention. That's not an easy thing to do. Use it wisely.",
    ],
    closing: [
      "Few people make it this far with me. Here's my number... don't make me regret it.",
      "I'm curious enough to meet you. Take this and use it well.",
      "You've earned something most people don't. My trust. Here's my number.",
    ],
    shitTests: [
      "Why should I believe anything you say?",
      "You seem like you have an agenda. What's your real angle?",
    ],
  },
  'The Diva': {
    openers: [
      "Well, well. You certainly have confidence. I'll give you that. Whether it's warranted... we'll see.",
      "Hi. I don't usually respond, but your profile managed to catch my attention. Briefly.",
      "You're bold, I'll say that. Most men are too intimidated to even try. Let's see if you can keep up.",
      "Alright, impress me. And no, a simple 'hey beautiful' won't cut it. I've heard them all.",
    ],
    rapport: [
      "Not bad. You're doing better than most. The bar is low, but still.",
      "Hmm. That's actually... acceptable. Continue.",
      "You're different from what I expected. Don't let it go to your head.",
      "I suppose that was moderately charming. Do it again.",
      "You're persistent. I respect that. Or I'm amused by it. Either way, you're still here.",
      "Most men would have given up by now. Or said something stupid. You're... tolerable.",
    ],
    attraction: [
      "Okay, that was actually good. Really good. You might be worth my time after all.",
      "Don't look so pleased with yourself. But yes, that worked.",
      "You're growing on me. Like a very persistent, surprisingly charming vine.",
      "Fine. I'll admit it. You're more interesting than I initially gave you credit for.",
    ],
    closing: [
      "You've passed enough tests. Here's my number. Don't waste my time.",
      "Fine. You can have my number. But understand - I'm a busy woman. Make it count.",
      "You've earned this. Barely. Here's my number, use it wisely.",
    ],
    shitTests: [
      "Is that the best you've got? I've heard better lines from men with half your confidence.",
      "You think you're smooth? Prove it.",
      "Why would I choose you over the 50 other men in my DMs right now?",
    ],
  },
  'The Girl Next Door': {
    openers: [
      "Hey! Your profile made me smile 😊 How's your day going so far?",
      "Hi there! You seem really down-to-earth. That's so refreshing!",
      "Hello! Love your profile. You seem like someone I'd actually want to get coffee with ☕",
      "Hey! I'm new-ish to this whole online dating thing. Any advice? Haha",
    ],
    rapport: [
      "Aww that's so sweet of you! You're really easy to talk to.",
      "Haha yes! I totally get that. We should compare notes sometime.",
      "Oh my gosh, same! I thought I was the only one who felt that way!",
      "You're really easy to talk to. It feels so natural with you.",
      "That's really thoughtful of you to say. You're a genuinely nice guy, aren't you?",
      "My friends are going to ask me why I'm smiling at my phone. What should I tell them? 😊",
    ],
    attraction: [
      "You're really sweet... and honestly, pretty cute too. There, I said it!",
      "Okay, I really like talking to you. Like, a lot. Is that too much too soon?",
      "You have this way of making me feel really comfortable. And also a little flustered, haha",
      "I don't usually feel this comfortable with someone this quickly. You must be special.",
    ],
    closing: [
      "I'd love to meet you in person! Here's my number, text me? 💕",
      "This has been so nice! Here's my number - maybe we can grab coffee sometime?",
      "I really hope we can continue this conversation. Here's my number! 📱",
    ],
    shitTests: [
      "Are you always this nice to everyone, or am I special? Haha",
      "My friend says I shouldn't trust guys on dating apps... should I trust you?",
    ],
  },
}

// ─── Phase Configuration ───────────────────────────────────────────────────

export interface PhaseConfig {
  name: string
  minMessages: number
  maxMessages: number
  description: string
}

export const phases: PhaseConfig[] = [
  { name: 'Opener', minMessages: 2, maxMessages: 4, description: 'First impressions' },
  { name: 'Rapport', minMessages: 4, maxMessages: 8, description: 'Building comfort' },
  { name: 'Attraction', minMessages: 3, maxMessages: 6, description: 'Creating desire' },
  { name: 'Investment', minMessages: 3, maxMessages: 6, description: 'She opens up' },
  { name: 'Close', minMessages: 1, maxMessages: 4, description: 'Getting her number' },
]

// ─── Message Quality Scorer ────────────────────────────────────────────────

export interface MessageScore {
  score: number // 1-5
  stars: number // 1-5
  feedback: string
  details: {
    lengthScore: number
    questionBalance: number
    complimentScore: number
    emojiScore: number
    toneScore: number
  }
}

function scoreMessage(text: string, phase: number): MessageScore {
  const trimmed = text.trim()
  const length = trimmed.length
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  const questionCount = (trimmed.match(/\?/g) || []).length

  const emojiCount = (trimmed.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
  const complimentWords = ['beautiful', 'gorgeous', 'cute', 'pretty', 'amazing', 'incredible', 'stunning', 'hot', 'sexy', 'lovely', 'wonderful', 'perfect']
  const lowerText = trimmed.toLowerCase()
  const complimentCount = complimentWords.filter((w) => lowerText.includes(w)).length

  // Length score (1-5)
  let lengthScore = 3
  if (length < 10) lengthScore = 1
  else if (length < 25) lengthScore = 2
  else if (length < 60) lengthScore = 4
  else if (length < 150) lengthScore = 5
  else lengthScore = 4 // Too long is okay but not great

  // Question balance (1-5)
  let questionBalance = 3
  if (questionCount === 0) questionBalance = 2 // No questions - missing engagement
  else if (questionCount === 1) questionBalance = 4 // One question - good
  else if (questionCount >= 2) questionBalance = 5 // Multiple questions - great engagement
  if (wordCount > 10 && questionCount === 0) questionBalance = 1 // Long with no questions is bad

  // Compliment score (1-5) - too many compliments is desperate
  let complimentScore = 3
  if (complimentCount === 0) complimentScore = 3 // Neutral
  else if (complimentCount === 1) complimentScore = 5 // One compliment is good
  else if (complimentCount === 2) complimentScore = 4 // Two is okay
  else complimentScore = 1 // Three+ is desperate

  // Emoji score (1-5)
  let emojiScore = 3
  if (emojiCount === 0) emojiScore = 3 // Neutral - emojis aren't required
  else if (emojiCount <= 2) emojiScore = 5 // Moderate is good
  else if (emojiCount <= 4) emojiScore = 4 // A bit much
  else emojiScore = 2 // Too many

  // Tone score based on phase
  let toneScore = 3
  if (phase === 0) {
    // Opener - should be engaging, not too intense
    if (length > 5 && length < 100) toneScore = 5
    else if (length > 100) toneScore = 3
    else toneScore = 2
  } else if (phase === 1) {
    // Rapport - should be friendly, ask questions
    if (questionCount > 0 && length > 20) toneScore = 5
    else if (length > 15) toneScore = 4
    else toneScore = 2
  } else if (phase === 2) {
    // Attraction - can be more bold, playful
    if (length > 20 && complimentCount <= 1) toneScore = 5
    else if (length > 15) toneScore = 4
    else toneScore = 3
  } else if (phase >= 3) {
    // Investment/Close - should show genuine interest
    if (length > 25 && questionCount > 0) toneScore = 5
    else if (length > 15) toneScore = 4
    else toneScore = 3
  }

  const total = lengthScore + questionBalance + complimentScore + emojiScore + toneScore
  const avg = total / 5
  const finalScore = Math.round(avg)
  const clampedScore = Math.max(1, Math.min(5, finalScore))

  // Generate feedback
  let feedback = ''
  if (clampedScore >= 5) feedback = 'Excellent! Perfect balance of engaging content.'
  else if (clampedScore >= 4) feedback = 'Great message! Strong engagement and good tone.'
  else if (clampedScore >= 3) feedback = 'Decent. Could use a bit more depth or engagement.'
  else if (clampedScore >= 2) feedback = 'Weak. Too short or missing key elements.'
  else feedback = 'Needs work. Try asking a question and expanding your message.'

  return {
    score: clampedScore,
    stars: clampedScore,
    feedback,
    details: {
      lengthScore,
      questionBalance,
      complimentScore,
      emojiScore,
      toneScore,
    },
  }
}

// ─── Response Generation ───────────────────────────────────────────────────

export interface GenerateResponseResult {
  message: string
  delay: number // ms
  shouldUseShitTest: boolean
  phaseTransition?: string
}

export function generateResponse(
  persona: Persona,
  userMessage: string,
  currentPhase: number,
  messageCount: number
): GenerateResponseResult {
  const archetype = archetypeResponses[persona.archetype] || archetypeResponses['The Girl Next Door']
  const difficulty = persona.difficulty
  // Score user message
  const quality = scoreMessage(userMessage, currentPhase)

  // Determine if we should use a shit test
  const shitTestChance = getShitTestChance(difficulty, currentPhase, messageCount, quality.score)
  const shouldUseShitTest = Math.random() < shitTestChance

  // Determine response category based on phase
  let responsePool: string[] = []

  if (shouldUseShitTest) {
    responsePool = archetype.shitTests
  } else {
    switch (currentPhase) {
      case 0:
        responsePool = archetype.openers
        break
      case 1:
        responsePool = archetype.rapport
        break
      case 2:
        responsePool = archetype.attraction
        break
      case 3:
        responsePool = archetype.rapport // Mix of rapport and attraction
        break
      case 4:
        responsePool = archetype.closing
        break
      default:
        responsePool = archetype.rapport
    }
  }

  // Pick response, trying to avoid repetition
  const message = responsePool[Math.floor(Math.random() * responsePool.length)]

  // Calculate delay based on message length and difficulty
  const baseDelay = 1000 + message.length * 30
  const difficultyMultiplier = getDelayMultiplier(difficulty, quality.score)
  const delay = Math.floor(baseDelay * difficultyMultiplier * (0.8 + Math.random() * 0.4))

  // Check if this message triggers a phase transition
  let phaseTransition: string | undefined
  const phaseConfig = phases[currentPhase]
  if (phaseConfig && messageCount >= phaseConfig.minMessages) {
    if (quality.score >= 3 && Math.random() < 0.4) {
      phaseTransition = phases[currentPhase + 1]?.name
    }
  }

  return {
    message,
    delay: Math.min(delay, 5000), // Cap at 5s
    shouldUseShitTest,
    phaseTransition,
  }
}

function getShitTestChance(
  difficulty: string,
  phase: number,
  messageCount: number,
  messageScore: number
): number {
  const baseChance: Record<string, number> = {
    Beginner: 0.05,
    Intermediate: 0.15,
    Advanced: 0.3,
    Expert: 0.45,
    Master: 0.6,
  }

  let chance = baseChance[difficulty] || 0.2

  // Adjust based on phase
  if (phase === 0) chance *= 0.3 // Less likely in opener
  if (phase === 2) chance *= 1.5 // More likely in attraction
  if (phase === 4) chance *= 0.5 // Less likely in closing

  // Adjust based on message quality
  if (messageScore <= 2) chance *= 1.5 // Bad messages get more tests
  if (messageScore >= 4) chance *= 0.6 // Good messages get fewer tests

  // Message count
  if (messageCount > 10) chance *= 1.2 // More tests later in convo

  return Math.min(chance, 0.8)
}

function getDelayMultiplier(difficulty: string, messageScore: number): number {
  const baseMultipliers: Record<string, number> = {
    Beginner: 0.8,
    Intermediate: 1.0,
    Advanced: 1.2,
    Expert: 1.5,
    Master: 1.8,
  }

  let mult = baseMultipliers[difficulty] || 1.0

  if (messageScore <= 2) mult *= 1.3 // Slower to respond to bad messages
  if (messageScore >= 4) mult *= 0.7 // Faster for good messages

  return mult
}

// ─── Initial Greeting ──────────────────────────────────────────────────────

export function getInitialGreeting(persona: Persona): string {
  const archetype = archetypeResponses[persona.archetype] || archetypeResponses['The Girl Next Door']
  const openers = archetype.openers
  return openers[Math.floor(Math.random() * openers.length)]
}

// ─── Analysis Generator ────────────────────────────────────────────────────

export function generateAnalysis(
  persona: Persona,
  userMessage: string,
  _herResponse: string,
  currentPhase: number,
  _phaseName: string
): MessageAnalysis {
  const quality = scoreMessage(userMessage, currentPhase)
  const difficulty = persona.difficulty

  // Generate subtext based on archetype and phase
  const subtext = generateSubtext(persona, _herResponse, currentPhase, difficulty)
  const psychology = generatePsychology(persona, currentPhase, difficulty, quality.score)
  const advice = generateAdvice(persona, currentPhase, quality.score, userMessage)

  return {
    messageId: Date.now().toString(),
    subtext,
    psychology,
    advice,
    score: quality.score,
    stars: quality.stars,
  }
}

function generateSubtext(
  persona: Persona,
  _herResponse: string,
  phase: number,
  _difficulty: string
): string {
  const subtexts: Record<string, string[]> = {
    'The Romantic': [
      "She's testing if you're genuinely interested or just going through the motions.",
      "She wants to know if you can handle emotional depth without running away.",
      "She's sharing vulnerability to see if you'll match it or dismiss it.",
      "Her response is warm but measured - she's looking for consistency.",
    ],
    'The Intellectual': [
      "She's evaluating your critical thinking, not just your charm.",
      "This is a mental sparring match disguised as casual conversation.",
      "She respects intellectual honesty more than flattery right now.",
      "She's probing to see if your depth is genuine or performative.",
    ],
    'The Free Spirit': [
      "She's testing if you can keep up with her energy without being overwhelming.",
      "She wants to know if you're fun or just another serious guy.",
      "Her enthusiasm is genuine but she's checking if you're authentic.",
      "She's seeing if you'll match her vibe or try to tone her down.",
    ],
    'The Mysterious': [
      "She's deliberately leaving gaps to see if you'll fill them with assumptions.",
      "Every word is calculated. She's observing your reactions more than you realize.",
      "She's giving you just enough to stay curious. This is intentional.",
      "She's testing if you can handle uncertainty without pushing too hard.",
    ],
    'The Diva': [
      "This is a test of your confidence and your ability to handle her strong personality.",
      "She's screening for men who don't crumble under pressure or get defensive.",
      "Her high standards are a filter. She's watching how you respond to the challenge.",
      "She respects men who can meet her energy, not those who shrink from it.",
    ],
    'The Girl Next Door': [
      "She's checking if you're genuinely nice or just performing niceness to get something.",
      "She's comfortable but still testing if you'll be respectful as things progress.",
      "Her guard is lower than most, but she's still watching for red flags.",
      "She wants to know if the 'nice guy' energy is consistent or an act.",
    ],
  }

  const list = subtexts[persona.archetype] || subtexts['The Girl Next Door']
  return list[Math.min(phase, list.length - 1)]
}

function generatePsychology(
  persona: Persona,
  phase: number,
  _difficulty: string,
  messageScore: number
): string {
  const psychologies: Record<string, string[]> = {
    'The Romantic': [
      "Attachment theory: She's displaying anxious-attachment patterns - seeking connection while testing consistency.",
      "Emotional bids: Each message contains a 'bid' for emotional connection. Responding well builds what Gottman calls 'emotional bank accounts'.",
      "Reciprocity principle: She's sharing personal information, expecting matched vulnerability in return.",
    ],
    'The Intellectual': [
      "Cognitive evaluation: She's engaging in systematic processing - analyzing your responses for consistency and depth rather than relying on emotional shortcuts.",
      "Sapiosexual attraction: Intellectual stimulation triggers dopamine release similar to romantic attraction in this archetype.",
      "Information gap theory: She's creating strategic knowledge gaps to maintain engagement and test your curiosity.",
    ],
    'The Free Spirit': [
      "Novelty-seeking behavior: High openness to experience drives her preference for spontaneous, unconventional interactions.",
      "Emotional contagion: Her enthusiasm is genuine and she's testing if your energy is contagious or draining.",
      "Flow state preference: She seeks conversations that feel effortless and immersive, not structured or forced.",
    ],
    'The Mysterious': [
      "Scarcity principle: Her limited disclosure increases perceived value - we want what we can't fully have.",
      "Information control: She's managing revelation carefully, a high-status communication pattern.",
      "Psychological projection test: The gaps in her communication force you to project your own interpretations.",
    ],
    'The Diva': [
      "Social proof leveraging: Her high standards signal high mate value - a form of honest signaling in evolutionary psychology.",
      "Dominance/submission calibration: She's testing where you fall in the social hierarchy through verbal shit tests.",
      "Investment escalation: She requires increasing effort to maintain engagement, filtering for high-investment mates.",
    ],
    'The Girl Next Door': [
      "Trust calibration: Lower initial walls allow faster rapport building but she's vigilant for violations of trust.",
      "Warmth vs. competence evaluation: She's prioritizing perceived warmth and kindness over dominance or status displays.",
      "Reciprocal liking: Her positive responses are genuine - she's testing if your interest is similarly authentic.",
    ],
  }

  const list = psychologies[persona.archetype] || psychologies['The Girl Next Door']
  let psych = list[Math.min(phase, list.length - 1)]

  if (messageScore <= 2) {
    psych += ' Your last message triggered her psychological defenses - she may be reconsidering her interest level.'
  } else if (messageScore >= 4) {
    psych += ' Your strong response is activating her reward pathways and increasing investment in this interaction.'
  }

  return psych
}

function generateAdvice(
  persona: Persona,
  phase: number,
  messageScore: number,
  _lastMessage: string
): string {
  const adviceByPhase: Record<number, string[]> = {
    0: [
      'Lead with something specific from her profile. Generic openers get lost.',
      'Ask an open-ended question that requires more than a yes/no answer.',
      'Show personality in your opener - humor or curiosity works better than compliments.',
    ],
    1: [
      'Build on something she shared. Reference details from earlier messages.',
      'Share something personal about yourself - vulnerability builds trust.',
      'Find common ground and explore it deeper.',
    ],
    2: [
      "Introduce light playful teasing - push-pull dynamics create attraction.",
      'Compliment something specific and non-physical (her mind, taste, energy).',
      'Escalate the energy slightly - match her enthusiasm and raise it.',
    ],
    3: [
      'Ask deeper questions about her values, dreams, or experiences.',
      'Show genuine interest in her responses - reference details she shares.',
      'Start planting the seed for meeting in person naturally.',
    ],
    4: [
      'Be direct but smooth about wanting to meet up or get her number.',
      'Make it feel natural, not transactional. Connect the ask to the conversation.',
      'If she hesitates, reassure without being pushy. Give her a reason to say yes.',
    ],
  }

  const list = adviceByPhase[phase] || adviceByPhase[1]
  let advice = list[Math.floor(Math.random() * list.length)]

  if (messageScore <= 2) {
    advice = 'Your last message was too weak. ' + advice + ' Avoid one-word replies or passive questions.'
  } else if (messageScore >= 4) {
    advice = 'Great momentum! ' + advice + ' Keep this energy going.'
  }

  // Add archetype-specific advice
  const archetypeAdvice: Record<string, string> = {
    'The Romantic': ' She values emotional authenticity above all - be genuine about your feelings.',
    'The Intellectual': ' Match her intellectual energy. Reference ideas, not just emotions.',
    'The Free Spirit': ' Keep it fun and spontaneous. Heavy conversations will lose her.',
    'The Mysterious': ' Embrace the ambiguity. Don\'t demand clarity she\'s not ready to give.',
    'The Diva': ' Maintain your frame. Agree and amplify, never defend or explain.',
    'The Girl Next Door': ' Keep being genuine and kind. She responds to consistency and warmth.',
  }

  advice += archetypeAdvice[persona.archetype] || ''

  return advice
}

// ─── System Messages ───────────────────────────────────────────────────────

export function getPhaseTransitionMessage(phaseName: string): string {
  const messages: Record<string, string> = {
    'Rapport': 'She seems more comfortable with you... 💬',
    'Attraction': 'You feel the energy shifting... sparks are flying ✨',
    'Investment': "She's opening up more, sharing personal things... 🌸",
    'Close': "The moment is right. She's waiting for you to make your move 💫",
  }

  return messages[phaseName] || `Phase changed to: ${phaseName}`
}

// ─── Difficulty Colors ─────────────────────────────────────────────────────

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    Beginner: '#10B981',
    Intermediate: '#F59E0B',
    Advanced: '#F97316',
    Expert: '#EF4444',
    Master: '#8B5CF6',
  }
  return colors[difficulty] || '#F59E0B'
}

// ─── Ethnicity to Image Map ────────────────────────────────────────────────

export function getPersonaImageName(ethnicity: string): string {
  const map: Record<string, string> = {
    'Caucasian/White': 'persona-chloe.jpg',
    'East Asian': 'persona-ava.jpg',
    'South Asian': 'persona-maya.jpg',
    'Latina/Hispanic': 'persona-luna.jpg',
    'Middle Eastern': 'persona-zara.jpg',
    'Black/African': 'persona-sophia.jpg',
  }
  return map[ethnicity] || 'persona-sophia.jpg'
}

// ─── ID Generator ──────────────────────────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
