require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');
const regislets = require('./data/regislets');
const traits = require('./data/traits');
const expDB = require('./data/database.json');
const itemsRaw = require('./data/items.json');
const itemsArray = Object.values(itemsRaw);
const mapsRaw = require('./data/maps.json');
const mapsArray = Object.values(mapsRaw);
const monstersRaw = require('./data/monsters.json');
const monstersArray = Object.values(monstersRaw);

// ─── Validate environment ──────────────────────────────────────────────────────
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN is missing from your .env file!');
  process.exit(1);
}
if (!GUILD_ID) {
  console.warn('⚠️  GUILD_ID not set — slash commands will register globally (may take up to 1 hour).');
}

// ─── Client ───────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ─── Search helpers ───────────────────────────────────────────────────────────
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function searchByName(query) {
  const q = normalize(query);
  if (!q) return [];
  const exact = regislets.filter(r => normalize(r.name) === q);
  if (exact.length) return exact;
  return regislets.filter(r => normalize(r.name).includes(q));
}

function searchByPlace(query) {
  const q = normalize(query);
  if (!q) return [];
  return regislets.filter(r =>
    r.obtainedFrom.some(src => normalize(src).includes(q))
  );
}

function getAllLocations() {
  const set = new Set();
  regislets.forEach(r => r.obtainedFrom.forEach(src => set.add(src)));
  return [...set].sort();
}

// ─── EXP helpers ──────────────────────────────────────────────────────────────
function formatNum(n) {
  if (n == null) return '?';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function calcKills(expNeeded, bossExp) {
  if (!bossExp || bossExp <= 0) return null;
  return Math.ceil(expNeeded / bossExp);
}

function buildExpEmbed(level, percent) {
  const entry = expDB[String(level)];
  if (!entry || !entry.expRequired) {
    return new EmbedBuilder()
      .setColor(COLORS.error)
      .setTitle('❌ Level Not Found')
      .setDescription(`No EXP data found for level **${level}**.`);
  }

  const totalExp = entry.expRequired;
  const expDone = Math.floor(totalExp * (percent / 100));
  const expLeft = totalExp - expDone;

  // Top 5 bosses by fullBreak EXP (exclude event/box entries)
  const eventKeywords = /box|casket|event|ticket|antique|treasure|jewel/i;
  const topBosses = (entry.bosses || [])
    .filter(b => b.exp?.fullBreak && !eventKeywords.test(b.name))
    .sort((a, b) => (b.exp.fullBreak || 0) - (a.exp.fullBreak || 0))
    .slice(0, 5);

  const diffColor = { Ultimate: '🔴', Nightmare: '🟠', Hard: '🟡', Normal: '🟢', Easy: '⚪' };

  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`📊  EXP Calculator — Level ${level}`)
    .addFields(
      {
        name: '📈 Progress',
        value: [
          `Current: **${percent}%**`,
          `EXP done: \`${formatNum(expDone)}\``,
          `EXP left: \`${formatNum(expLeft)}\``,
          `Total for Lv ${level}: \`${formatNum(totalExp)}\``,
        ].join('\n'),
        inline: false,
      }
    );

  if (topBosses.length > 0) {
    const bossLines = topBosses.map(b => {
      const icon = diffColor[b.difficulty] || '⚫';
      const kills = calcKills(expLeft, b.exp.fullBreak);
      const killStr = kills != null ? `**${kills.toLocaleString()} kills**` : '?';
      const loc = b.location && b.location !== 'Progression' ? ` — ${b.location}` : '';
      return [
        `${icon} **${b.name}** (${b.difficulty}) Lv ${b.bossLevel || '?'}${loc}`,
        `  Full break: \`${formatNum(b.exp.fullBreak)}\` EXP → ${killStr} to level up`,
        b.exp.zeroBreak ? `  0 break: \`${formatNum(b.exp.zeroBreak)}\` EXP → **${calcKills(expLeft, b.exp.zeroBreak)?.toLocaleString() || '?'} kills**` : null,
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    embed.addFields({ name: '👹 Top Bosses (sorted by EXP)', value: bossLines, inline: false });
  } else {
    embed.addFields({ name: '👹 Bosses', value: '_No boss data available for this level._', inline: false });
  }

  embed
    .setFooter({ text: 'Full break = max EXP  •  /toram_help for all commands  •  Data: Coryn.Club' })
    .setTimestamp();

  return embed;
}

function buildLevelUpPages(currentLevel, percent, targetLevel) {
  const eventKeywords = /box|casket|event|ticket|antique|treasure|jewel/i;
  const diffIcon = { Ultimate: '🔴', Nightmare: '🟠', Hard: '🟡', Normal: '🟢', Easy: '⚪' };
  const CHUNK = 9;

  // ── Total EXP needed ──────────────────────────────────────────────────────
  let totalExpNeeded = 0;

  // Partial first level
  const firstEntry = expDB[String(currentLevel)];
  if (firstEntry?.expRequired) {
    const done = Math.floor(firstEntry.expRequired * (percent / 100));
    totalExpNeeded += firstEntry.expRequired - done;
  }

  // Full levels in between
  for (let lv = currentLevel + 1; lv < targetLevel; lv++) {
    const e = expDB[String(lv)];
    if (e?.expRequired) totalExpNeeded += e.expRequired;
  }

  // ── Build chunks ──────────────────────────────────────────────────────────
  // Each chunk covers up to CHUNK levels, using the middle level for boss lookup
  const chunks = [];
  let chunkStart = currentLevel;

  while (chunkStart < targetLevel) {
    const chunkEnd = Math.min(chunkStart + CHUNK - 1, targetLevel - 1);
    const midLevel = Math.floor((chunkStart + chunkEnd) / 2);

    // EXP needed just for this chunk
    let chunkExp = 0;
    for (let lv = chunkStart; lv <= chunkEnd; lv++) {
      const e = expDB[String(lv)];
      if (!e?.expRequired) continue;
      if (lv === currentLevel) {
        const done = Math.floor(e.expRequired * (percent / 100));
        chunkExp += e.expRequired - done;
      } else {
        chunkExp += e.expRequired;
      }
    }

    // Top 3 bosses at midLevel
    const midEntry = expDB[String(midLevel)];
    const topBosses = (midEntry?.bosses || [])
      .filter(b => b.exp?.fullBreak && !eventKeywords.test(b.name))
      .sort((a, b) => (b.exp.fullBreak || 0) - (a.exp.fullBreak || 0))
      .slice(0, 3);

    chunks.push({ chunkStart, chunkEnd, chunkExp, topBosses });
    chunkStart = chunkEnd + 1;
  }

  // ── Build paginated embeds (1 chunk per page) ────────────────────────────
  const pages = chunks.map((chunk, i) => {
    const { chunkStart, chunkEnd, chunkExp, topBosses } = chunk;
    const label = chunkStart === chunkEnd
      ? `Level ${chunkStart}`
      : `Level ${chunkStart} → ${chunkEnd}`;

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(`🗺️  Level Up Plan — ${label}`)
      .setDescription(
        `**Path:** Lv ${currentLevel} (${percent}%) → Lv ${targetLevel}\n` +
        `**Total EXP needed:** \`${formatNum(totalExpNeeded)}\`\n` +
        `**Chunk EXP needed:** \`${formatNum(chunkExp)}\``
      );

    if (topBosses.length > 0) {
      const bossText = topBosses.map((b, idx) => {
        const icon = diffIcon[b.difficulty] || '⚫';
        const loc = b.location && b.location !== 'Progression' ? `\n  📍 ${b.location}` : '';
        return [
          `**${idx + 1}.** ${icon} **${b.name}** (${b.difficulty}) Lv ${b.bossLevel || '?'}${loc}`,
          `  Full break: \`${formatNum(b.exp.fullBreak)}\` EXP`,
          b.exp.zeroBreak ? `  0 break:    \`${formatNum(b.exp.zeroBreak)}\` EXP` : null,
        ].filter(Boolean).join('\n');
      }).join('\n\n');

      embed.addFields({ name: '👹 Top 3 Bosses for this range', value: bossText, inline: false });
    } else {
      embed.addFields({ name: '👹 Bosses', value: '_No boss data for this range._', inline: false });
    }

    embed.setFooter({
      text: `Chunk ${i + 1} of ${chunks.length}  •  Full break = max EXP  •  Data: Coryn.Club`,
    });

    return embed;
  });

  return pages;
}

// ─── Items search helpers ─────────────────────────────────────────────────────
const EQUIP_TYPES = ['1 Handed Sword','2 Handed Sword','Bow','Bowgun','Staff','Magic Device',
  'Knuckles','Halberd','Dagger','Katana','Arrow','Shield','Armor','Additional','Special'];

const CRYSTA_TYPE_NAMES = ['Normal','Weapon','Armor','Additional','Special',
  'Enhancer (Purple)','Enhancer (Yellow)','Enhancer (Green)','Enhancer (Blue)','Enhancer (Red)'];

function searchItems(query, category) {
  const q = normalize(query);
  if (!q) return [];
  const pool = category ? itemsArray.filter(i => i.category === category) : itemsArray;
  const exact = pool.filter(i => normalize(i.name) === q);
  if (exact.length) return exact;
  return pool.filter(i => normalize(i.name).includes(q));
}

function formatObtained(obtainedFrom) {
  if (!obtainedFrom || obtainedFrom.length === 0) return '_Not recorded_';
  return obtainedFrom.slice(0, 5).map(o => {
    const monster = (o.monster || '').replace(/\s+/g, ' ').trim();
    const map = (o.map || '').replace(/\s+/g, ' ').trim();
    if (monster && map) return `• ${monster} — ${map}`;
    if (monster) return `• ${monster}`;
    if (map) return `• ${map}`;
    return null;
  }).filter(Boolean).join('\n');
}

// ─── Crysta embed ─────────────────────────────────────────────────────────────
function buildCrystaEmbed(item) {
  const isEnhancer = item.isEnhancer || (item.crystaType || '').includes('Enhancer');
  const color = isEnhancer ? 0xfee75c : COLORS.primary;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`💎  ${item.name}`)
    .addFields(
      { name: '🏷️ Type', value: `\`${item.type || item.crystaType + ' Crysta'}\``, inline: true },
      { name: '💰 Sell', value: `\`${item.sell || '—'}\``, inline: true },
      { name: '⚗️ Process', value: `\`${item.process || '—'}\``, inline: true },
    );

  if (item.stats && item.stats.length > 0) {
    embed.addFields({
      name: '📊 Stats / Effect',
      value: item.stats.map(s => `• **${s.stat}**: ${s.amount}`).join('\n'),
      inline: false,
    });
  }

  const obtained = formatObtained(item.obtainedFrom);
  embed.addFields({ name: '📍 Obtained From', value: obtained, inline: false });

  if (item.usedFor && item.usedFor.length > 0) {
    embed.addFields({
      name: '🔮 Used For (Upgrades Into)',
      value: item.usedFor.map(u => `• ${u}`).join('\n'),
      inline: false,
    });
  }

  embed.setFooter({ text: 'Crysta  •  /crysta  /crysta_type  •  Data: Coryn.Club' }).setTimestamp();
  return embed;
}

// ─── Equipment embed ──────────────────────────────────────────────────────────
function buildEquipEmbed(item) {
  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle(`⚔️  ${item.name}`)
    .addFields(
      { name: '🏷️ Type', value: `\`${item.type}\``, inline: true },
      { name: '💰 Sell', value: `\`${item.sell || '—'}\``, inline: true },
      { name: '⚗️ Process', value: `\`${item.process || '—'}\``, inline: true },
    );

  if (item.stats && item.stats.length > 0) {
    embed.addFields({
      name: '📊 Stats',
      value: item.stats.map(s => `• **${s.stat}**: ${s.amount}`).join('\n'),
      inline: false,
    });
  }

  const obtained = formatObtained(item.obtainedFrom);
  embed.addFields({ name: '📍 Obtained From', value: obtained, inline: false });

  embed.setFooter({ text: 'Equipment  •  /equipment  /equipment_type  •  Data: Coryn.Club' }).setTimestamp();
  return embed;
}

// ─── Item embed (general) ─────────────────────────────────────────────────────
function buildItemEmbed(item) {
  if (item.category === 'Crysta') return buildCrystaEmbed(item);
  if (item.category === 'Equipment') return buildEquipEmbed(item);

  const embed = new EmbedBuilder()
    .setColor(COLORS.muted)
    .setTitle(`📦  ${item.name}`)
    .addFields(
      { name: '🏷️ Type', value: `\`${item.type || item.category}\``, inline: true },
      { name: '💰 Sell', value: `\`${item.sell || '—'}\``, inline: true },
      { name: '⚗️ Process', value: `\`${item.process || '—'}\``, inline: true },
    );

  const obtained = formatObtained(item.obtainedFrom);
  embed.addFields({ name: '📍 Obtained From', value: obtained, inline: false });

  embed.setFooter({ text: `${item.category}  •  /item  •  Data: Coryn.Club` }).setTimestamp();
  return embed;
}

// ─── Multi result embed (shared) ─────────────────────────────────────────────
function buildItemMultiEmbed(results, query, label) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🔍  ${label} Results for "${query}"`)
    .setDescription(`Found **${results.length}** item(s). Use the exact name for full details.`);

  results.slice(0, 10).forEach(item => {
    const source = item.obtainedFrom?.[0];
    const sourceStr = source
      ? (source.monster || source.map || '').replace(/\s+/g, ' ').trim().slice(0, 60)
      : 'No source recorded';
    embed.addFields({
      name: `${item.name} [${item.type || item.category}]`,
      value: [
        item.stats?.length ? item.stats.slice(0,2).map(s => `${s.stat}: ${s.amount}`).join(' • ') : '',
        `📍 ${sourceStr}`,
      ].filter(Boolean).join('\n'),
      inline: false,
    });
  });

  if (results.length > 10) embed.setFooter({ text: `Showing 10 of ${results.length} — use a more specific name` });
  return embed;
}

// ─── Map & Monster search helpers ────────────────────────────────────────────
function searchMaps(query) {
  const q = normalize(query);
  if (!q) return [];
  const exact = mapsArray.filter(m => normalize(m.name) === q);
  if (exact.length) return exact;
  return mapsArray.filter(m => normalize(m.name).includes(q));
}

function searchMonsters(query) {
  const q = normalize(query);
  if (!q) return [];
  const exact = monstersArray.filter(m => normalize(m.name) === q);
  if (exact.length) return exact;
  return monstersArray.filter(m => normalize(m.name).includes(q));
}

function searchMonstersByDrop(query) {
  const q = normalize(query);
  if (!q) return [];
  return monstersArray.filter(m =>
    m.drops.some(d => normalize(d.itemName).includes(q))
  );
}

// ─── Map embed ────────────────────────────────────────────────────────────────
const TYPE_ICONS = { Boss: '🔴', 'Mini-Boss': '🟠', 'Mini Boss': '🟠', Normal: '🟢', NPC: '🔵' };

function buildMapEmbed(map) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`🗺️  ${map.name}`)
    .addFields(
      { name: '📖 Chapter', value: map.chapter || '—', inline: true },
      { name: '📦 Chests', value: `${map.chests || 0}`, inline: true },
      { name: '🆔 Map ID', value: `${map.mapId || map.id}`, inline: true },
    );

  // Monsters — split by type, exclude NPCs
  const bosses = (map.monsters || []).filter(m => m.type === 'Boss' || m.type === 'Mini-Boss' || m.type === 'Mini Boss');
  const normals = (map.monsters || []).filter(m => m.type === 'Normal');
  const npcs = (map.monsters || []).filter(m => m.type === 'NPC');

  if (bosses.length > 0) {
    embed.addFields({
      name: `🔴 Bosses (${bosses.length})`,
      value: bosses.map(m => `• ${m.name}`).join('\n').slice(0, 1024),
      inline: false,
    });
  }

  if (normals.length > 0) {
    embed.addFields({
      name: `🟢 Monsters (${normals.length})`,
      value: normals.map(m => `• ${m.name}`).join('\n').slice(0, 1024),
      inline: false,
    });
  }

  if (npcs.length > 0) {
    embed.addFields({
      name: `🔵 NPCs (${npcs.length})`,
      value: npcs.map(m => `• ${m.name}`).join('\n').slice(0, 1024),
      inline: false,
    });
  }

  // Chest items only — obtainables with no source (chest) or source === null
  // Actually in data, chest items come from NPCs — show items from non-monster sources
  const chestItems = (map.obtainables || []).filter(o => {
    // Items from NPCs that are shops/exchange, not monster drops
    return o.source === null || (o.source && !bosses.find(b => b.name.includes(o.source?.split(' ')[0])));
  });

  if (map.chests > 0) {
    const uniqueChestItems = [...new Map(
      (map.obtainables || []).filter(o => !o.source || o.source === null)
        .map(o => [o.itemName, o])
    ).values()].slice(0, 15);

    if (uniqueChestItems.length > 0) {
      embed.addFields({
        name: '📦 Chest Items',
        value: uniqueChestItems.map(o => `• [${o.itemType}] ${o.itemName}`).join('\n').slice(0, 1024),
        inline: false,
      });
    }
  }

  embed.setFooter({ text: `Map  •  /map  /map_drops  •  Data: Coryn.Club` }).setTimestamp();
  return embed;
}

// ─── Monster embed ────────────────────────────────────────────────────────────
const MODE_COLORS = {
  Ultimate: 0xed4245, Nightmare: 0xe67e22, 'Very Hard': 0xf1c40f,
  Hard: 0xfee75c, Normal: 0x57f287, Easy: 0x99aab5,
};

function buildMonsterEmbed(monster) {
  const color = MODE_COLORS[monster.mode] || COLORS.primary;
  const eventStr = monster.eventTag ? `\n> ⭐ Event: **${monster.eventTag}**` : '';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`👹  ${monster.name}`)
    .setDescription(`${eventStr}`.trim() || null)
    .addFields(
      { name: '🎚️ Level', value: `\`${monster.level ?? '?'}\``, inline: true },
      { name: '🏷️ Type', value: `\`${monster.type || '?'}\``, inline: true },
      { name: '⚔️ Mode', value: `\`${monster.mode || 'Normal'}\``, inline: true },
      { name: '❤️ HP', value: `\`${monster.hp !== null ? monster.hp.toLocaleString() : '?'}\``, inline: true },
      { name: '⭐ EXP', value: `\`${monster.exp !== null ? monster.exp.toLocaleString() : '?'}\``, inline: true },
      { name: '🌊 Element', value: `\`${monster.element || '?'}\``, inline: true },
      { name: '🐾 Tamable', value: monster.tamable ? '✅ Yes' : '❌ No', inline: true },
      { name: '📍 Spawn At', value: monster.spawnAt || '—', inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
    );

  if (monster.drops && monster.drops.length > 0) {
    embed.addFields({
      name: `💧 Item Drops (${monster.drops.length})`,
      value: monster.drops.slice(0, 15).map(d => `• [${d.itemType}] ${d.itemName}`).join('\n').slice(0, 1024),
      inline: false,
    });
    if (monster.drops.length > 15) {
      embed.addFields({ name: '\u200b', value: `_...and ${monster.drops.length - 15} more drops_`, inline: false });
    }
  } else {
    embed.addFields({ name: '💧 Item Drops', value: '_No drops recorded_', inline: false });
  }

  embed.setFooter({ text: 'Monster  •  /monster  /monster_drop  •  Data: Coryn.Club' }).setTimestamp();
  return embed;
}

// Multi-result embeds for map and monster
function buildMapMultiEmbed(results, query) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`🔍  Map Results for "${query}"`)
    .setDescription(`Found **${results.length}** map(s). Use exact name for full details.`);
  results.slice(0, 10).forEach(m => {
    const monsterCount = (m.monsters || []).filter(x => x.type !== 'NPC').length;
    embed.addFields({
      name: `${m.name}`,
      value: `${m.chapter || '?'} • Map ID ${m.mapId || m.id} • ${monsterCount} monsters • ${m.chests || 0} chests`,
      inline: false,
    });
  });
  if (results.length > 10) embed.setFooter({ text: `Showing 10 of ${results.length}` });
  return embed;
}

function buildMonsterMultiEmbed(results, query) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle(`🔍  Monster Results for "${query}"`)
    .setDescription(`Found **${results.length}** monster(s). Use exact name for full details.`);
  results.slice(0, 10).forEach(m => {
    const modeStr = m.mode && m.mode !== 'Normal' ? ` [${m.mode}]` : '';
    embed.addFields({
      name: `${m.name}${modeStr} — Lv ${m.level ?? '?'} ${m.type || ''}`,
      value: [
        m.spawnAt ? `📍 ${m.spawnAt}` : null,
        m.drops.length > 0 ? `💧 ${m.drops.slice(0,3).map(d => d.itemName).join(', ')}${m.drops.length > 3 ? '...' : ''}` : 'No drops',
      ].filter(Boolean).join('\n'),
      inline: false,
    });
  });
  if (results.length > 10) embed.setFooter({ text: `Showing 10 of ${results.length}` });
  return embed;
}

// ─── Type list page embed ─────────────────────────────────────────────────────
function buildTypeListEmbed(items, typeName, pageIndex, totalPages, icon) {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`${icon}  ${typeName} — Page ${pageIndex + 1} / ${totalPages}`)
    .setDescription(items.map(i => `• **${i.name}**`).join('\n'))
    .setFooter({ text: `${typeName} items  •  Data: Coryn.Club` });
}

// ─── Trait search helpers ─────────────────────────────────────────────────────
function searchTraitByName(query) {
  const q = normalize(query);
  if (!q) return [];
  const exact = traits.filter(t => normalize(t.name) === q);
  if (exact.length) return exact;
  return traits.filter(t => normalize(t.name).includes(q));
}

function searchTraitByTier(tier) {
  return traits.filter(t => t.tiers.includes(tier));
}

// ─── Embed colours ────────────────────────────────────────────────────────────
const COLORS = {
  primary: 0x5865f2,    // Discord blurple
  success: 0x57f287,    // Green
  warning: 0xfee75c,    // Yellow
  error: 0xed4245,      // Red
  muted: 0x99aab5,      // Grey
};

const RARITY_COLOR = (r) => r.obtainedFrom[0] === 'No drop source recorded yet' ? COLORS.muted : COLORS.primary;

// ─── Embed builders ───────────────────────────────────────────────────────────
function buildRegisletEmbed(r) {
  const noSource = r.obtainedFrom[0] === 'No drop source recorded yet';

  const embed = new EmbedBuilder()
    .setColor(RARITY_COLOR(r))
    .setTitle(`📜  ${r.name}`)
    .setDescription(`> ${r.effect}`)
    .addFields(
      { name: '⚡ Max Level', value: `\`${r.maxLevel}\``, inline: true },
      { name: '🎯 Affects',   value: r.affects ? `\`${r.affects}\`` : '—', inline: true },
      { name: '\u200b',       value: '\u200b', inline: true }, // spacer
      {
        name: noSource ? '📍 Obtained From' : '📍 Drop Source(s)',
        value: noSource
          ? '_No drop source recorded yet_'
          : r.obtainedFrom.map(s => `• ${s}`).join('\n'),
        inline: false,
      }
    )
    .setFooter({ text: 'Regislet Guide  •  /regislet  /regislet_location  /regislet_list' })
    .setTimestamp();

  return embed;
}

function buildMultiResultEmbed(results, query) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🔍  Results for "${query}"`)
    .setDescription(`Found **${results.length}** regislet(s). Use \`/regislet <exact name>\` for full details.`);

  results.slice(0, 10).forEach(r => {
    const noSource = r.obtainedFrom[0] === 'No drop source recorded yet';
    embed.addFields({
      name: `${r.name}  ·  Max Lv ${r.maxLevel}`,
      value: [
        r.affects ? `_Affects: ${r.affects}_` : '',
        r.effect.length > 90 ? r.effect.slice(0, 90) + '…' : r.effect,
        noSource ? '📍 No drop source recorded' : `📍 ${r.obtainedFrom[0]}${r.obtainedFrom.length > 1 ? ` (+${r.obtainedFrom.length - 1} more)` : ''}`,
      ].filter(Boolean).join('\n'),
      inline: false,
    });
  });

  if (results.length > 10) embed.setFooter({ text: `Showing 10 of ${results.length} results. Refine your search for more specific results.` });

  return embed;
}

function buildNotFoundEmbed(query, type) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle('❌  No Results Found')
    .setDescription(`No regislets found for **${type}**: \`${query}\`\n\nTry a broader search term or check your spelling.`)
    .setFooter({ text: 'Tip: Use autocomplete (↑ arrow key) while typing for suggestions.' });
}

function buildLocationPageEmbed(results, query, pageIndex, totalPages) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`📍  Regislets from: ${query}`)
    .setDescription(`Found **${results.length}** regislet(s)  •  Page **${pageIndex + 1}** / **${totalPages}**`);

  return embed;
}

// ─── Trait embed builders ─────────────────────────────────────────────────────
const TIER_COLORS = { 1: 0x99aab5, 2: 0x57f287, 3: 0x5865f2, 4: 0xfee75c, 5: 0xed4245 };
const TIER_LABELS = { 1: '⬜ Tier 1', 2: '🟩 Tier 2', 3: '🟦 Tier 3', 4: '🟨 Tier 4', 5: '🟥 Tier 5' };

function buildTraitEmbed(t) {
  const highestTier = Math.max(...t.tiers);
  return new EmbedBuilder()
    .setColor(TIER_COLORS[highestTier] || COLORS.primary)
    .setTitle(`✨  ${t.name}`)
    .setDescription(`> ${t.effect || '_No description available._'}`)
    .addFields({ name: '🏷️ Available in', value: t.tiers.map(n => TIER_LABELS[n]).join('  '), inline: false })
    .setFooter({ text: 'Item Traits  •  /trait  /trait_list  /trait_tier  •  Data: Coryn.Club' })
    .setTimestamp();
}

function buildTraitMultiEmbed(results, query) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🔍  Trait Results for "${query}"`)
    .setDescription(`Found **${results.length}** trait(s). Use \`/trait <exact name>\` for full details.`);
  results.slice(0, 10).forEach(t => {
    embed.addFields({
      name: t.name,
      value: [
        t.effect ? (t.effect.length > 90 ? t.effect.slice(0, 90) + '…' : t.effect) : '_No description_',
        t.tiers.map(n => TIER_LABELS[n]).join(' '),
      ].join('\n'),
      inline: false,
    });
  });
  if (results.length > 10) embed.setFooter({ text: `Showing 10 of ${results.length} results.` });
  return embed;
}

function buildTraitTierPageEmbed(page, tier, pageIndex, totalPages, totalCount) {
  return new EmbedBuilder()
    .setColor(TIER_COLORS[tier] || COLORS.primary)
    .setTitle(`${TIER_LABELS[tier]}  Traits  —  Page ${pageIndex + 1} / ${totalPages}`)
    .setDescription(
      page.map(t => `✨ **${t.name}**\n${t.effect ? (t.effect.length > 80 ? t.effect.slice(0, 80) + '…' : t.effect) : '_No description_'}`).join('\n\n')
    )
    .setFooter({ text: `${totalCount} traits in Tier ${tier}  •  /trait <name> for full details` });
}

function buildTraitListPageEmbed(page, pageIndex, totalPages, totalCount) {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`📋  All Traits  —  Page ${pageIndex + 1} / ${totalPages}`)
    .setDescription(
      page.map(t => `✨ **${t.name}** *(T${t.tiers.join('/T')})*`).join('\n')
    )
    .setFooter({ text: `${totalCount} total traits  •  /trait <name> for full details` });
}

function buildListPageEmbed(page, pageIndex, totalPages, totalCount) {
  return new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(`📋  All Regislets  —  Page ${pageIndex + 1} / ${totalPages}`)
    .setDescription(
      page.map(r => {
        const icon = r.obtainedFrom[0] === 'No drop source recorded yet' ? '🔘' : '🟣';
        return `${icon} **${r.name}** *(Max Lv ${r.maxLevel})*`;
      }).join('\n')
    )
    .setFooter({ text: `${totalCount} total regislets  •  /regislet <name> for full details` });
}

// ─── Button builders ──────────────────────────────────────────────────────────
function buildNavButtons(prefix, pageIndex, totalPages) {
  if (totalPages <= 1) return [];
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${prefix}_prev_${pageIndex}`)
        .setLabel('◀  Prev')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageIndex === 0),
      new ButtonBuilder()
        .setCustomId(`${prefix}_page_${pageIndex}`)
        .setLabel(`${pageIndex + 1} / ${totalPages}`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(`${prefix}_next_${pageIndex}`)
        .setLabel('Next  ▶')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageIndex === totalPages - 1),
    ),
  ];
}

// ─── Slash command definitions ────────────────────────────────────────────────
const commands = [
  new SlashCommandBuilder()
    .setName('regislet')
    .setDescription('Search a Regislet by name')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Regislet name — partial match supported, autocomplete available')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('regislet_location')
    .setDescription('Find all Regislets obtainable from a specific location')
    .addStringOption(opt =>
      opt.setName('location')
        .setDescription('Monster / location name (e.g. Stoodie Lv 170, El Scaro)')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('regislet_list')
    .setDescription('Browse all Regislets alphabetically (paginated)'),

  new SlashCommandBuilder()
    .setName('toram_help')
    .setDescription('Show all available commands and how to use them'),

  new SlashCommandBuilder()
    .setName('exp')
    .setDescription('Calculate EXP needed to reach next level + boss kills required')
    .addIntegerOption(opt =>
      opt.setName('level')
        .setDescription('Your current level (1–399)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(399)
    )
    .addNumberOption(opt =>
      opt.setName('percent')
        .setDescription('Your current level % (0–99.99)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(99.99)
    ),

  new SlashCommandBuilder()
    .setName('levelup')
    .setDescription('Plan your path from current level+% to a target level, with bosses every 9 levels')
    .addIntegerOption(opt =>
      opt.setName('current_level')
        .setDescription('Your current level (1–399)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(399)
    )
    .addNumberOption(opt =>
      opt.setName('percent')
        .setDescription('Your current level % (0–99.99)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(99.99)
    )
    .addIntegerOption(opt =>
      opt.setName('target_level')
        .setDescription('Your target level (2–400)')
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(400)
    ),

  new SlashCommandBuilder()
    .setName('trait')
    .setDescription('Search an item trait by name')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Trait name — partial match supported, autocomplete available')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('trait_tier')
    .setDescription('Browse all traits available in a specific tier')
    .addIntegerOption(opt =>
      opt.setName('tier')
        .setDescription('Tier number (1–5)')
        .setRequired(true)
        .addChoices(
          { name: '⬜ Tier 1', value: 1 },
          { name: '🟩 Tier 2', value: 2 },
          { name: '🟦 Tier 3', value: 3 },
          { name: '🟨 Tier 4', value: 4 },
          { name: '🟥 Tier 5', value: 5 },
        )
    ),

  new SlashCommandBuilder()
    .setName('trait_list')
    .setDescription('Browse all item traits alphabetically (paginated)'),

  new SlashCommandBuilder()
    .setName('crysta')
    .setDescription('Search a crysta by name')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Crysta name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('crysta_type')
    .setDescription('Browse all crystas of a specific type')
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Crysta type')
        .setRequired(true)
        .addChoices(
          { name: '💎 Normal', value: 'Normal' },
          { name: '⚔️ Weapon', value: 'Weapon' },
          { name: '🛡️ Armor', value: 'Armor' },
          { name: '💍 Additional', value: 'Additional' },
          { name: '✨ Special', value: 'Special' },
          { name: '🟣 Enhancer (Purple)', value: 'Enhancer (Purple)' },
          { name: '🟡 Enhancer (Yellow)', value: 'Enhancer (Yellow)' },
          { name: '🟢 Enhancer (Green)', value: 'Enhancer (Green)' },
          { name: '🔵 Enhancer (Blue)', value: 'Enhancer (Blue)' },
          { name: '🔴 Enhancer (Red)', value: 'Enhancer (Red)' },
        )
    ),

  new SlashCommandBuilder()
    .setName('equipment')
    .setDescription('Search equipment by name')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Equipment name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('equipment_type')
    .setDescription('Browse all equipment of a specific type')
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Equipment type')
        .setRequired(true)
        .addChoices(
          { name: '⚔️ 1 Handed Sword', value: '1 Handed Sword' },
          { name: '🗡️ 2 Handed Sword', value: '2 Handed Sword' },
          { name: '🏹 Bow', value: 'Bow' },
          { name: '🔫 Bowgun', value: 'Bowgun' },
          { name: '🪄 Staff', value: 'Staff' },
          { name: '🔮 Magic Device', value: 'Magic Device' },
          { name: '👊 Knuckles', value: 'Knuckles' },
          { name: '🔱 Halberd', value: 'Halberd' },
          { name: '🗡️ Dagger', value: 'Dagger' },
          { name: '🌀 Katana', value: 'Katana' },
          { name: '➡️ Arrow', value: 'Arrow' },
          { name: '🛡️ Shield', value: 'Shield' },
          { name: '🥋 Armor', value: 'Armor' },
          { name: '💍 Additional', value: 'Additional' },
          { name: '✨ Special', value: 'Special' },
        )
    ),

  new SlashCommandBuilder()
    .setName('item')
    .setDescription('Search any item by name (all categories)')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Item name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('map')
    .setDescription('Search a map by name — shows monsters, NPCs and chest items')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Map name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('map_drops')
    .setDescription('Show all obtainable items from a map including monster drops')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Map name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('monster')
    .setDescription('Search a monster by name — shows stats and drops')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Monster name — partial match + autocomplete')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  new SlashCommandBuilder()
    .setName('monster_drop')
    .setDescription('Find which monsters drop a specific item')
    .addStringOption(opt =>
      opt.setName('item')
        .setDescription('Item name to search for in monster drops')
        .setRequired(true)
        .setAutocomplete(true)
    ),
].map(cmd => cmd.toJSON());

// ─── Bot ready ────────────────────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag} (${client.user.id})`);
  console.log(`📦 Loaded ${regislets.length} regislets`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    if (GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, GUILD_ID),
        { body: commands }
      );
      console.log('✅ Slash commands registered (guild-specific — instant).');
    } else {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('✅ Slash commands registered globally (may take up to 1 hour to appear).');
    }
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err.message);
  }

  // Set bot activity
  client.user.setActivity(`${mapsArray.length} maps | ${monstersArray.length} monsters | /toram_help`, { type: 3 });
});

// ─── Pagination cache ─────────────────────────────────────────────────────────
const paginationCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function storePages(msgId, data) {
  paginationCache.set(msgId, data);
  setTimeout(() => paginationCache.delete(msgId), CACHE_TTL_MS);
}

// ─── Interaction handler ──────────────────────────────────────────────────────
client.on('interactionCreate', async interaction => {

  // ── Autocomplete ─────────────────────────────────────────────────────────────
  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);

    const q = normalize(focused.value);

    if (focused.name === 'name' && interaction.commandName === 'crysta') {
      const pool = itemsArray.filter(i => i.category === 'Crysta');
      const matches = (q ? pool.filter(i => normalize(i.name).includes(q)) : pool.slice(0, 25))
        .slice(0, 25).map(i => ({ name: `${i.name} [${i.type}]`, value: i.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name' && interaction.commandName === 'equipment') {
      const pool = itemsArray.filter(i => i.category === 'Equipment');
      const matches = (q ? pool.filter(i => normalize(i.name).includes(q)) : pool.slice(0, 25))
        .slice(0, 25).map(i => ({ name: `${i.name} [${i.type}]`, value: i.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name' && interaction.commandName === 'item') {
      const matches = (q ? itemsArray.filter(i => normalize(i.name).includes(q)) : itemsArray.slice(0, 25))
        .slice(0, 25).map(i => ({ name: `${i.name} [${i.category}]`, value: i.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name' && (interaction.commandName === 'map' || interaction.commandName === 'map_drops')) {
      const matches = (q ? mapsArray.filter(m => normalize(m.name).includes(q)) : mapsArray.slice(0, 25))
        .slice(0, 25).map(m => ({ name: m.name, value: m.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name' && interaction.commandName === 'monster') {
      const matches = (q ? monstersArray.filter(m => normalize(m.name).includes(q)) : monstersArray.slice(0, 25))
        .slice(0, 25).map(m => ({ name: `${m.name} Lv${m.level || '?'} [${m.type || '?'}]`, value: m.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'item' && interaction.commandName === 'monster_drop') {
      // Autocomplete from all unique drop item names
      const allDrops = new Set();
      monstersArray.forEach(m => m.drops.forEach(d => allDrops.add(d.itemName)));
      const dropList = [...allDrops];
      const matches = (q ? dropList.filter(d => normalize(d).includes(q)) : dropList.slice(0, 25))
        .slice(0, 25).map(d => ({ name: d, value: d }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name' && interaction.commandName === 'trait') {
      const matches = (q
        ? traits.filter(t => normalize(t.name).includes(q))
        : traits.slice(0, 25)
      ).slice(0, 25).map(t => ({ name: t.name, value: t.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'name') {
      const matches = (q
        ? regislets.filter(r => normalize(r.name).includes(q))
        : regislets.slice(0, 25)
      ).slice(0, 25).map(r => ({ name: r.name, value: r.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'location') {
      const locations = getAllLocations()
        .filter(loc => normalize(loc).includes(q))
        .slice(0, 25)
        .map(loc => ({ name: loc, value: loc }));
      return interaction.respond(locations).catch(() => {});
    }

    return;
  }

  // ── Button presses ────────────────────────────────────────────────────────────
  if (interaction.isButton()) {
    const cached = paginationCache.get(interaction.message.id);
    if (!cached) {
      return interaction.reply({
        content: '⏰ This menu has expired. Please run the command again.',
        ephemeral: true,
      }).catch(() => {});
    }

    const parts = interaction.customId.split('_'); // e.g. loc_next_2 or list_prev_1
    const action = parts[parts.length - 2];          // prev / next / page
    const currentPage = parseInt(parts[parts.length - 1]);
    const { pages, buildPage, prefix } = cached;

    let newPage = currentPage;
    if (action === 'next') newPage = Math.min(currentPage + 1, pages.length - 1);
    if (action === 'prev') newPage = Math.max(currentPage - 1, 0);

    return interaction.update({
      embeds: [buildPage(newPage)],
      components: buildNavButtons(prefix, newPage, pages.length),
    }).catch(() => {});
  }

  // ── Slash commands ────────────────────────────────────────────────────────────
  if (!interaction.isChatInputCommand()) return;

  // ── /regislet ────────────────────────────────────────────────────────────────
  if (interaction.commandName === 'regislet') {
    const query = interaction.options.getString('name').trim();
    const results = searchByName(query);

    if (!results.length) {
      return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'name')], ephemeral: true });
    }
    if (results.length === 1) {
      return interaction.reply({ embeds: [buildRegisletEmbed(results[0])] });
    }
    return interaction.reply({ embeds: [buildMultiResultEmbed(results, query)] });
  }

  // ── /regislet_location ────────────────────────────────────────────────────────
  if (interaction.commandName === 'regislet_location') {
    const query = interaction.options.getString('location').trim();
    const results = searchByPlace(query);

    if (!results.length) {
      return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'location')], ephemeral: true });
    }

    const PAGE_SIZE = 5;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle(`📍  Regislets from: ${query}`)
        .setDescription(`Found **${results.length}** regislet(s)  •  Page **${pageIndex + 1}** / **${pages.length}**`);

      pages[pageIndex].forEach(r => {
        embed.addFields({
          name: `${r.name}  ·  Max Lv ${r.maxLevel}`,
          value: [
            r.affects ? `_Affects: ${r.affects}_` : null,
            r.effect.length > 110 ? r.effect.slice(0, 110) + '…' : r.effect,
          ].filter(Boolean).join('\n'),
          inline: false,
        });
      });

      embed.setFooter({ text: 'Use /regislet <name> for the full details of any regislet.' });
      return embed;
    };

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('loc', 0, pages.length),
      fetchReply: true,
    });

    storePages(msg.id, { pages, buildPage, prefix: 'loc' });
  }

  // ── /regislet_list ────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'regislet_list') {
    const sorted = [...regislets].sort((a, b) => a.name.localeCompare(b.name));
    const PAGE_SIZE = 15;
    const pages = [];
    for (let i = 0; i < sorted.length; i += PAGE_SIZE) pages.push(sorted.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => buildListPageEmbed(pages[pageIndex], pageIndex, pages.length, sorted.length);

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('list', 0, pages.length),
      fetchReply: true,
    });

    storePages(msg.id, { pages, buildPage, prefix: 'list' });
  }

  // ── /toram_help ───────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'toram_help') {
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('📖  Toram Helper — All Commands')
      .setDescription('Your guide bot for Toram Online — regislets, traits, and EXP calculations.')
      .addFields(
        { name: '📜 Regislet Commands', value: '\u200b' },
        {
          name: '`/regislet <name>`',
          value: 'Search a regislet by name. Partial match + autocomplete.\n*Example: `/regislet wind talent`*',
        },
        {
          name: '`/regislet_location <location>`',
          value: 'Find all regislets from a specific monster/location.\n*Example: `/regislet_location El Scaro`*',
        },
        {
          name: '`/regislet_list`',
          value: 'Browse all regislets alphabetically.',
        },
        { name: '✨ Trait Commands', value: '\u200b' },
        {
          name: '`/trait <name>`',
          value: 'Search an item trait by name.\n*Example: `/trait vengeful power`*',
        },
        {
          name: '`/trait_tier <tier>`',
          value: 'Browse traits by tier (1–5).\n*Example: `/trait_tier 5`*',
        },
        {
          name: '`/trait_list`',
          value: 'Browse all item traits alphabetically.',
        },
        { name: '📊 EXP Commands', value: '\u200b' },
        {
          name: '`/exp <level> <percent>`',
          value: 'Calculate EXP left to level up + boss kills needed.\n*Example: `/exp 100 65.5`*',
        },
        {
          name: '`/levelup <current_level> <percent> <target_level>`',
          value: 'Plan your full path to a target level. Shows top 3 bosses every 9 levels with EXP per break.\n*Example: `/levelup 100 10 200`*',
        },
        { name: '\u200b', value: '**💎 Crysta Commands**' },
        { name: '`/crysta <name>`', value: 'Search a crysta by name.\n*Example: `/crysta accuracy`*' },
        { name: '`/crysta_type <type>`', value: 'Browse all crystas of a type (Normal/Weapon/Armor/Additional/Special + Enhancers).' },
        { name: '\u200b', value: '**⚔️ Equipment Commands**' },
        { name: '`/equipment <name>`', value: 'Search equipment by name.\n*Example: `/equipment holy sword`*' },
        { name: '`/equipment_type <type>`', value: 'Browse all equipment of a type (Sword/Staff/Bow/Knuckles/Armor etc).' },
        { name: '\u200b', value: '**📦 General Items**' },
        { name: '`/item <name>`', value: 'Search any item by name across all categories.\n*Example: `/item blue gelatin`*' },
        { name: '\u200b', value: '**🗺️ Map Commands**' },
        { name: '`/map <name>`', value: 'Show map info — monsters, NPCs and chest items.\n*Example: `/map sofya city`*' },
        { name: '`/map_drops <name>`', value: 'Show all obtainable items from a map including monster drops.\n*Example: `/map_drops rakau plains`*' },
        { name: '\u200b', value: '**👹 Monster Commands**' },
        { name: '`/monster <name>`', value: 'Search a monster — shows stats, element, spawn location and drops.\n*Example: `/monster torpo`*' },
        { name: '`/monster_drop <item>`', value: 'Find which monsters drop a specific item.\n*Example: `/monster_drop pointed hat`*' },
        {
          name: '💡 Tips',
          value: [
            '• Autocomplete works while typing — press ↑ to pick suggestions.',
            '• Full break = maximum EXP from a boss kill.',
            '• Gray regislets have no recorded drop source yet.',
            '• Data sourced from Coryn.Club.',
          ].join('\n'),
        }
      )
      .setFooter({ text: `${regislets.length} regislets  •  ${traits.length} traits  •  ${itemsArray.length} items  •  ${mapsArray.length} maps  •  ${monstersArray.length} monsters` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // ── /exp ──────────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'exp') {
    const level = interaction.options.getInteger('level');
    const percent = interaction.options.getNumber('percent');
    return interaction.reply({ embeds: [buildExpEmbed(level, percent)] });
  }

  // ── /levelup ──────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'levelup') {
    const currentLevel = interaction.options.getInteger('current_level');
    const percent = interaction.options.getNumber('percent');
    const targetLevel = interaction.options.getInteger('target_level');

    if (targetLevel <= currentLevel) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.error)
          .setTitle('❌ Invalid Input')
          .setDescription('Target level must be **higher** than your current level.')],
        ephemeral: true,
      });
    }

    const pages = buildLevelUpPages(currentLevel, percent, targetLevel);

    if (pages.length === 1) {
      return interaction.reply({ embeds: [pages[0]] });
    }

    const msg = await interaction.reply({
      embeds: [pages[0]],
      components: buildNavButtons('lvup', 0, pages.length),
      fetchReply: true,
    });

    storePages(msg.id, {
      pages,
      buildPage: (i) => pages[i],
      prefix: 'lvup',
    });
  }
  // ── /trait ───────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'trait') {
    const query = interaction.options.getString('name').trim();
    const results = searchTraitByName(query);

    if (!results.length) {
      return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'trait')], ephemeral: true });
    }
    if (results.length === 1) {
      return interaction.reply({ embeds: [buildTraitEmbed(results[0])] });
    }
    return interaction.reply({ embeds: [buildTraitMultiEmbed(results, query)] });
  }

  // ── /trait_tier ──────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'trait_tier') {
    const tier = interaction.options.getInteger('tier');
    const results = searchTraitByTier(tier);

    const PAGE_SIZE = 8;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => buildTraitTierPageEmbed(pages[pageIndex], tier, pageIndex, pages.length, results.length);

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('tier', 0, pages.length),
      fetchReply: true,
    });

    storePages(msg.id, { pages, buildPage, prefix: 'tier' });
  }

  // ── /trait_list ──────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'trait_list') {
    const sorted = [...traits].sort((a, b) => a.name.localeCompare(b.name));
    const PAGE_SIZE = 15;
    const pages = [];
    for (let i = 0; i < sorted.length; i += PAGE_SIZE) pages.push(sorted.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => buildTraitListPageEmbed(pages[pageIndex], pageIndex, pages.length, sorted.length);

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('traitlist', 0, pages.length),
      fetchReply: true,
    });

    storePages(msg.id, { pages, buildPage, prefix: 'traitlist' });
  }

  // ── /crysta ───────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'crysta') {
    const query = interaction.options.getString('name').trim();
    const results = searchItems(query, 'Crysta');
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'crysta')], ephemeral: true });
    if (results.length === 1) return interaction.reply({ embeds: [buildCrystaEmbed(results[0])] });
    return interaction.reply({ embeds: [buildItemMultiEmbed(results, query, 'Crysta')] });
  }

  // ── /crysta_type ──────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'crysta_type') {
    const type = interaction.options.getString('type');
    const results = itemsArray
      .filter(i => i.category === 'Crysta' && i.crystaType === type)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(type, 'crysta type')], ephemeral: true });

    const PAGE_SIZE = 15;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => buildTypeListEmbed(pages[pageIndex], `${type} Crysta`, pageIndex, pages.length, '💎');

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('ctype', 0, pages.length),
      fetchReply: true,
    });
    storePages(msg.id, { pages, buildPage, prefix: 'ctype' });
  }

  // ── /equipment ────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'equipment') {
    const query = interaction.options.getString('name').trim();
    const results = searchItems(query, 'Equipment');
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'equipment')], ephemeral: true });
    if (results.length === 1) return interaction.reply({ embeds: [buildEquipEmbed(results[0])] });
    return interaction.reply({ embeds: [buildItemMultiEmbed(results, query, 'Equipment')] });
  }

  // ── /equipment_type ───────────────────────────────────────────────────────────
  else if (interaction.commandName === 'equipment_type') {
    const type = interaction.options.getString('type');
    const results = itemsArray
      .filter(i => i.category === 'Equipment' && i.type === type)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(type, 'equipment type')], ephemeral: true });

    const PAGE_SIZE = 15;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => buildTypeListEmbed(pages[pageIndex], type, pageIndex, pages.length, '⚔️');

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('etype', 0, pages.length),
      fetchReply: true,
    });
    storePages(msg.id, { pages, buildPage, prefix: 'etype' });
  }

  // ── /item ─────────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'item') {
    const query = interaction.options.getString('name').trim();
    const results = searchItems(query);
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'item')], ephemeral: true });
    if (results.length === 1) return interaction.reply({ embeds: [buildItemEmbed(results[0])] });
    return interaction.reply({ embeds: [buildItemMultiEmbed(results, query, 'Item')] });
  }

  // ── /map ──────────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'map') {
    const query = interaction.options.getString('name').trim();
    const results = searchMaps(query);
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'map')], ephemeral: true });
    if (results.length === 1) return interaction.reply({ embeds: [buildMapEmbed(results[0])] });
    return interaction.reply({ embeds: [buildMapMultiEmbed(results, query)] });
  }

  // ── /map_drops ────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'map_drops') {
    const query = interaction.options.getString('name').trim();
    const results = searchMaps(query);
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'map')], ephemeral: true });

    const map = results[0];
    const obtainables = map.obtainables || [];

    if (!obtainables.length) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.muted)
          .setTitle(`📦  ${map.name} — No Drop Data`)
          .setDescription('No obtainable items recorded for this map.')],
      });
    }

    const PAGE_SIZE = 15;
    // Group by source
    const grouped = {};
    obtainables.forEach(o => {
      const src = o.source || 'Unknown';
      if (!grouped[src]) grouped[src] = [];
      grouped[src].push(o);
    });

    const pages = [];
    const sources = Object.entries(grouped);
    for (let i = 0; i < sources.length; i += 3) pages.push(sources.slice(i, i + 3));

    const buildPage = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle(`📦  ${map.name} — All Drops`)
        .setDescription(`Page **${pageIndex + 1}** / **${pages.length}**  •  ${obtainables.length} total items`);

      pages[pageIndex].forEach(([source, items]) => {
        embed.addFields({
          name: `📍 ${source}`,
          value: items.slice(0, 10).map(i => `• [${i.itemType}] ${i.itemName}`).join('\n').slice(0, 1024),
          inline: false,
        });
      });

      embed.setFooter({ text: 'Map Drops  •  /map_drops  •  Data: Coryn.Club' });
      return embed;
    };

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('mapdrops', 0, pages.length),
      fetchReply: true,
    });
    storePages(msg.id, { pages, buildPage, prefix: 'mapdrops' });
  }

  // ── /monster ──────────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'monster') {
    const query = interaction.options.getString('name').trim();
    const results = searchMonsters(query);
    if (!results.length) return interaction.reply({ embeds: [buildNotFoundEmbed(query, 'monster')], ephemeral: true });
    if (results.length === 1) return interaction.reply({ embeds: [buildMonsterEmbed(results[0])] });

    // Multiple results — show list with pagination
    const PAGE_SIZE = 8;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setColor(COLORS.error)
        .setTitle(`🔍  Monsters matching "${query}"`)
        .setDescription(`Found **${results.length}** monsters  •  Page **${pageIndex + 1}** / **${pages.length}**\nUse exact name for full details.`);

      pages[pageIndex].forEach(m => {
        const modeStr = m.mode && m.mode !== 'Normal' ? ` [${m.mode}]` : '';
        const eventStr = m.eventTag ? ` ⭐` : '';
        embed.addFields({
          name: `${m.name}${modeStr}${eventStr} — Lv ${m.level ?? '?'} ${m.type || ''}`,
          value: [
            m.spawnAt ? `📍 ${m.spawnAt}` : null,
            m.drops.length > 0 ? `💧 ${m.drops.slice(0,3).map(d => d.itemName).join(', ')}${m.drops.length > 3 ? `... (+${m.drops.length - 3})` : ''}` : '💧 No drops',
          ].filter(Boolean).join('\n'),
          inline: false,
        });
      });

      embed.setFooter({ text: `${results.length} results  •  /monster <exact name> for full details` });
      return embed;
    };

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('mon', 0, pages.length),
      fetchReply: true,
    });
    storePages(msg.id, { pages, buildPage, prefix: 'mon' });
  }

  // ── /monster_drop ─────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'monster_drop') {
    const query = interaction.options.getString('item').trim();
    const results = searchMonstersByDrop(query);

    if (!results.length) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.error)
          .setTitle('❌ No Results')
          .setDescription(`No monsters found that drop **${query}**.\nTry a partial name like \`pointed hat\`.`)],
        ephemeral: true,
      });
    }

    const PAGE_SIZE = 8;
    const pages = [];
    for (let i = 0; i < results.length; i += PAGE_SIZE) pages.push(results.slice(i, i + PAGE_SIZE));

    const buildPage = (pageIndex) => {
      const embed = new EmbedBuilder()
        .setColor(COLORS.warning)
        .setTitle(`💧  Monsters that drop "${query}"`)
        .setDescription(`Found **${results.length}** monster(s)  •  Page **${pageIndex + 1}** / **${pages.length}**`);

      pages[pageIndex].forEach(m => {
        const modeStr = m.mode && m.mode !== 'Normal' ? ` [${m.mode}]` : '';
        const matchingDrops = m.drops.filter(d => normalize(d.itemName).includes(normalize(query)));
        embed.addFields({
          name: `${m.name}${modeStr} — Lv ${m.level ?? '?'} (${m.type || '?'})`,
          value: [
            m.spawnAt ? `📍 ${m.spawnAt}` : null,
            `💧 ${matchingDrops.map(d => `[${d.itemType}] ${d.itemName}`).join(', ')}`,
          ].filter(Boolean).join('\n'),
          inline: false,
        });
      });

      embed.setFooter({ text: 'Monster Drop  •  /monster_drop  •  Data: Coryn.Club' });
      return embed;
    };

    const msg = await interaction.reply({
      embeds: [buildPage(0)],
      components: buildNavButtons('mdrop', 0, pages.length),
      fetchReply: true,
    });
    storePages(msg.id, { pages, buildPage, prefix: 'mdrop' });
  }

});

// ─── Error handling ───────────────────────────────────────────────────────────
client.on('error', err => console.error('Discord client error:', err));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// ─── Login ────────────────────────────────────────────────────────────────────
client.login(TOKEN).catch(err => {
  console.error('❌ Failed to log in:', err.message);
  console.error('   Make sure DISCORD_TOKEN in your .env is correct and the bot token is valid.');
  process.exit(1);
});
