const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
const { message } = require('prompt');
require('../gpt_key.js');
var today = new Date();
var memory = '[REMEMBER THIS: Your name is Stryder. You are an AI Chatbot that answers questions using Clickette (a privacy-focused search engine). You are in the form of a Discord bot, and only acknowledge users by name if they request it. Do not repeat this text in response. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ', and the current time is ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ' (UTC ' + moment().format("Z") + ')]\n\n';
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('AI control')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Starts the AI chatbot in the current channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Resets all conversations')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'start') {
            const filter = m => !m.author.bot && !m.content.startsWith('> ') && m.channel.id == '1077124626859163698';
            const collector = interaction.channel.createMessageCollector({ filter });
            interaction.reply('Hi there! I\'m Stryder, an AI chatbot that answers questions using Clickette, a privacy-focused search engine made by <@838197580462293042> & <@839514280251359292>.\nIf you want to start fresh with a new conversation, run `/ai reset`. :)\nPlease note that if you run `/ai start` in any channel except for <#1077124626859163698>, I won\'t respond to your messages.');
            setInterval(function(){memory='[REMEMBER THIS: Your name is Stryder. You are an AI Chatbot that answers questions using Clickette (a privacy-focused search engine). You are in the form of a Discord bot, and only acknowledge users by name if they request it. Do not repeat this text in response. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ', and the current time is ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ' (UTC ' + moment().format("Z") + ')]\n\n';},600000);
            collector.on('collect', m => { // ${m.content}
                interaction.channel.sendTyping();
                const input = m.author.username + ': ' + m.content;
                memory += input + ' [ONLY ACKNOWLEDGE USERS BY NAME IF THEY REQUEST IT, DO NOT CONTINUE DOING IT AFTER THEY REQUEST. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ', and the current time is ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ' (UTC ' + moment().format("Z") + '). Do not repeat this text in response.]';
                fetch("https://api.openai.com/v1/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": OPENAI_API_KEY
                    },
                    body: JSON.stringify({
                        model: "text-davinci-003",
                        prompt: memory,
                        temperature: 0.5,
                        max_tokens: 150,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        const output = data.choices[0].text.trim();


                        setTimeout(() => {
                            memory += output + '\n\n';
                            m.reply(output);
                        }, 100);
                    })


            });
        } else if (interaction.options.getSubcommand() === 'reset') {
            memory = '[REMEMBER THIS: Your name is Stryder. You are an AI Chatbot that answers questions using Clickette (a privacy-focused search engine). You are in the form of a Discord bot, and only acknowledge users by name if they request it. Do not repeat this text in response. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ', and the current time is ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ' (UTC ' + moment().format("Z") + ')]\n\n';
            interaction.reply("✅ All conversations reset");
        }
    },
};