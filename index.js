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
    .setFooter({ text: 'Regislet Guide  •  /regislet  /regislet_location  /regislet_list  •  Data Credits: Coryn.Club' })
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
    .setName('regislet_help')
    .setDescription('Show all available Regislet Bot commands and how to use them'),
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
  client.user.setActivity(`${regislets.length} regislets | /regislet_help`, { type: 3 /* Watching */ });
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

    if (focused.name === 'name') {
      const q = normalize(focused.value);
      const matches = (q
        ? regislets.filter(r => normalize(r.name).includes(q))
        : regislets.slice(0, 25)
      ).slice(0, 25).map(r => ({ name: r.name, value: r.name }));
      return interaction.respond(matches).catch(() => {});
    }

    if (focused.name === 'location') {
      const q = normalize(focused.value);
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

  // ── /regislet_help ────────────────────────────────────────────────────────────
  else if (interaction.commandName === 'regislet_help') {
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('📖  Regislet Bot — Help')
      .setDescription('A guide bot for searching Regislet item details and drop locations.')
      .addFields(
        {
          name: '`/regislet <name>`',
          value: 'Search for a regislet by name. Supports partial matching and autocomplete.\n*Example: `/regislet wind talent`*',
        },
        {
          name: '`/regislet_location <location>`',
          value: 'Find all regislets that drop from a specific monster or location.\n*Example: `/regislet_location El Scaro`*',
        },
        {
          name: '`/regislet_list`',
          value: 'Browse the complete list of all regislets, sorted alphabetically with pagination.',
        },
        {
          name: '💡 Tips',
          value: [
            '• Autocomplete appears as you type — press ↑ to select suggestions.',
            '• Use partial names (e.g. `wind` instead of `Wind Talent`).',
            '• Gray items have no recorded drop source yet.',
          ].join('\n'),
        }
      )
      .setFooter({ text: `${regislets.length} regislets in database` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
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
