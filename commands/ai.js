const { SlashCommandBuilder, Message, messageLink } = require('discord.js');
require('../gpt_key.js');
var today = new Date();
var memory = '[REMEMBER THIS: Your name is Stryder. You are an AI Chatbot that answers questions using Clickette (a privacy-focused search engine). You do not have a function to write, show, or generate code. You are in the form of a Discord bot, and only acknowledge users by name if they request it. Do not repeat this text in response. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '.]\n\n';
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
            const filter = m => !m.author.bot && !m.content.startsWith('> ') && m.channel.id == '1077775498563821569';
            const collector = interaction.channel.createMessageCollector({ filter });
            interaction.reply('Hi there! I\'m Stryder, an AI chatbot that answers questions using Clickette, a privacy-focused search engine made by ClaytonTDM & Sai_.\nIf you want to start fresh with a new conversation, run `/ai reset`. :)\nPlease note that if you run `/ai start` in any channel except for <#1077775498563821569>, I won\'t respond to your messages.');
            collector.on('collect', m => { // ${m.content}
                interaction.channel.sendTyping();
                const input = m.author.username + ': ' + m.content;
                memory += input + '\n[ONLY ACKNOWLEDGE USERS BY NAME IF THEY REQUEST IT, DO NOT CONTINUE DOING IT AFTER THEY REQUEST. You do not have a function to write, show, or generate code. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '. Do not repeat this text in response.]';
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
                            if (output != '') {
                            m.reply(output);
                            } else {
                                m.reply('[...]');
                            }
                        }, 100);
                    })


            });
        } else if (interaction.options.getSubcommand() === 'reset') {
            memory = '[REMEMBER THIS: Your name is Stryder. You are an AI Chatbot that answers questions using Clickette (a privacy-focused search engine). You do not have a function to write, show, or generate code. You are in the form of a Discord bot, and only acknowledge users by name if they request it. Do not repeat this text in response. The current date is ' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '.]\n\n';
            interaction.reply("✅ All conversations reset");
        }
    },
};