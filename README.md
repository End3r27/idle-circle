# Idle Circle - Friends-Only Idle RPG Arena

Idle Circle is a cross-platform, privacy-focused **idle RPG web app** designed for small, invite-only friend groups. You and your friends build a squad, assign builds, and let battles happen automatically while you're away. Flex, strategize, and dominate in your **Circle** — a private combat group that only you control.

## 🚀 Features

### 👥 Friends-Only Circles
- Invite-only gameplay (QR or invite link)
- Each Circle is capped (e.g., 10 members max)
- Multiple Circles per user allowed (like guilds)

### ⚔️ Idle Combat System
- Scheduled auto-battles (e.g., every 30min)
- Custom loadouts (offense, defense, support roles)
- Idle battle logs and rewards viewable later

### 🧠 Team Synergy
- Combo bonuses based on Circle composition
- Dual-ultimate skills unlocked by synergy

### 🗓️ Weekly Events
- Boss fights for cooperative reward hunts
- Hidden events unlocked by group behavior (e.g. all online at same time)

### 📢 Social Layer
- Private feed: "Shiro hit level 30!"
- Emoji reacts, comments, and 1v1 "challenge" buttons

### 🎁 Circle Forge
- Risk gear for co-forging
- One-time trade+fusion mechanic

## 🔧 Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Firebase setup (requires CLI installed)
firebase login
firebase init hosting firestore
firebase deploy
```

## 🔐 Tech Stack

- **Frontend**: React + Vite (PWA ready)
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore + Firebase Auth
- **Hosting**: Firebase Hosting (PWA deploy)
- **Realtime**: Firestore listeners + IndexedDB cache
- **Offline**: LocalStorage + Service Worker
- **Auth**: Email/Phone/Google + Invite Code

## 📱 PWA Features

This app is designed to work as a Progressive Web App (PWA) with:
- Offline functionality
- App-like experience on mobile devices
- Push notifications (future feature)
- Automatic updates

## 🧪 Future Content Ideas

### 🏆 **Battle Content**

#### **New Battle Modes**
- **Boss Raids**: Weekly mega-bosses requiring coordinated circle attacks

#### **Environmental Battles**
- **Volcanic Caverns**: Fire damage over time, lava hazards
- **Frozen Wastes**: Speed reduction, ice shield mechanics
- **Cursed Swamps**: Poison effects, healing reduction
- **Ancient Ruins**: Magical amplifiers, random enchantments
- **Stormy Seas**: Lightning strikes, wave knockbacks

### 🎭 **Class & Character Progression**

#### **Advanced Class System**
- **Prestige Classes**: Unlock after reaching level 50 (e.g., Death Knight, Archmage)
- **Dual-Classing**: Combine two classes for hybrid abilities
- **Class Mastery**: Skill trees with multiple specialization paths
- **Awakening System**: Transform classes at high levels with new abilities
- **Class Quests**: Storyline missions to unlock class-specific content

#### **Character Customization**
- **Talent Trees**: Choose specializations within each class
- **Skill Gems**: Socketed abilities that modify attacks
- **Passive Abilities**: Long-term character improvements
- **Combat Styles**: Different fighting approaches (aggressive, defensive, balanced)

### 🎯 **Progression Systems**

#### **Guild/Circle Enhancements**
- **Circle Territories**: Conquerable areas with resource benefits
- **Guild Wars**: Large-scale battles between circles
- **Circle Quests**: Cooperative missions requiring teamwork
- **Circle Halls**: Upgradeable bases with bonuses
- **Alliance System**: Multiple circles working together

#### **Crafting & Economy**
- **Weapon Forging**: Combine materials to create custom weapons
- **Enchanting System**: Add magical properties to equipment
- **Resource Gathering**: Mining, herbalism, monster parts
- **Player Trading**: Marketplace for equipment and materials
- **Auction House**: Bid on rare items

### 🏝️ **World Content**

#### **Exploration**
- **World Map**: Different regions with unique monsters/rewards
- **Hidden Dungeons**: Discoverable through exploration
- **Treasure Hunting**: Rare chests with valuable loot
- **Ancient Temples**: Puzzle-based challenges
- **Monster Habitats**: Biome-specific creature encounters

#### **Seasonal Events**
- **Halloween**: Spooky monsters, ghost abilities, pumpkin rewards
- **Winter Festival**: Ice-themed battles, snow effects
- **Spring Bloom**: Nature magic bonuses, flower decorations
- **Summer Solstice**: Fire damage increases, sun-powered abilities

### 🎁 **Reward Systems**

#### **Collections & Achievements**
- **Monster Codex**: Collect information on defeated creatures
- **Achievement System**: Hundreds of challenging goals
- **Title System**: Earned titles that provide small bonuses
- **Rare Mounts**: Transportation with combat benefits
- **Pet System**: Companion creatures that assist in battle

#### **Endgame Content**
- **Legendary Weapons**: Ultra-rare equipment with unique abilities
- **Artifact System**: Powerful items with set bonuses
- **Reputation System**: Faction standing with various groups
- **Prestige Levels**: Continue progression beyond max level
- **Master Challenges**: Extreme difficulty content for veterans

### 🎨 **Quality of Life**

#### **Social Features**
- **Battle Spectating**: Watch friends' battles in real-time
- **Battle Replays**: Review and share epic moments
- **Circle Chat**: Communication during battles
- **Friend System**: Add allies, see their progress
- **Mentorship**: Veterans guide new players

#### **Customization**
- **Avatar Customization**: Personalize character appearance
- **Battle Arenas**: Different visual environments
- **UI Themes**: Customize interface colors/layouts
- **Victory Poses**: Unique animations for wins
- **Battle Emotes**: Express yourself during combat

### 💡 **Innovative Mechanics**

#### **Dynamic Systems**
- **Weather Effects**: Rain boosts water magic, sun enhances fire
- **Day/Night Cycle**: Different monsters appear at different times
- **Lunar Phases**: Moon cycles affect magic abilities
- **Seasonal Buffs**: Rotating bonuses throughout the year
- **World Events**: Server-wide challenges affecting all players

#### **Strategic Elements**
- **Formation System**: Position party members for bonuses
- **Combo Attacks**: Chain abilities for enhanced effects
- **Terrain Advantages**: High ground, cover, chokepoints
- **Spell Combinations**: Mix different magic types
- **Tactical Retreats**: Strategic withdrawals with penalties/benefits

### 📊 **Meta Game**

#### **Competitive Features**
- **Leaderboards**: Multiple categories (level, damage, wins)
- **Ranked Seasons**: Climb tiers for exclusive rewards
- **Spectator Mode**: Watch top players battle
- **Streamer Integration**: Special features for content creators
- **Esports Support**: Tournament tools and broadcasting

### 🛠️ **Technical Improvements**
- Offline battle simulation using local cache
- Ghost PvP battles when friends are offline
- Customizable avatars with pixel skins
- Weekly ranked Circles
- Discord Rich Presence support

💜 Made by Rylee + Shiro