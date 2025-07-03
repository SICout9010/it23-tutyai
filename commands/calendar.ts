import dayjs from 'dayjs';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const schedule = {
  "1": [
    undefined,
    undefined,
  ],
  "2": [
    { day: 'Monday', time: '11:00 - 13:00', subject: 'PROBLEM SOLVING AND COMPUTER PROGRAMMING', room: 'IT slope' },
    { day: 'Monday', time: '14:00 - 16:00', subject: 'INTRODUCTION TO COMPUTER SYSTEMS', room: 'IT Project Base3 ชั้น 3' },
    { day: 'Tuesday', time: '13:00 - 16:00', subject: 'MATHEMATICS FOR INFORMATION TECHNOLOGY', room: 'IT M 22' },
    { day: 'Tuesday', time: '16:00 - 18:00', subject: 'INFORMATION TECHNOLOGY FUNDAMENTALS', room: 'IT Project Base4 ชั้น 3' },
    { day: 'Wednesday', time: '09:00 - 12:00', subject: 'CHARM SCHOOL', room: 'IT M 22' },
    { day: 'Thursday', time: '13:00 - 16:00', subject: 'FOUNDATION ENGLISH 1', room: 'ตึกพระเทพ D-302 B' },
    { day: 'Friday', time: '09:00 - 11:00', subject: 'PROBLEM SOLVING AND COMPUTER PROGRAMMING', room: 'IT L203' },
    { day: 'Friday', time: '11:00 - 13:00', subject: 'INFORMATION TECHNOLOGY FUNDAMENTALS', room: 'IT Lab 434' },
    { day: 'Friday', time: '14:00 - 16:00', subject: 'INTRODUCTION TO COMPUTER SYSTEMS', room: 'IT L207' }
  ]
};

export const data = new SlashCommandBuilder()
    .setName('calendar')
    .setDescription('ดูตารางการเรียน')
    .addNumberOption(option => option.setName('section').setDescription('sec ที่เรียน').setRequired(true))

export async function execute(interaction: ChatInputCommandInteraction) {
    const section = interaction.options.getNumber('section') || 1;
    const now = dayjs().format('dddd HH:mm'); // Example: 'Monday 14:32'
    const [today, currentTime] = now.split(' ');

    const current = schedule[section].find(entry => {
      if (entry.day === today) {
        const [start, end] = entry.time.split(' - ');
        return dayjs(currentTime, 'HH:mm').isAfter(dayjs(start, 'HH:mm')) &&
               dayjs(currentTime, 'HH:mm').isBefore(dayjs(end, 'HH:mm'));
      }
      return false;
    });

    const scheduleText = schedule[section]
        .filter(entry => entry.day === today)
        .map(entry => {
            const [_, end] = entry.time.split(' - ');
            const isPassed = dayjs(currentTime, 'HH:mm').isAfter(dayjs(end, 'HH:mm'));
            const isCurrent = current?.subject === entry.subject;
            
            const emoji = isPassed ? '✅ ' : isCurrent ? '⏳ ' : '💤 ';
            return `${emoji}${entry.time}: ${entry.subject} (${entry.room})`;
        })
        .join('\n');

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('📅 ตารางการเรียน')
        .addFields(
            { name: '📅 วันที่', value: `วัน ${today} ที่ ${dayjs().format('DD/MM/YYYY')}`, inline: true },
            { name: '⏰ เวลา', value: `เวลา ${currentTime}`, inline: true },
            { name: '🏫 ห้องเรียน', value: scheduleText, inline: true },
            { name: '🎓 SECTION', value: `**${section}**`, inline: true }
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({
            text: '🔐 ตารางการเรียน',
            iconURL: 'http://hub.it.kmitl.ac.th/hub/wp-content/uploads/2025/02/logo-white.png'
        });

    await interaction.reply({ embeds: [embed], ephemeral: false });
}