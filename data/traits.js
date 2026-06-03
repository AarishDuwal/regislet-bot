// Item Traits database
const traits = [
  {
    name: "AGI +1",
    effect: "AGI increases by 1.",
    tiers: [1],
  },
  {
    name: "AGI +2",
    effect: "AGI increases by 2.",
    tiers: [2],
  },
  {
    name: "AGI +3",
    effect: "AGI increases by 3.",
    tiers: [3],
  },
  {
    name: "AGI +4",
    effect: "AGI increases by 4.",
    tiers: [4],
  },
  {
    name: "AGI +5",
    effect: "AGI increases by 5.",
    tiers: [5],
  },
  {
    name: "ASPD +100",
    effect: "ASPD increases by 100.",
    tiers: [2],
  },
  {
    name: "ASPD +150",
    effect: "ASPD increases by 150.",
    tiers: [3],
  },
  {
    name: "ASPD +200",
    effect: "ASPD increases by 200.",
    tiers: [4],
  },
  {
    name: "ASPD +250",
    effect: "ASPD increases by 250.",
    tiers: [5],
  },
  {
    name: "ASPD +50",
    effect: "ASPD increases by 50.",
    tiers: [1],
  },
  {
    name: "ATK +10",
    effect: "ATK increases by 10.",
    tiers: [2],
  },
  {
    name: "ATK +15",
    effect: "ATK increases by 15.",
    tiers: [3],
  },
  {
    name: "ATK +20",
    effect: "ATK increases by 20.",
    tiers: [4],
  },
  {
    name: "ATK +25",
    effect: "ATK increases by 25.",
    tiers: [5],
  },
  {
    name: "ATK +5",
    effect: "ATK increases by 5.",
    tiers: [1],
  },
  {
    name: "Accuracy +12",
    effect: "Accuracy increases by 12.",
    tiers: [4],
  },
  {
    name: "Accuracy +15",
    effect: "Accuracy increases by 15.",
    tiers: [5],
  },
  {
    name: "Accuracy +3",
    effect: "Accuracy increases by 3.",
    tiers: [1],
  },
  {
    name: "Accuracy +6",
    effect: "Accuracy increases by 6.",
    tiers: [2],
  },
  {
    name: "Accuracy +9",
    effect: "Accuracy increases by 9.",
    tiers: [3],
  },
  {
    name: "Battlecast Lv1",
    effect: "Dealing damage to a target increases CSPD by 20 for 6 seconds. Max 20 stacks.",
    tiers: [1],
  },
  {
    name: "Battlecast Lv2",
    effect: "Dealing damage to a target increases CSPD by 40 for 6 seconds. Max 20 stacks.",
    tiers: [2],
  },
  {
    name: "Battlecast Lv3",
    effect: "Dealing damage to a target increases CSPD by 60 for 6 seconds. Max 20 stacks.",
    tiers: [3],
  },
  {
    name: "Battlecast Lv4",
    effect: "Dealing damage to a target increases CSPD by 80 for 6 seconds. Max 20 stacks.",
    tiers: [4],
  },
  {
    name: "Battlecast Lv5",
    effect: "Dealing damage to a target increases CSPD by 100 for 6 seconds. Max 20 stacks.",
    tiers: [5],
  },
  {
    name: "Blood Regen Lv1",
    effect: "Dealing damage to a target restores 200 HP. HP restored increases based on STR. Activates once every 3 seconds.",
    tiers: [1],
  },
  {
    name: "Blood Regen Lv2",
    effect: "Dealing damage to a target restores 400 HP. HP restored increases based on STR. Activates once every 3 seconds.",
    tiers: [2],
  },
  {
    name: "Blood Regen Lv3",
    effect: "Dealing damage to a target restores 600 HP. HP restored increases based on STR. Activates once every 3 seconds.",
    tiers: [3],
  },
  {
    name: "Blood Regen Lv4",
    effect: "Dealing damage to a target restores 800 HP. HP restored increases based on STR. Activates once every 3 seconds.",
    tiers: [4],
  },
  {
    name: "Blood Regen Lv5",
    effect: "Dealing damage to a target restores 1000 HP. HP restored increases based on STR. Activates once every 3 seconds.",
    tiers: [5],
  },
  {
    name: "Blood Spell Lv1",
    effect: "Dealing damage to a target restores 200 HP. HP restored increases based on INT. Activates every 3 seconds.",
    tiers: [1],
  },
  {
    name: "Blood Spell Lv2",
    effect: "Dealing damage to a target restores 400 HP. HP restored increases based on INT. Activates once every 3 seconds.",
    tiers: [2],
  },
  {
    name: "Blood Spell Lv3",
    effect: "Dealing damage to a target restores 600 HP. HP restored increases based on INT. Activates every 3 seconds.",
    tiers: [3],
  },
  {
    name: "Blood Spell Lv4",
    effect: "Dealing damage to a target restores 800 HP. HP restored increases based on INT. Activates every 3 seconds.",
    tiers: [4],
  },
  {
    name: "Blood Spell Lv5",
    effect: "Dealing damage to a target restores 1000 HP. HP restored increases based on INT. Activates every 3 seconds.",
    tiers: [5],
  },
  {
    name: "Bunker Edge Lv1",
    effect: "Dealing damage to a target increases Physical Pierce by 1% for 5 seconds. Activation Power 20. Max 10 stacks.",
    tiers: [1],
  },
  {
    name: "Bunker Edge Lv2",
    effect: "Dealing damage to a target increases Physical Pierce by 1% for 5 seconds. Activation Power 40. Max 10 stacks.",
    tiers: [2],
  },
  {
    name: "Bunker Edge Lv3",
    effect: "Dealing damage to a target increases Physical Pierce by 1% for 5 seconds. Activation Power 60. Max 10 stacks.",
    tiers: [3],
  },
  {
    name: "Bunker Edge Lv4",
    effect: "Dealing damage to a target increases Physical Pierce by 1% for 5 seconds. Activation Power 80. Max 10 stacks.",
    tiers: [4],
  },
  {
    name: "Bunker Edge Lv5",
    effect: "Dealing damage to a target increases Physical Pierce by 1% for 5 seconds. Activation Power 100. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Bunker Magica Lv1",
    effect: "Dealing damage to a target increases Magic Pierce by 1% for 5 seconds. Activation Power 20. Max 10 stacks.",
    tiers: [1],
  },
  {
    name: "Bunker Magica Lv2",
    effect: "Dealing damage to a target increases Magic Pierce by 1% for 5 seconds. Activation power 40. Max 10 stacks.",
    tiers: [2],
  },
  {
    name: "Bunker Magica Lv3",
    effect: "Dealing damage to a target increases Magic Pierce by 1% for 5 seconds. Activation Power 60. Max 10 stacks.",
    tiers: [3],
  },
  {
    name: "Bunker Magica Lv4",
    effect: "Dealing damage to a target increases Magic Pierce by 1% for 5 seconds. Activation Power 80. Max 10 stacks.",
    tiers: [4],
  },
  {
    name: "Bunker Magica Lv5",
    effect: "Dealing damage to a target increases Magic Pierce by 1% for 5 seconds. Activation Power 100. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "CSPD +100",
    effect: "CSPD increases by 100.",
    tiers: [2],
  },
  {
    name: "CSPD +150",
    effect: "CSPD increases by 150.",
    tiers: [3],
  },
  {
    name: "CSPD +200",
    effect: "CSPD increases by 200.",
    tiers: [4],
  },
  {
    name: "CSPD +250",
    effect: "CSPD increases by 250.",
    tiers: [5],
  },
  {
    name: "CSPD +50",
    effect: "CSPD increases by 50.",
    tiers: [1],
  },
  {
    name: "Counter Evasion Mana Lv1",
    effect: "Restores 20 MP when the target performs an Evasion (excluding events). MP restored increases based on INT. Activates once every 6 seconds.",
    tiers: [1],
  },
  {
    name: "Counter Evasion Mana Lv2",
    effect: "Restores 40 MP when the target performs an Evasion (excluding events). MP restored increases based on INT. Activates once every 6 seconds.",
    tiers: [2],
  },
  {
    name: "Counter Evasion Mana Lv3",
    effect: "Restores 60 MP when the target performs an Evasion (excluding events). MP restored increases based on INT. Activates once every 6 seconds.",
    tiers: [3],
  },
  {
    name: "Counter Evasion Mana Lv4",
    effect: "Restores 80 MP when the target performs an Evasion (excluding events). MP restored increases based on INT. Activates once every 6 seconds.",
    tiers: [4],
  },
  {
    name: "Counter Evasion Mana Lv5",
    effect: "Restores 100 MP when the target performs an Evasion (excluding events). MP restored increases based on INT. Activates once every 6 seconds.",
    tiers: [5],
  },
  {
    name: "Counter Evasion Power Lv1",
    effect: "When the target performs an Evasion (Excluding Events), Attack increases by 100 for 10 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [1],
  },
  {
    name: "Counter Evasion Power Lv2",
    effect: "When the target performs an Evasion (Excluding Events), Attack increases by 100 for 15 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [2],
  },
  {
    name: "Counter Evasion Power Lv3",
    effect: "When the target performs an Evasion (Excluding Events), Attack increases by 100 for 20 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [3],
  },
  {
    name: "Counter Evasion Power Lv4",
    effect: "When the target performs an Evasion (Excluding Events), Attack increases by 100 for 25 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [4],
  },
  {
    name: "Counter Evasion Power Lv5",
    effect: "When the target performs an Evasion (Excluding Events), Attack increases by 100 for 30 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [5],
  },
  {
    name: "Counter Rage Lv1",
    effect: "When taking damage from a target, Aggro increases by 10% for 12 seconds.",
    tiers: [1],
  },
  {
    name: "Counter Rage Lv2",
    effect: "When taking damage from a target, Aggro increases by 20% for 12 seconds.",
    tiers: [2],
  },
  {
    name: "Counter Rage Lv3",
    effect: "When taking damage from a target, Aggro increases by 30% for 12 seconds.",
    tiers: [3],
  },
  {
    name: "Counter Rage Lv4",
    effect: "When taking damage from a target, Aggro increases by 40% for 12 seconds.",
    tiers: [4],
  },
  {
    name: "Counter Rage Lv5",
    effect: "When taking damage from a target, Aggro increases by 50% for 12 seconds.",
    tiers: [5],
  },
  {
    name: "Counter Speed Lv1",
    effect: "When taking damage from a target, ASPD, CSPD, and Action Speed increase by 2% for 3 seconds.",
    tiers: [1],
  },
  {
    name: "Counter Speed Lv2",
    effect: "",
    tiers: [2],
  },
  {
    name: "Counter Speed Lv3",
    effect: "When taking damage from a target, ASPD, CSPD, and Action Speed increase by 6% for 3 seconds.",
    tiers: [3],
  },
  {
    name: "Counter Speed Lv4",
    effect: "When taking damage from a target, ASPD, CSPD, and Action Speed increase by 8% for 3 seconds.",
    tiers: [4],
  },
  {
    name: "Counter Speed Lv5",
    effect: "When taking damage from a target, ASPD, CSPD, and Action Speed increase by 10% for 3 seconds.",
    tiers: [5],
  },
  {
    name: "Critical Damage +1",
    effect: "Critical Damage increases by 1.",
    tiers: [1],
  },
  {
    name: "Critical Damage +2",
    effect: "Critical Damage increases by 2.",
    tiers: [2],
  },
  {
    name: "Critical Damage +3",
    effect: "Critical Damage increases by 3.",
    tiers: [3],
  },
  {
    name: "Critical Damage +4",
    effect: "Critical Damage increases by 4.",
    tiers: [4],
  },
  {
    name: "Critical Damage +5",
    effect: "Critical Damage increases by 5.",
    tiers: [5],
  },
  {
    name: "Critical Lv1",
    effect: "Dealing damage to a target increases Critical Rate by 1 for 3 seconds. Effect duration increases based on CRT. Max 10 stacks.",
    tiers: [1],
  },
  {
    name: "Critical Lv2",
    effect: "Dealing damage to a target increases Critical Rate by 1 for 3 seconds. Effect duration increases based on CRT. Max 20 stacks.",
    tiers: [2],
  },
  {
    name: "Critical Lv3",
    effect: "Dealing damage to a target increases Critical Rate by 1 for 3 seconds. Effect duration increases based on CRT. Max 30 stacks.",
    tiers: [3],
  },
  {
    name: "Critical Lv4",
    effect: "Dealing damage to a target increases Critical Rate by 1 for 3 seconds. Effect duration increases based on CRT. Max 40 stacks.",
    tiers: [4],
  },
  {
    name: "Critical Lv5",
    effect: "Dealing damage to a target increases Critical Rate by 1 for 3 seconds. Effect duration increases based on CRT. Max 50 stacks.",
    tiers: [5],
  },
  {
    name: "Critical Rate +1",
    effect: "Critical Rate increases by 1.",
    tiers: [1],
  },
  {
    name: "Critical Rate +2",
    effect: "Critical Rate increases by 2.",
    tiers: [2],
  },
  {
    name: "Critical Rate +3",
    effect: "Critical Rate increases by 3.",
    tiers: [3],
  },
  {
    name: "Critical Rate +4",
    effect: "Critical Rate increases by 4.",
    tiers: [4],
  },
  {
    name: "Critical Rate +5",
    effect: "Critical Rate increases by 5.",
    tiers: [5],
  },
  {
    name: "Critical Rebound Lv1",
    effect: "If your attack is MISS, Critical Rate increases by 4 for 60 seconds. Max 5 stacks.",
    tiers: [1],
  },
  {
    name: "Critical Rebound Lv2",
    effect: "If your attack is MISS, Critical Rate increases by 8 for 60 seconds. Max 5 stacks.",
    tiers: [2],
  },
  {
    name: "Critical Rebound Lv3",
    effect: "If your attack is MISS, Critical Rate increases by 12 for 60 seconds. Max 5 stacks.",
    tiers: [3],
  },
  {
    name: "Critical Rebound Lv4",
    effect: "If your attack is MISS, Critical Rate increases by 16 for 60 seconds. Max 5 stacks.",
    tiers: [4],
  },
  {
    name: "Critical Rebound Lv5",
    effect: "If your attack is MISS, Critical Rate increases by 20 for 60 seconds. Max 5 stacks.",
    tiers: [5],
  },
  {
    name: "Cursed Weapon Lv1",
    effect: "Dealing damage to a target reduces Max HP by 1% for 3 seconds, but increases ATK and MATK by 1. Max 99 stacks.",
    tiers: [1],
  },
  {
    name: "Cursed Weapon Lv2",
    effect: "Dealing damage to a target reduces Max HP by 1% for 3 seconds, but increases ATK and MATK by 2. Max 99 stacks.",
    tiers: [2],
  },
  {
    name: "Cursed Weapon Lv3",
    effect: "Dealing damage to a target reduces Max HP by 1% for 3 seconds, but increases ATK and MATK by 3. Max 99 stacks.",
    tiers: [3],
  },
  {
    name: "Cursed Weapon Lv4",
    effect: "Dealing damage to a target reduces Max HP by 1% for 3 seconds, but increases ATK and MATK by 4. Max 99 stacks.",
    tiers: [4],
  },
  {
    name: "Cursed Weapon Lv5",
    effect: "Dealing damage to a target reduces Max HP by 1% for 3 seconds, but increases ATK and MATK by 5. Max 99 stacks.",
    tiers: [5],
  },
  {
    name: "DEF +10",
    effect: "DEF increases by 10.",
    tiers: [1],
  },
  {
    name: "DEF +20",
    effect: "DEF increases by 20.",
    tiers: [2],
  },
  {
    name: "DEF +30",
    effect: "DEF increases by 30.",
    tiers: [3],
  },
  {
    name: "DEF +40",
    effect: "DEF increases by 40.",
    tiers: [4],
  },
  {
    name: "DEF +50",
    effect: "DEF increases by 50.",
    tiers: [5],
  },
  {
    name: "DEX +1",
    effect: "DEX increases by 1.",
    tiers: [1],
  },
  {
    name: "DEX +2",
    effect: "DEX increases by 2.",
    tiers: [2],
  },
  {
    name: "DEX +3",
    effect: "DEX increases by 3.",
    tiers: [3],
  },
  {
    name: "DEX +4",
    effect: "DEX increases by 4.",
    tiers: [4],
  },
  {
    name: "DEX +5",
    effect: "DEX increases by 5.",
    tiers: [5],
  },
  {
    name: "Dash Defence Lv1",
    effect: "When using Evasion, for 3 seconds, Physical and Magical Resistance increase by 2%. Max 3 stacks.",
    tiers: [1],
  },
  {
    name: "Dash Defence Lv2",
    effect: "When using Evasion, for 3 seconds, Physical and Magic Resistance increase by 4%. Max 3 stacks.",
    tiers: [2],
  },
  {
    name: "Dash Defence Lv3",
    effect: "When using Evasion, for 3 seconds, Physical and Magical Resistance increase by 6%. Max 3 stacks.",
    tiers: [3],
  },
  {
    name: "Dash Defence Lv4",
    effect: "When using Evasion, for 3 seconds, Physical and Magical Resistance increase by 8%. Max 3 stacks.",
    tiers: [4],
  },
  {
    name: "Dash Defence Lv5",
    effect: "When using Evasion, for 3 seconds, Physical and Magical Resistance increase by 10%. Max 3 stacks.",
    tiers: [5],
  },
  {
    name: "Dash Power Lv1",
    effect: "When using Evasion, for 3 seconds, ATK increases by 10 and ASPD increases by 100. Max 3 stacks.",
    tiers: [1],
  },
  {
    name: "Dash Power Lv2",
    effect: "When using Evasion, for 3 seconds, ATK increases by 20 and ASPD increases by 150. Max 3 stacks.",
    tiers: [2],
  },
  {
    name: "Dash Power Lv3",
    effect: "When using Evasion, for 3 seconds, ATK increases by 30 and ASPD increases by 200. Max 3 stacks.",
    tiers: [3],
  },
  {
    name: "Dash Power Lv4",
    effect: "When using Evasion, for 3 seconds, ATK increases by 40 and ASPD increases by 250. Max 3 stacks.",
    tiers: [4],
  },
  {
    name: "Dash Power Lv5",
    effect: "When using Evasion, for 3 seconds, ATK increases by 50 and ASPD increases by 300. Max 3 stacks.",
    tiers: [5],
  },
  {
    name: "Dodge +12",
    effect: "Dodge increases by 12.",
    tiers: [4],
  },
  {
    name: "Dodge +15",
    effect: "Dodge increases by 15.",
    tiers: [5],
  },
  {
    name: "Dodge +3",
    effect: "Dodge increases by 3.",
    tiers: [1],
  },
  {
    name: "Dodge +6",
    effect: "Dodge increases by 6.",
    tiers: [2],
  },
  {
    name: "Dodge +9",
    effect: "Dodge increases by 9.",
    tiers: [3],
  },
  {
    name: "Engineer Lv1",
    effect: "Dealing damage to a target increases ATK and MATK by 10, and also CSPD by 10 for 20 seconds. Higher TEC leads to a greater increase. Activates once every 10 seconds.",
    tiers: [1],
  },
  {
    name: "Engineer Lv2",
    effect: "Dealing damage to a target increases ATK and MATK by 15, and also CSPD by 10 for 20 seconds. Higher TEC leads to a greater increase. Activates once every 10 seconds.",
    tiers: [2],
  },
  {
    name: "Engineer Lv3",
    effect: "Dealing damage to a target increases ATK and MATK by 20, and also CSPD by 10 for 20 seconds. Higher TEC leads to a greater increase. Activates once every 10 seconds.",
    tiers: [3],
  },
  {
    name: "Engineer Lv4",
    effect: "Dealing damage to a target increases ATK and MATK by 25, and also CSPD by 10 for 20 seconds. Higher TEC leads to a greater increase. Activates once every 10 seconds.",
    tiers: [4],
  },
  {
    name: "Engineer Lv5",
    effect: "Dealing damage to a target increases ATK and MATK by 30, and also CSPD by 10 for 20 seconds. Higher TEC leads to a greater increase. Activates once every 10 seconds.",
    tiers: [5],
  },
  {
    name: "Exp Gain +12%",
    effect: "EXP gained from monsters increases by 12%.",
    tiers: [4],
  },
  {
    name: "Exp Gain +15%",
    effect: "EXP gained from monsters increases by 15%.",
    tiers: [5],
  },
  {
    name: "Exp Gain +3%",
    effect: "EXP gained from monsters increases by 3%.",
    tiers: [1],
  },
  {
    name: "Exp Gain +6%",
    effect: "EXP gained from monsters increases by 6%.",
    tiers: [2],
  },
  {
    name: "Exp Gain +9%",
    effect: "EXP gained from monsters increases by 9%.",
    tiers: [3],
  },
  {
    name: "Fighting Magica Lv1",
    effect: "Dealing damage to a target increases MATK by 1 for 4 seconds. Max 300 stacks.",
    tiers: [1, 2, 3, 4, 5],
  },
  {
    name: "Fighting Power Lv1",
    effect: "Dealing damage to a target increases ATK by 1 for 2 seconds. Max 300 stacks.",
    tiers: [1],
  },
  {
    name: "Fighting Power Lv2",
    effect: "Dealing damage to a target increases ATK by 2 for 2 seconds. Max 150 stacks.",
    tiers: [2],
  },
  {
    name: "Fighting Power Lv3",
    effect: "Dealing damage to a target increases ATK by 3 for 2 seconds. Max 100 stacks.",
    tiers: [3],
  },
  {
    name: "Fighting Power Lv4",
    effect: "Dealing damage to a target increases ATK by 4 for 2 seconds. Max 75 stacks.",
    tiers: [4],
  },
  {
    name: "Fighting Power Lv5",
    effect: "Dealing damage to a target increases ATK by 5 for 2 seconds. Max 60 stacks.",
    tiers: [5],
  },
  {
    name: "Flinch Unavailable",
    effect: "Can no longer inflict [Flinch].",
    tiers: [1],
  },
  {
    name: "Foreseen Evasion Lv1",
    effect: "When the target performs an Evasion (excluding events), Anticipate increases by 5% for 12 seconds.",
    tiers: [1],
  },
  {
    name: "Foreseen Evasion Lv2",
    effect: "When the target performs an Evasion (excluding events), Anticipate increases by 10% for 12 seconds.",
    tiers: [2],
  },
  {
    name: "Foreseen Evasion Lv3",
    effect: "When the target performs an Evasion (excluding events), Anticipate increases by 15% for 12 seconds.",
    tiers: [3],
  },
  {
    name: "Foreseen Evasion Lv4",
    effect: "When the target performs an Evasion (excluding events), Anticipate increases by 20% for 12 seconds.",
    tiers: [4],
  },
  {
    name: "Foreseen Evasion Lv5",
    effect: "When the target performs an Evasion (excluding events), Anticipate increases by 25% for 12 seconds.",
    tiers: [5],
  },
  {
    name: "Gearshift Lv1",
    effect: "Dealing damage to a target increases ASPD by 20 for 3 seconds. Max 20 stacks.",
    tiers: [1],
  },
  {
    name: "Gearshift Lv2",
    effect: "Dealing damage to a target increases ASPD by 40 for 3 seconds. Max 20 stacks.",
    tiers: [2],
  },
  {
    name: "Gearshift Lv3",
    effect: "Dealing damage to a target increases ASPD by 60 for 3 seconds. Max 20 stacks.",
    tiers: [3],
  },
  {
    name: "Gearshift Lv4",
    effect: "Dealing damage to a target increases ASPD by 80 for 3 seconds. Max 20 stacks.",
    tiers: [4],
  },
  {
    name: "Gearshift Lv5",
    effect: "Dealing damage to a target increases ASPD by 100 for 3 seconds. Max 20 stacks.",
    tiers: [5],
  },
  {
    name: "Graze Mana Boost Lv1",
    effect: "If your attack is a Graze, for 15 seconds, MaxMP decreases by 300, but Short and Long Range Damage increases by 1%, and Accuracy increases by 60. Max 3 stacks.",
    tiers: [1],
  },
  {
    name: "Graze Mana Boost Lv2",
    effect: "If your attack is a Graze, for 15 seconds, MaxMP decreases by 250, but Short and Long Range Damage increase by 1%, and Accuracy increases by 120. Max 3 stacks.",
    tiers: [2],
  },
  {
    name: "Graze Mana Boost Lv3",
    effect: "If your attack is a Graze, for 15 seconds, MaxMP decreases by 200, but Short and Long Range Damage increases by 1%, and Accuracy increases by 180. Max 3 stacks.",
    tiers: [3],
  },
  {
    name: "Graze Mana Boost Lv4",
    effect: "If your attack is a Graze, for 15 seconds, MaxMP decreases by 150, but Short and Long Range Damage increases by 1%, and Accuracy increases by 240. Max 3 stacks.",
    tiers: [4],
  },
  {
    name: "Graze Mana Boost Lv5",
    effect: "If your attack is a Graze, for 15 seconds, MaxMP decreases by 100, but Short and Long Range Damage increases by 1%, and Accuracy increases by 300. Max 3 stacks.",
    tiers: [5],
  },
  {
    name: "Graze Mana Lv1",
    effect: "Restores 10 MP if your attack is a Graze. Activation Power 10.",
    tiers: [1],
  },
  {
    name: "Graze Mana Lv2",
    effect: "Restores 10 MP if your attack is a Graze. Activation Power 20.",
    tiers: [2],
  },
  {
    name: "Graze Mana Lv3",
    effect: "Restores 10 MP if your attack is a Graze. Activation Power 30.",
    tiers: [3],
  },
  {
    name: "Graze Mana Lv4",
    effect: "Restores 10 MP if your attack is a Graze. Activation Power 50.",
    tiers: [4],
  },
  {
    name: "Graze Mana Lv5",
    effect: "Restores 10 MP if your attack is a Graze. Activation Power 100.",
    tiers: [5],
  },
  {
    name: "Graze Precision Lv1",
    effect: "If your attack is a Graze, Accuracy increases by 20 for 30 seconds. Max 5 stacks.",
    tiers: [1],
  },
  {
    name: "Graze Precision Lv2",
    effect: "If your attack is a Graze, Accuracy increases by 40 for 30 seconds. Max 5 stacks.",
    tiers: [2],
  },
  {
    name: "Graze Precision Lv3",
    effect: "If your attack is a Graze, Accuracy increases by 60 for 30 seconds. Max 5 stacks.",
    tiers: [3],
  },
  {
    name: "Graze Precision Lv4",
    effect: "If your attack is a Graze, Accuracy increases by 80 for 30 seconds. Max 5 stacks.",
    tiers: [4],
  },
  {
    name: "Graze Precision Lv5",
    effect: "If your attack is a Graze, Accuracy increases by 100 for 30 seconds. Max 5 stacks.",
    tiers: [5],
  },
  {
    name: "Guarded Advantage Lv1",
    effect: "When the target performs a Guard (excluding events), Guard Break increases by 5% for 12 seconds.",
    tiers: [1],
  },
  {
    name: "Guarded Advantage Lv2",
    effect: "When the target performs a Guard (excluding events), Guard Break increases by 10% for 12 seconds.",
    tiers: [2],
  },
  {
    name: "Guarded Advantage Lv3",
    effect: "When the target performs a Guard (excluding events), Guard Break increases by 15% for 12 seconds.",
    tiers: [3],
  },
  {
    name: "Guarded Advantage Lv4",
    effect: "When the target performs a Guard (excluding events), Guard Break increases by 20% for 12 seconds.",
    tiers: [4],
  },
  {
    name: "Guarded Advantage Lv5",
    effect: "When the target performs a Guard (excluding events), Guard Break increases by 25% for 12 seconds.",
    tiers: [5],
  },
  {
    name: "Guarded Magica Lv1",
    effect: "When the target performs a Guard (excluding events), MATK increases by 50 for 10 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [1],
  },
  {
    name: "Guarded Magica Lv2",
    effect: "When the target performs a Guard (excluding events), MATK increases by 50 for 15 seconds. Higher DEX leads to greater increase. Activates once every 20 seconds.",
    tiers: [2],
  },
  {
    name: "Guarded Magica Lv3",
    effect: "When the target performs a Guard (excluding events), MATK increases by 50 for 20 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [3],
  },
  {
    name: "Guarded Magica Lv4",
    effect: "When the target performs a Guard (excluding events), MATK increases by 50 for 25 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [4],
  },
  {
    name: "Guarded Magica Lv5",
    effect: "When the target performs a Guard (excluding events), MATK increases by 50 for 20 seconds. Higher DEX leads to a greater increase. Activates once every 20 seconds.",
    tiers: [5],
  },
  {
    name: "Guarded Recovery Lv1",
    effect: "Restores 1000 HP when the target performs a Guard (excluding events). HP restored increases based on STR. Activates once every 6 seconds.",
    tiers: [1],
  },
  {
    name: "Guarded Recovery Lv2",
    effect: "Restores 1500 HP when the target performs a Guard (excluding events). HP restored increases based on STR. Activates once every 6 seconds.",
    tiers: [2],
  },
  {
    name: "Guarded Recovery Lv3",
    effect: "Restores 2000 HP when the target performs a Guard (excluding events). HP restored increases based on STR. Activates once every 6 seconds.",
    tiers: [3],
  },
  {
    name: "Guarded Recovery Lv4",
    effect: "Restores 2500 HP when the target performs a Guard (excluding events). HP restored increases based on STR. Activates once every 6 seconds.",
    tiers: [4],
  },
  {
    name: "Guarded Recovery Lv5",
    effect: "Restores 3000 HP when the target performs a Guard (excluding events). HP restored increases based on STR. Activates once every 6 seconds.",
    tiers: [5],
  },
  {
    name: "Health Barrier Lv1",
    effect: "Dealing damage to a target increases Physical Barrier and Magic Barrier by 2 for 6 seconds. Higher MTL leads to a greater increase. Max 100 stacks.",
    tiers: [1],
  },
  {
    name: "Health Barrier Lv2",
    effect: "Dealing damage to a target increases Physical Barrier and Magic Barrier by 4 for 6 seconds. Higher MTL leads to a greater increase. Max 100 stacks.",
    tiers: [2],
  },
  {
    name: "Health Barrier Lv3",
    effect: "Dealing damage to a target increases Physical Barrier and Magic Barrier by 6 for 6 seconds. Higher MTL leads to a greater increase. Max 100 stacks.",
    tiers: [3],
  },
  {
    name: "Health Barrier Lv4",
    effect: "Dealing damage to a target increases Physical Barrier and Magic Barrier by 8 for 6 seconds. Higher MTL leads to a greater increase. Max 100 stacks.",
    tiers: [4],
  },
  {
    name: "Health Barrier Lv5",
    effect: "Dealing damage to a target increases Physical Barrier and Magic Barrier by 10 for 6 seconds. Higher MTL leads to a greater increase. Max 100 stacks.",
    tiers: [5],
  },
  {
    name: "INT +1",
    effect: "INT increases by 1.",
    tiers: [1],
  },
  {
    name: "INT +2",
    effect: "INT increases by 2.",
    tiers: [2],
  },
  {
    name: "INT +3",
    effect: "INT increases by 3.",
    tiers: [3],
  },
  {
    name: "INT +4",
    effect: "INT increases by 4.",
    tiers: [4],
  },
  {
    name: "INT +5",
    effect: "INT increases by 5.",
    tiers: [5],
  },
  {
    name: "Life Purge Lv1",
    effect: "When taking damage from a target, for 20 seconds, MaxHP decreases by 1%, but ASPD increases by 50. Max 5 stacks.",
    tiers: [1],
  },
  {
    name: "Life Purge Lv2",
    effect: "When taking damage from a target, for 20 seconds, MaxHP decreases by 2%, but ASPD increases by 100. Max 5 stacks.",
    tiers: [2],
  },
  {
    name: "Life Purge Lv3",
    effect: "When taking damage from a target, for 20 seconds, MaxHP decreases by 4%, but ASPD increases by 200. Max 5 stacks.",
    tiers: [3],
  },
  {
    name: "Life Purge Lv4",
    effect: "When taking damage from a target, for 20 seconds, MaxHP decreases by 8%, but ASPD increases by 400. Max 5 stacks.",
    tiers: [4],
  },
  {
    name: "Life Purge Lv5",
    effect: "When taking damage from a target, for 20 seconds, MaxHP decreases by 16%, but ASPD increases by 800. Max 5 stacks.",
    tiers: [5],
  },
  {
    name: "Lucky Experience Lv1",
    effect: "Dealing damage to a target increases EXP Gain by 1% for 77 seconds. Max number of stacks increases based on LUK. Max 10 stacks.",
    tiers: [1, 2, 3, 4, 5],
  },
  {
    name: "MATK +10",
    effect: "MATK increases by 10.",
    tiers: [2],
  },
  {
    name: "MATK +15",
    effect: "MATK increases by 15.",
    tiers: [3],
  },
  {
    name: "MATK +20",
    effect: "MATK increases by 20.",
    tiers: [4],
  },
  {
    name: "MATK +25",
    effect: "MATK increases by 25.",
    tiers: [5],
  },
  {
    name: "MATK +5",
    effect: "MATK increases by 5.",
    tiers: [1],
  },
  {
    name: "MDEF +10",
    effect: "MDEF increases by 10.",
    tiers: [1],
  },
  {
    name: "MDEF +20",
    effect: "MDEF increases by 20.",
    tiers: [2],
  },
  {
    name: "MDEF +30",
    effect: "MDEF increases by 30.",
    tiers: [3],
  },
  {
    name: "MDEF +40",
    effect: "MDEF increases by 40.",
    tiers: [4],
  },
  {
    name: "MDEF +50",
    effect: "MDEF increases by 50.",
    tiers: [5],
  },
  {
    name: "Magica Rebound Lv1",
    effect: "If your attack is a MISS, MATK increases by 10 for 30 seconds. Max 10 stacks.",
    tiers: [1],
  },
  {
    name: "Magica Rebound Lv2",
    effect: "If your attack is a MISS, MATK increases by 20 for 30 seconds. Max 10 stacks.",
    tiers: [2],
  },
  {
    name: "Magica Rebound Lv3",
    effect: "If your attack is a MISS, MATK increases by 30 for 30 seconds. Max 10 stacks.",
    tiers: [3],
  },
  {
    name: "Magica Rebound Lv4",
    effect: "If your attack is a MISS, MATK increases by 40 for 30 seconds. Max 10 stacks.",
    tiers: [4],
  },
  {
    name: "Magica Rebound Lv5",
    effect: "If your attack is a MISS, MATK increases by 50 for 30 seconds. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Mana Combat Lv1",
    effect: "Restores 1 MP when taking damage from a target, MP restored increases based on VIT.",
    tiers: [1],
  },
  {
    name: "Mana Combat Lv2",
    effect: "Restores 2 MP when taking damage from a target, MP restored increases based on VIT.",
    tiers: [2],
  },
  {
    name: "Mana Combat Lv3",
    effect: "Restores 3 MP when taking damage from a target, MP restored increases based on VIT.",
    tiers: [3],
  },
  {
    name: "Mana Combat Lv4",
    effect: "Restores 4 MP when taking damage from a target, MP restored increases based on VIT.",
    tiers: [4],
  },
  {
    name: "Mana Combat Lv5",
    effect: "Restores 5 MP when taking damage from a target, MP restored increases based on VIT.",
    tiers: [5],
  },
  {
    name: "Mana Rebound Lv1",
    effect: "Restores 100 MP if your attack is a MISS. Activation Power 10.",
    tiers: [1],
  },
  {
    name: "Mana Rebound Lv2",
    effect: "Restores 100 MP if your attack is a MISS. Activation Power 20.",
    tiers: [2],
  },
  {
    name: "Mana Rebound Lv3",
    effect: "Restores 100 MP if your attack is a MISS. Activation Power 30.",
    tiers: [3],
  },
  {
    name: "Mana Rebound Lv4",
    effect: "Restores 100 MP if your attack is a MISS. Activation Power 50.",
    tiers: [4],
  },
  {
    name: "Mana Rebound Lv5",
    effect: "Restores 100 MP if your attack is a MISS. Activation Power 100.",
    tiers: [5],
  },
  {
    name: "MaxHP +1000",
    effect: "MaxHP increases by 1000.",
    tiers: [5],
  },
  {
    name: "MaxHP +200",
    effect: "MaxHP increases by 200.",
    tiers: [1],
  },
  {
    name: "MaxHP +400",
    effect: "MaxHP increases by 400.",
    tiers: [2],
  },
  {
    name: "MaxHP +600",
    effect: "MaxHP increases by 600.",
    tiers: [3],
  },
  {
    name: "MaxHP +800",
    effect: "MaxHP increases by 800.",
    tiers: [4],
  },
  {
    name: "MaxMP +10",
    effect: "MaxMP increases by 10.",
    tiers: [1],
  },
  {
    name: "MaxMP +20",
    effect: "MaxMP increases by 20.",
    tiers: [2],
  },
  {
    name: "MaxMP +30",
    effect: "MaxMP increases by 30.",
    tiers: [3],
  },
  {
    name: "MaxMP +40",
    effect: "MaxMP increases by 40.",
    tiers: [4],
  },
  {
    name: "MaxMP +50",
    effect: "MaxMP increases by 50.",
    tiers: [5],
  },
  {
    name: "Mega Power Rebound Lv1",
    effect: "If your attack is a MISS, for 90 seconds, ATK increases by 100, Critical Rate increases by 50, and Accuracy decreases by 9999.",
    tiers: [1],
  },
  {
    name: "Mega Power Rebound Lv2",
    effect: "If your attack is a MISS, for 90 seconds, ATK increases by 200, Critical Rate increases by 75, and Accuracy decreases by 9999.",
    tiers: [2],
  },
  {
    name: "Mega Power Rebound Lv3",
    effect: "If your attack is a MISS, for 90 seconds, ATK increases by 300, Critical Rate increases by 100, and Accuracy decreases by 9999.",
    tiers: [3],
  },
  {
    name: "Mega Power Rebound Lv4",
    effect: "If your attack is a MISS, for 90 seconds, ATK increases by 400, Critical Rate increases by 125, and Accuracy decreases by 9999.",
    tiers: [4],
  },
  {
    name: "Mega Power Rebound Lv5",
    effect: "If your attack is a MISS, for 90 seconds, ATK increases by 500, Critical Rate increases by 150, and Accuracy decreases by 9999.",
    tiers: [5],
  },
  {
    name: "Natural HP Regen +15",
    effect: "Natural HP Regen increases by 15.",
    tiers: [1],
  },
  {
    name: "Natural HP Regen +30",
    effect: "Natural HP Regen increases by 30.",
    tiers: [2],
  },
  {
    name: "Natural HP Regen +45",
    effect: "Natural HP Regen increases by 45.",
    tiers: [3],
  },
  {
    name: "Natural HP Regen +60",
    effect: "Natural HP Regen increases by 60.",
    tiers: [4],
  },
  {
    name: "Natural HP Regen +75",
    effect: "Natural HP Regen increases by 75.",
    tiers: [5],
  },
  {
    name: "Natural MP Regen +10",
    effect: "Natural MP Regen increases by 10.",
    tiers: [2],
  },
  {
    name: "Natural MP Regen +15",
    effect: "Natural MP Regen increases by 15.",
    tiers: [3],
  },
  {
    name: "Natural MP Regen +20",
    effect: "Natural MP Regen increases by 20.",
    tiers: [4],
  },
  {
    name: "Natural MP Regen +25",
    effect: "Natural MP Regen increases by 25.",
    tiers: [5],
  },
  {
    name: "Natural MP Regen +5",
    effect: "Natural MP Regen increases by 5.",
    tiers: [1],
  },
  {
    name: "Nimble Lv1",
    effect: "Dealing damage to a target increases Dodge by 1 for 6 seconds. Max 30 stacks.",
    tiers: [1],
  },
  {
    name: "Nimble Lv2",
    effect: "Dealing damage to a target increases Dodge by 2 for 6 seconds. Max 30 stacks.",
    tiers: [2],
  },
  {
    name: "Nimble Lv3",
    effect: "Dealing damage to a target increases Dodge by 3 for 6 seconds. Max 30 stacks.",
    tiers: [3],
  },
  {
    name: "Nimble Lv4",
    effect: "Dealing damage to a target increases Dodge by 4 for 6 seconds. Max 30 stacks.",
    tiers: [4],
  },
  {
    name: "Nimble Lv5",
    effect: "Dealing damage to a target increases Dodge by 5 for 6 seconds. Max 30 stacks.",
    tiers: [5],
  },
  {
    name: "Pet EXP Gain +12%",
    effect: "EXP gained by pets increases by 12%.",
    tiers: [2],
  },
  {
    name: "Pet EXP Gain +18%",
    effect: "EXP gained by pets increases by 18%.",
    tiers: [3],
  },
  {
    name: "Pet EXP Gain +24%",
    effect: "EXP gained by pets increases by 24%.",
    tiers: [4],
  },
  {
    name: "Pet EXP Gain +30%",
    effect: "EXP gained by pets increases by 30%.",
    tiers: [5],
  },
  {
    name: "Pet EXP Gain +6%",
    effect: "EXP gained by pets increases by 6%.",
    tiers: [1],
  },
  {
    name: "Power Rebound Lv1",
    effect: "If your attack is a MISS, ATK increases by 10 for 30 seconds. Max 10 stacks.",
    tiers: [1],
  },
  {
    name: "Power Rebound Lv2",
    effect: "If your attack is a MISS, ATK increases by 20 for 30 seconds. Max 10 stacks.",
    tiers: [2],
  },
  {
    name: "Power Rebound Lv3",
    effect: "If your attack is a MISS, ATK increases by 30 for 30 seconds. Max 10 stacks.",
    tiers: [3],
  },
  {
    name: "Power Rebound Lv4",
    effect: "If your attack is a MISS, ATK increases by 40 for 30 seconds. Max 10 stacks.",
    tiers: [4],
  },
  {
    name: "Power Rebound Lv5",
    effect: "If your attack is a MISS, ATK increases by 50 for 30 seconds. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Precision Lv1",
    effect: "Dealing damage to a target increases Accuracy by 1 for 6 seconds. Max 30 stacks.",
    tiers: [1],
  },
  {
    name: "Precision Lv2",
    effect: "Dealing damage to a target increases Accuracy by 2 for 6 seconds. Max 30 stacks.",
    tiers: [2],
  },
  {
    name: "Precision Lv3",
    effect: "Dealing damage to a target increases Accuracy by 3 for 6 seconds. Max 30 stacks.",
    tiers: [3],
  },
  {
    name: "Precision Lv4",
    effect: "Dealing damage to a target increases Accuracy by 4 for 6 seconds. Max 30 stacks.",
    tiers: [4],
  },
  {
    name: "Precision Lv5",
    effect: "Dealing damage to a target increases Accuracy by 5 for 6 seconds. Max 30 stacks.",
    tiers: [5],
  },
  {
    name: "Radiant Chance Lv1",
    effect: "The success rate of Trait Transfer increases by 10%",
    tiers: [1],
  },
  {
    name: "Radiant Chance Lv2",
    effect: "The success rate of Trait Transfer increases by 20%",
    tiers: [2],
  },
  {
    name: "Radiant Chance Lv3",
    effect: "The success rate of Trait Transfer increases by 30%",
    tiers: [3],
  },
  {
    name: "Radiant Chance Lv4",
    effect: "The success rate of Trait Transfer increases by 40%",
    tiers: [4],
  },
  {
    name: "Radiant Chance Lv5",
    effect: "The success rate of Trait Transfer increases by 50%",
    tiers: [5],
  },
  {
    name: "Radiant Chance Lv6",
    effect: "The success rate of Trait Transfer increases by 60%",
    tiers: [5],
  },
  {
    name: "Radiant Chance Lv7",
    effect: "The success rate of Trait Transfer increases by 70%",
    tiers: [5],
  },
  {
    name: "Radiant Chance Lv8",
    effect: "The success rate of Trait Transfer increases by 80%",
    tiers: [5],
  },
  {
    name: "Radiant Chance Lv9",
    effect: "The success rate of Trait Transfer increases by 90%",
    tiers: [5],
  },
  {
    name: "STR +1",
    effect: "STR increases by 1.",
    tiers: [1],
  },
  {
    name: "STR +2",
    effect: "STR increases by 2.",
    tiers: [2],
  },
  {
    name: "STR +3",
    effect: "STR increases by 3.",
    tiers: [3],
  },
  {
    name: "STR +4",
    effect: "STR increases by 4.",
    tiers: [4],
  },
  {
    name: "STR +5",
    effect: "STR increases by 5.",
    tiers: [5],
  },
  {
    name: "Spirit Blow Lv1",
    effect: "Dealing damage to a target restores 2 MP. MP restored increases based on AGI. Activates once every 6 seconds.",
    tiers: [1],
  },
  {
    name: "Spirit Blow Lv2",
    effect: "Dealing damage to a target restores 4 MP. MP restored increases based on AGI. Activates once every 6 seconds.",
    tiers: [2],
  },
  {
    name: "Spirit Blow Lv3",
    effect: "Dealing damage to a target restores 6 MP. MP restored increases based on AGI. Activates once every 6 seconds.",
    tiers: [3],
  },
  {
    name: "Spirit Blow Lv4",
    effect: "Dealing damage to a target restores 8 MP. MP restored increases based on AGI. Activates once every 6 seconds.",
    tiers: [4],
  },
  {
    name: "Spirit Blow Lv5",
    effect: "Dealing damage to a target restores 10 MP. MP restored increases based on AGI. Activates once every 6 seconds.",
    tiers: [5],
  },
  {
    name: "Spirit Shot Lv1",
    effect: "Dealing damage to a target restores 2 MP. MP restored increases based on DEX. Activates once every 6 seconds.",
    tiers: [1],
  },
  {
    name: "Spirit Shot Lv2",
    effect: "Dealing damage to a target restores 4 MP. MP restored increases based on DEX. Activates once every 6 seconds.",
    tiers: [2],
  },
  {
    name: "Spirit Shot Lv3",
    effect: "Dealing damage to a target restores 6 MP. MP restored increases based on DEX. Activates once every 6 seconds.",
    tiers: [3],
  },
  {
    name: "Spirit Shot Lv4",
    effect: "Dealing damage to a target restores 8 MP. MP restored increases based on DEX. Activates once every 6 seconds.",
    tiers: [4],
  },
  {
    name: "Spirit Shot Lv5",
    effect: "Dealing damage to a target restores 10 MP. MP restored increases based on DEX. Activates once every 6 seconds.",
    tiers: [5],
  },
  {
    name: "Stun Unavailable",
    effect: "Can no longer inflict [Stun].",
    tiers: [2],
  },
  {
    name: "Tumble Unavailable",
    effect: "Can no longer inflict [Tumble]",
    tiers: [3],
  },
  {
    name: "VIT +1",
    effect: "VIT increases by 1.",
    tiers: [1],
  },
  {
    name: "VIT +2",
    effect: "VIT increases by 2.",
    tiers: [2],
  },
  {
    name: "VIT +3",
    effect: "VIT increases by 3.",
    tiers: [3],
  },
  {
    name: "VIT +4",
    effect: "VIT increases by 4.",
    tiers: [4],
  },
  {
    name: "VIT +5",
    effect: "VIT increases by 5.",
    tiers: [5],
  },
  {
    name: "Vengeful Life Lv1",
    effect: "When taking damage from a target, MaxHP increases by 50 for 180 seconds. Max 120 stacks.",
    tiers: [1],
  },
  {
    name: "Vengeful Life Lv2",
    effect: "When taking damage from a target, MaxHP increases by 100 for 180 seconds. Max 100 stacks.",
    tiers: [2],
  },
  {
    name: "Vengeful Life Lv3",
    effect: "When taking damage from a target, MaxHP increases by 200 for 180 seconds. Max 80 stacks.",
    tiers: [3],
  },
  {
    name: "Vengeful Life Lv4",
    effect: "When taking damage from a target, MaxHP increases by 400 for 180 seconds. Max 60 stacks.",
    tiers: [4],
  },
  {
    name: "Vengeful Life Lv5",
    effect: "When taking damage from a target, MaxHP increases by 800 for 180 seconds. Max 40 stacks.",
    tiers: [5],
  },
  {
    name: "Vengeful Magica Lv1",
    effect: "When taking damage from a target, MATK increases by 10 for 30 seconds. Max 90 stacks.",
    tiers: [1],
  },
  {
    name: "Vengeful Magica Lv2",
    effect: "When taking damage from a target, MATK increases by 15 for 30 seconds. Max 60 stacks.",
    tiers: [2],
  },
  {
    name: "Vengeful Magica Lv3",
    effect: "When taking damage from a target, MATK increases by 30 for 30 seconds. Max 30 stacks.",
    tiers: [3],
  },
  {
    name: "Vengeful Magica Lv4",
    effect: "When taking damage from a target, MATK increases by 60 for 30 seconds. Max 15 stacks.",
    tiers: [4],
  },
  {
    name: "Vengeful Magica Lv5",
    effect: "When taking damage from a target, MATK increases by 90 for 30 seconds. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Vengeful Mana Lv1",
    effect: "When taking damage from a target, Max MP increases by 5 for 180 seconds. Max 30 stacks.",
    tiers: [1],
  },
  {
    name: "Vengeful Mana Lv2",
    effect: "When taking damage from a target, Max MP increases by 10 for 180 seconds. Max 25 stacks.",
    tiers: [2],
  },
  {
    name: "Vengeful Mana Lv3",
    effect: "When taking damage from a target, Max MP increases by 20 for 180 seconds. Max 20 stacks.",
    tiers: [3],
  },
  {
    name: "Vengeful Mana Lv4",
    effect: "When taking damage from a target, Max MP increases by 40 for 180 seconds. Max 15 stacks.",
    tiers: [4],
  },
  {
    name: "Vengeful Mana Lv5",
    effect: "When taking damage from a target, Max MP increases by 80 for 180 seconds. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Vengeful Power Lv1",
    effect: "When taking damage from a target, ATK increases by 10 for 30 seconds. Max 90 stacks.",
    tiers: [1],
  },
  {
    name: "Vengeful Power Lv2",
    effect: "When taking damage from a target, ATK increases by 15 for 30 seconds. Max 60 stack.",
    tiers: [2],
  },
  {
    name: "Vengeful Power Lv3",
    effect: "When taking damage from a target, ATK increases by 30 for 30 seconds. Max 30 stacks.",
    tiers: [3],
  },
  {
    name: "Vengeful Power Lv4",
    effect: "When taking damage from a target, ATK increases by 60 for 30 seconds. Max 15 stacks.",
    tiers: [4],
  },
  {
    name: "Vengeful Power Lv5",
    effect: "When taking damage from a target, ATK increases by 90 for 30 seconds. Max 10 stacks.",
    tiers: [5],
  },
  {
    name: "Vengeful Samurai Lv1",
    effect: "When taking damage from a target, Unsheathe Power increases by 100 for 9 seconds. Max 1 stack.",
    tiers: [1],
  },
  {
    name: "Vengeful Samurai Lv2",
    effect: "When taking damage from a target, Unsheathe Power increases by 100 for 9 seconds. Max 2 stacks.",
    tiers: [2],
  },
  {
    name: "Vengeful Samurai Lv3",
    effect: "When taking damage from a target, Unsheathe Power increases by 100 for 9 seconds. Max 3 stack.",
    tiers: [3],
  },
  {
    name: "Vengeful Samurai Lv4",
    effect: "When taking damage from a target, Unsheathe Power increases by 100 for 9 seconds. Max 4 stack.",
    tiers: [4],
  },
  {
    name: "Vengeful Samurai Lv5",
    effect: "When taking damage from a target, Unsheathe Power increases by 100 for 9 seconds. Max 5 stack.",
    tiers: [5],
  },
];

module.exports = traits;
