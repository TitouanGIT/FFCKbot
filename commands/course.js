const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Infocourse = require('../fonctions/Infocourse.js');

module.exports = {
  data: new SlashCommandBuilder().setName('créer-course').setDescription('Crée une course'),

  async execute(interaction, courses) {
    const buttoncourse = new ButtonBuilder()
      .setCustomId('buttoncourse')
      .setLabel('🛶créer une course🛶')
      .setStyle('Primary');

    const buttonRow = new ActionRowBuilder().addComponents(buttoncourse);

    await interaction.reply({
      content: `⬇️ Cliquez pour commencer à créer une course ⬇️`,
      components: [buttonRow],
    });

    const courseCollector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id });

    courseCollector.on('collect', async i => {
      if (i.customId === 'buttoncourse') {
        // Lancer le processus de création de la course
        await Infocourse.execute(interaction, courses);

        // Arrêter le collecteur une fois que le processus est lancé
        courseCollector.stop();
      }
    });

    // Arrêter le collecteur lorsque la durée de validité est écoulée (facultatif)
    courseCollector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Le temps pour créer une course est écoulé.', ephemeral: true });
      }
    });
  }
};