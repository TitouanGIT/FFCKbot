const { TextInputBuilder,
        ActionRowBuilder,
        ModalBuilder,
        StringSelectMenuBuilder, 
} = require('discord.js');

const createCourse = require('./createCourse');
const courses = {};

module.exports = {
  data: {
      name: 'infocourse',
      description: 'Information pour la création de la course',
  },
  async execute(interaction) {
    let courseName = "";
    let date = "";
    let respName = "";

    const selectDiscipline = new StringSelectMenuBuilder()
          .setCustomId('selectDiscipline')
          .setPlaceholder('🚣‍♂️Sélectionner une discipline🚣‍♂️')
          .addOptions([
            { label: '🖇Slalom🖇', value: 'slalom' },
            { label: '👊Kayak cross👊', value: 'xtrem' },
            { label: '➖Course en ligne➖', value: 'course_en_ligne' },
            { label: '🏐Kayak Polo🏐', value: 'kayak_polo' },
            { label: '↘️Descente↘️', value: 'descente' },
            { label: '🐉Dragon boat🐉', value: 'dragon_boat' },
            { label: '🌀Freestyle🌀', value: 'freestyle' },
            { label: '♿️Paracanoë♿️', value: 'paracanoë' },
            { label: '🌊Océan racing🌊', value: 'ocean_racing' },
            { label: '📏Marathon📏', value: 'marathon' },
            { label: '🛶Raft🛶', value: 'raft' },
            { label: '🏄Waveski surfing🏄', value: 'waveski_surfing' },
            { label: '𓀌Stand up paddle𓀌', value: 'stand_up_paddle' },
            { label: '🏊Natation en eau vive🏊', value: 'swimming' },
          ]);

    const modalCourse = new ModalBuilder()
      .setCustomId('courseModal')
      .setTitle('Information pour la création de la course')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('🏁Nom de la course (Lieu, Type)🏁')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('dateInput')
            .setLabel('📅Date de la course ( xx/xx/xxxx )📅')
            .setStyle('Short')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('nameRespInput')
            .setLabel('Nom du responsable de la course')
            .setStyle('Short')
        ),
      );

      const selectRow = new ActionRowBuilder().addComponents(selectDiscipline);
      const courseFilter = i => i.user.id === interaction.user.id;
      const courseCollector = interaction.channel.createMessageComponentCollector({ filter: courseFilter});
      const selectDisciplineFilter = i => i.user.id === interaction.user.id && i.customId === 'selectDiscipline';
      const selectDisciplineCollector = interaction.channel.createMessageComponentCollector({ filter: selectDisciplineFilter });

      courseCollector.on('collect', async i => {
        if (!i.isButton()) return;
      
        if (i.customId === 'buttoncourse') {
          await i.showModal(modalCourse);
          const modalSubmit = await i.awaitModalSubmit({ filter: courseFilter, time: 2147483646 });
          if (modalSubmit.customId === 'courseModal') {
            courseName = modalSubmit.fields.getTextInputValue('nameInput');
            date = modalSubmit.fields.getTextInputValue('dateInput');
            respName = modalSubmit.fields.getTextInputValue('nameRespInput');
            const interactname = i.user;
            console.log(`Création de la course ${courseName} par ${interactname.username}#${interactname.discriminator}`);
          }
          await modalSubmit.reply({ content: '⬇️Sélectionner une discipline⬇️', components: [selectRow], ephemeral: true });
          const selectDisciplineCollector = interaction.channel.createMessageComponentCollector({ filter: selectDisciplineFilter });
          selectDisciplineCollector.on('collect', async (i) => {
  
            if (!i.isStringSelectMenu()) return;
            const discipline = i.values[0];
    
            await modalSubmit.editReply({
              content: `Création de la course ${courseName}...`,
              ephemeral: true,
              components: []
            });
            
            courses[courseName] = { interaction, discipline, courseName, date, respName };
            await createCourse.execute(courses, interaction, discipline, courseName, date, respName);
            await modalSubmit.editReply({
              content: `La course ${courseName} du ${date}, organisé par ${respName} a étais créé avec succée!`,
              ephemeral: true
            });
            console.log(modalCourse); 
            selectDisciplineCollector.stop();
        });
        selectDisciplineCollector.on("end", async () => {
          console.log("fin de la création de la course");
        });
        }
      });
}
}