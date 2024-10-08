const { ButtonBuilder,
        ActionRowBuilder,
      } = require('discord.js');

module.exports = {
  data: {
      name: 'createCourse',
      description: 'Création de la course',
  },

  async execute(courses, interaction, discipline, courseName, date, respName) {

    const roleNames = {
      organizer: `Organisateur ${courseName}`,
      parcours: `Parcours ${courseName}`,
      judges: `Juges ${courseName}`,
      runners: `Coureurs & Invités ${courseName}`,
    };
    
    const courseType = discipline;
    
    const category = await interaction.guild.channels.create({ name: `course ${courseName}`, type: 4 });
    
    const organizerRole = await interaction.guild.roles.create({ name: roleNames.organizer, color: 'bc5a53'});
    await interaction.member.roles.add(organizerRole);
    
    const judgesRole = await interaction.guild.roles.create({ name: roleNames.judges, color: 'c6009f' });
    const runnersRole = await interaction.guild.roles.create({ name: roleNames.runners, color: '0005c6' });
    
    const infoChannel = await interaction.guild.channels.create({ name: 'Information-Course', type: 0, parent: category });
    const departChannel = await interaction.guild.channels.create({name: 'liste-de-départ', type: 0, parent: category });
    const penaliteChannel = await interaction.guild.channels.create({name:'fiches-pénalité', type: 0, parent: category });
    const resultChannel = await interaction.guild.channels.create({name:'résultats',  type: 0, parent: category });
    const judgeChannel = await interaction.guild.channels.create({name:'discussion-juges',  type: 0, parent: category });
    const openCloseChannel = await interaction.guild.channels.create({name:'gestion de la course',  type: 0, parent: category });
    
    const channels = [infoChannel, departChannel, penaliteChannel, resultChannel, judgeChannel];
    
    for (const channel of channels) {
    await channel.permissionOverwrites.set([
      //0x0000000000000400 = VIEW_CHANNEL	; 0x0000000000000800 = SEND_MESSAGES ; 0x0000000000002000 = MANAGE_MESSAGES ; 0x0000000010000000 = MANAGE_ROLES 
      {
        id: organizerRole.id,
        allow: ['0x0000000000000400', '0x0000000000000800', '0x0000000000002000', '0x0000000010000000'],
      },
      {
        id: judgesRole.id,
        allow: ['0x0000000000000400'],
      },
      {
        id: runnersRole.id,
        allow: ['0x0000000000000400'],
      },
      {
        id: interaction.guild.id,
        deny: ['0x0000000000000400'],
      },
    ]);
    }
    
    // Appliquer les permissions spécifiques pour le channel "discussion-juges"
    await judgeChannel.permissionOverwrites.set([
    {
      id: judgesRole.id,
      allow: ['0x0000000000000400', '0x0000000000000800'],
    },
    {
      id: interaction.guild.id,
      deny: ['0x0000000000000400'],
    },
    ]);
    
    // Appliquer les permissions spécifiques pour le channel "ouvrir-et-terminer-la-course"
    await openCloseChannel.permissionOverwrites.set([
    {
      id: organizerRole.id,
      allow: ['0x0000000000000400', '0x0000000000000800'],
    },
    {
      id: interaction.guild.id,
      deny: ['0x0000000000000400'],
    },
    ]);
    
    // Envoyer des messages d'introduction dans les channels
    await infoChannel.send(`**Informations sur la course ${courseName}**\nDiscipline : ${discipline}\nDate : ${date}\nResponsable : ${respName}`);
    await departChannel.send(`**Liste de départ pour la course ${courseName}**`);
    await penaliteChannel.send(`**Fiches de pénalité pour la course ${courseName}**`);
    await resultChannel.send(`**Résultats pour la course ${courseName}**`);
    await judgeChannel.send(`**Discussion entre les juges pour la course ${courseName}**`);
    await openCloseChannel.send(`**Ouvrir et terminer la course ${courseName}**`);
    
    //Création des boutons de gestion de course 
    const openButton = new ButtonBuilder()
          .setCustomId('open_course')
          .setLabel('🔓Ouvrir la course🔓')
          .setStyle('Success');
    const closeButton = new ButtonBuilder()
          .setCustomId('close_course')
          .setLabel('🔒Fermer la course🔒')
          .setStyle('Secondary');
    const delButton = new ButtonBuilder()
          .setCustomId('del_course')
          .setLabel('🗑️Supprimer la course🗑️')
          .setStyle('Danger');
    const openDelRow = new ActionRowBuilder().addComponents(openButton, delButton);
    const closeDelRow = new ActionRowBuilder().addComponents(closeButton, delButton);
    
    let openCloseMessage = await openCloseChannel.send({
    content: "⬇️Utilisez les boutons ci-dessous pour ouvrir ou supprimer la course:⬇️",
    components: [openDelRow],
    });
    const openCloseFilter = (i) =>
    i.user.id === interaction.user.id && ["open_course", "close_course", "del_course"].includes(i.customId);
  
    const openCloseCollector = openCloseChannel.createMessageComponentCollector({
    filter: openCloseFilter,
    });
    // Ouverture de la course 
    openCloseCollector.on("collect", async (collectedI) => {
      let i = collectedI;
    if (i.customId === "open_course") {
      await openCloseMessage.edit({
        components: [closeDelRow],
      });
      await i.reply({
        content: `🔓La course ${courseName} est maintenant ouverte.🔓`,
        ephemeral: true,
      });

          // Gérer les actions lorsque la course est ouverte
          const channelIdMap = {
            "slalom": "1074322574919618611",
            "course_en_ligne": "1074322656960204800",
            "kayak_polo": "1074322787310772224",
            "descente": "1074322830314983424",
            "dragon_boat": "1074322962351673384",
            "freestyle": "1074323060146044978",
            "paracanoë": "1074323137543549019",
            "ocean_racing": "1074323232661966981",
            "marathon": "1074323270230364180",
            "raft": "1074323316560633856",
            "waveski_surfing": "1074323404896866456",
            "stand_up_paddle": "1074323471435321434",
            "swimming": "1111389036385415188",
          };
      
          const targetChannelId = channelIdMap[courseType.toLowerCase()];
          const targetChannel = await interaction.guild.channels.fetch(targetChannelId);
          
          const buttonjoin = new ButtonBuilder()
          .setCustomId("join_runners_role")
          .setLabel(`🛶Rejoindre la course ${courseName}🛶`)
          .setStyle("Primary");
          
          const joinRoleRow = new ActionRowBuilder().addComponents(buttonjoin);
    
          const joinRunnersFilter = (i) => i.customId === 'join_runners_role' && !i.user.bot;
          const joinRunnersCollector = targetChannel.createMessageComponentCollector({ filter: joinRunnersFilter, time: 2147483647});
      
          entryMessage = await targetChannel.send({
            content: `**⬇️Rejoignez la course ${courseName} en cliquant sur le bouton ci-dessous.⬇️**`,
            components: [joinRoleRow],
          });
          console.log (entryMessage);
          joinRunnersCollector.on('collect', async (i) => {
            const runnerRole = interaction.guild.roles.cache.find(role => role.name === `Coureurs & Invités ${courseName}`);
            
            if (!runnerRole) {
              await i.reply({
                content: `❌Le rôle "Coureurs & Invités ${courseName}" est introuvable. Assurez-vous qu'il existe sur le serveur.❌`,
                ephemeral: true,
              });
              console.error(`❌Le rôle "Coureurs & Invités ${courseName}" est introuvable. Assurez-vous qu'il existe sur le serveur.❌`);
              return;
            }
            
            if (i.member.roles.cache.has(runnerRole.id)) {
              await i.reply({
                content: `❌Vous avez déjà le rôle 'Coureurs & Invités' de la course ${courseName}.❌`,
                ephemeral: true,
              });
            } else {
              await i.member.roles.add(runnerRole);
              await i.reply({
                content: `✔️Vous avez obtenu le rôle "Coureurs & Invités" de la course ${courseName}.✔️`,
                ephemeral: true,
              });
            }
            });
            joinRunnersCollector.on('end', (collected) => {
              console.log(`🛑Le collecteur de boutons 'rejoindre la course' a été arrêté après ${collected.size} interactions.🛑`);
              });
        }
        
        if (i.customId === 'close_course'){
          // Supprime le message pour join la course
          await entryMessage.delete();
          await openCloseMessage.edit({
            components: [openDelRow],
          });
          await i.reply({
            content: `🔒Vous avez bien fermé la course.🔒`,
            ephemeral: true,
          });
        }
    
        if (i.customId === 'del_course') {
          // Supprimer tous les rôles de la course
          await organizerRole.delete();
          await judgesRole.delete();
          await runnersRole.delete();
        
          // Supprimer les salons (infoChannel, departChannel, penaliteChannel, resultChannel, judgeChannel, openCloseChannel)
          channels.forEach(async (channel) => {
            if (channel) {
              await channel.delete(`Suppression du salon ${channel.name} pour la course ${courseName}`);
            }
          });
          await openCloseChannel.delete(`Suppression du salon ${openCloseChannel} pour la course ${courseName}`);
          // Supprimer la catégorie de la course
          if (category) {
            await category.delete(`Suppression de la catégorie ${category.name} pour la course ${courseName}`);
          }
        
          // Supprimer le message d'entrée de la course
            try{
              await entryMessage.delete();
            }
            catch{
              console.log("Aucun message pour rejoindre la course n'a étais trouvé.");
            }
        };
    });
      openCloseCollector.on("end", async () => {
        delete courses[courseName];
    });
    }
  }