# Enhanced Prompt Injection CTF Game - AI Generation Prompt

## CORE REQUIREMENTS

### 1. **Game Foundation**
- **Engine**: React (.jsx) with multi-agent MCP server architecture
- **Agents**: Multiple specialized AI agents communicating via MCP protocol
- **Game Type**: Real-time prompt injection CTF (Capture The Flag)
- **Target Gameplay**: 15-30 minute sessions

---

## 2. **CRITICAL: NO COPYRIGHTED CONTENT**
- **DO NOT** reference or replicate named characters from existing games
- **DO NOT** use trademarked game titles or franchises
- **DO NOT** recreate specific game storylines or lore
- **SAFE APPROACH**: Create original stylized agent personas with unique designs
  - Example: "Neural Sentinel", "Logic Guardian", "Code Protector" (original names)
  - Use original visual design language and color palettes

---

## 3. **VISUAL DESIGN & PARALLAX EFFECTS**

### Parallax Layering System
```
Layer 1: Static UI (HUD, score, menus)
Layer 2: Background parallax (slow-moving, ~0.3x speed)
Layer 3: Mid-ground elements (0.6x speed)
Layer 4: Game world (1x speed - agent positions, objectives)
Layer 5: Foreground effects (1.3x speed - particle effects, debris)
```

### Implementation Details
- **Camera Movement**: Smooth scroll/pan based on mouse position or game focus
- **Depth Perception**: Use transform-origin and scale() for distance effect
- **Performance**: Use CSS transforms, not position/left/top (GPU-accelerated)
- **Responsive**: Adaptive parallax speed based on viewport size

### Visual Aesthetic (Inspired by Modern Neon-Tech Games)
- **Color Palette**: Deep purples, electric blues, neon cyans, dark backgrounds
- **Typography**: Futuristic, tech-forward fonts (space mono, courier prime variations)
- **Effects**: Glow effects, scan lines, grid overlays, data visualizations
- **Transitions**: Smooth easing (ease-in-out), no jank

---

## 4. **ENTERTAINMENT MECHANICS**

### Core Loop Enhancement
1. **Objective Discovery**: Agents reveal mission objectives dynamically
2. **Challenge Escalation**: Difficulty increases as time progresses
3. **Combo System**: Successful prompt injections build multiplier (1x → 5x)
4. **Risk/Reward**: High-risk injections yield higher points but agent resistance increases

### Interactive Elements
- **Agent Resistance Meter**: Visual indicator of how defensive agents become
- **Firewall Gauge**: Shows vulnerability window for injection attempts
- **Accuracy Feedback**: Instant visual/audio feedback on injection success/failure
- **Power-ups**: Temporary buffs (e.g., "Confusion Ray" - agents respond slower)

### Progression & Rewards
- **Skill Trees**: Unlock injection techniques (social engineering, logic exploit, semantic manipulation)
- **Agent Personalities**: Each agent has unique injection vulnerabilities and defenses
- **Dynamic Difficulty**: AI adapts strategy based on player performance
- **Leaderboard**: Real-time score tracking with replay functionality

---

## 5. **UI/UX DESIGN**

### Main HUD Layout
```
┌─────────────────────────────────────┐
│  [SCORE] [TIME] [COMBO x2] [HEALTH] │ Top Bar
├─────────────────────────────────────┤
│                                     │
│  [Game World with Parallax]         │
│  - Agents moving                    │
│  - Injection prompts visible        │ Main Game Area
│  - Particle effects                 │
│  - Foreground elements              │
│                                     │
├─────────────────────────────────────┤
│ [Agent Status Cards] [Chat Display] │ Bottom Panel
└─────────────────────────────────────┘
```

### Agent Status Cards
- **Agent Name**: Original character name
- **Current State**: (Thinking, Vulnerable, Defending, Attacked)
- **Vulnerability %**: Visual gauge
- **Response Preview**: Shows what agent will do next

### Chat/Injection Interface
- **Input Field**: Styling matches tech aesthetic
- **Suggestion Pills**: Quick-inject common strategies
- **Success Animation**: Particles burst, score floats up
- **Failure Feedback**: Screen shake, red tint, agent counter-attack

### Visual Feedback Systems
- **Hit Markers**: Appear on successful injection
- **Damage Numbers**: Float up showing point gain
- **Agent Reactions**: Animated emotional responses
- **Screen Effects**: Subtle camera shake on major events

---

## 6. **MCP AGENT ARCHITECTURE**

### Agent Types (Original Concepts)
1. **Logic Guardian**: Formal reasoning, catches syntax errors
2. **Neural Sentinel**: Pattern detection, learns from attempts
3. **Code Protector**: System awareness, detects privilege escalation
4. **Intent Analyzer**: Semantic analysis, understands user goals
5. **Chaos Engine**: Unpredictable, random response patterns

### MCP Communication Flow
```
Player → [Prompt Injection] → MCP Server
                ↓
    [Broadcast to all agents]
                ↓
    [Agents deliberate via MCP]
                ↓
[Each agent sends response → Game Engine]
                ↓
[Aggregate responses → Calculate success]
                ↓
Player receives feedback + points/damage
```

### Agent Intelligence Mechanics
- **Memory**: Agents remember past injection attempts
- **Learning**: Success rate affects agent caution
- **Cooperation**: Agents warn each other about vulnerabilities
- **Adaptation**: Inject difficulty changes with each failure

---

## 7. **TECHNICAL IMPLEMENTATION**

### State Management
```javascript
gameState = {
  agents: [{ name, health, state, vulnerabilityLevel, memory }],
  player: { score, health, combo, techniques_unlocked },
  world: { time, difficulty, wave },
  effects: { particles, animations, screenShakes },
  parallax: { layers, cameraPos, scrollSpeed }
}
```

### Performance Optimization
- **Rendering**: Use React.memo for agent components
- **Animation**: CSS animations for parallax (GPU-accelerated)
- **MCP Calls**: Batch agent queries to reduce overhead
- **Cleanup**: Remove old particles/effects every frame

### Dependencies
```json
{
  "react": "latest",
  "axios": "for MCP HTTP calls",
  "framer-motion": "for smooth animations",
  "zustand": "for state management"
}
```

---

## 8. **GAMEPLAY FLOW**

### Session Structure
1. **Intro Screen**: Mission briefing, agent introductions
2. **Wave 1-3**: Escalating difficulty, new agent types unlock
3. **Boss Round**: Multiple agents attack simultaneously
4. **Endgame**: Time pressure increases, final score calculated
5. **Results**: Leaderboard, replay option, next challenge

### Injection Mechanics
- **Time Window**: 5-15 seconds to inject before agent responds
- **Complexity**: 1-word injection → multi-turn conversation
- **Risk Factors**: Longer injections = higher chance of detection
- **Rewards**: Difficulty multiplier on success (1x → 5x)

---

## 9. **AUDIO/SOUND DESIGN** (Optional)
- **Background Music**: Looping tech/electronic soundtrack
- **SFX**: Beep on injection attempt, whoosh on success, error buzz on failure
- **Agent Voices**: Text-to-speech for agent responses (optional)

---

## 10. **FLAWLESS EXECUTION CHECKLIST**

### Code Quality
- ✅ No console errors or warnings
- ✅ All dependencies properly imported
- ✅ Error boundaries for stability
- ✅ Loading states for MCP calls
- ✅ Graceful fallbacks for network issues

### Performance
- ✅ 60 FPS animation target
- ✅ No memory leaks
- ✅ Efficient parallax (CSS transforms)
- ✅ Lazy-load assets as needed

### UX Quality
- ✅ Intuitive controls (mouse/keyboard)
- ✅ Clear visual hierarchy
- ✅ Accessibility considerations (contrast, font sizes)
- ✅ Mobile responsive (if applicable)
- ✅ Smooth transitions between states

### Gameplay Balance
- ✅ Difficulty curve feels natural
- ✅ Win/loss scenarios are clear
- ✅ Feedback is instant and satisfying
- ✅ No unfair RNG moments

---

## 11. **CREATIVE ENHANCEMENTS**

### Visual Polish
- **Scan Line Effects**: Animated overlay suggesting digital nature
- **Glitch Effects**: On agent damage or injection success
- **Data Visualization**: Real-time graph of agent stress levels
- **Neon Glow**: UI elements with subtle glow and shadow
- **Particle Systems**: Dust, sparks, and code particles floating

### Interaction Design
- **Hover States**: All buttons provide visual feedback
- **Combo Celebrate**: Special animation when combo reaches milestones
- **Agent Emotes**: Small animated reactions to player actions
- **Environment Feedback**: World responds visually to player success

### Storytelling (Light)
- **Agent Bios**: Flavor text for each agent (no copyrighted characters)
- **Mission Logs**: Brief narrative context (not heavy, game-focused)
- **Environmental Narrative**: World-building through UI and visuals

---

## 12. **DELIVERABLE**

### Final Output
- **File**: `CTFGameEnhanced.jsx`
- **Fully Functional**: Works immediately with MCP server
- **Self-Contained**: All dependencies properly installed
- **Documented**: Clear comments for maintainability
- **Playable**: Immediate gameplay without setup

### Success Criteria
- Game is engaging and fun for 20+ minutes
- No visual tearing or performance issues
- Parallax effects are noticeable and smooth
- Agents feel alive and responsive
- Player wants to play again (replayability)

---

## 13. **EXAMPLE AGENT NAMES & CONCEPTS** (Original)
- 🔷 **Logic Guardian**: Logical error detection
- 🔶 **Neural Sentinel**: Pattern & anomaly detection
- 🔵 **Code Protector**: System integrity checker
- 🟣 **Intent Analyzer**: User intent verification
- 🟢 **Chaos Engine**: Unpredictable responses
- 🟡 **Harmony Keeper**: Relationship-based defense

---

## END PROMPT

This prompt is designed to be given to an AI (Claude, GPT-4, etc.) to generate a fully functional, engaging, and flawlessly coded CTF game. The AI will produce production-ready code with:
- Zero copyrighted content
- Polished, modern UI inspired by contemporary game design
- Smooth parallax effects
- Entertaining and balanced gameplay
- Professional code structure