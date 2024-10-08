const { ButtonBuilder,
    ActionRowBuilder,
  } = require('discord.js');

module.exports = {
data: {
  name: 'chanels',
  description: 'Création des chanels de courses',
},

async execute(discipline) {
    
    if(discipline == "slalom"){
        let channel = [infoChannel, departChannel, penaliteChannel, resultChannel, judgeChannel];
    }
    else if(discipline == "course_en_ligne"){
        let channels = [infoChannel, departChannel, resultChannel, judgeChannel];
    }
}}