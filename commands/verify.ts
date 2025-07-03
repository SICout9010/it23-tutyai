import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export const data = new SlashCommandBuilder()
    .setName('verify')
    .setDescription('ยืนยันตัวตนผู้เข้าแข่งขัน')
    .addStringOption(option => 
        option.setName('student_id')
        .setDescription('รหัสนักศึกษา')
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('nickname')
        .setDescription('ชื่อเล่น')
        .setRequired(true)
    )
    .addNumberOption(option => 
        option.setName('section')
        .setDescription('sec')
        .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const discordId = interaction.user.id;
    const member = await interaction.guild?.members.fetch(discordId);

    const studentId = interaction.options.getString('student_id');
    const nickname = interaction.options.getString('nickname');
    const section = interaction.options.getNumber('section');

    await interaction.deferReply({ ephemeral: true });

    if (!studentId || !nickname || !section) {
        const failEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ ยืนยันตัวตนไม่สำเร็จ')
            .setDescription('กรุณาระบุข้อมูลให้ครบถ้วน')
            .setTimestamp()
            .setFooter({
                text: 'ระบบยืนยันตัวตน',
                iconURL: 'https://cdn.discordapp.com/app-icons/1364925470143156265/b69ddb6462f622ac74d34acd9745dad5.png'
            });
        await interaction.deleteReply();
        await interaction.channel?.send({ embeds: [failEmbed] });
        return;
    }

    // await member?.roles.add(interaction.guild?.roles.cache.find(role => role.name === 'IT23')!);
    // await member?.setNickname(nickname + ' Sec' + section)

    const successEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ ยืนยันตัวตนสำเร็จแล้ว')
        .setDescription([
            `> 👤 **ชื่อในระบบ :** ${member?.displayName}`,
            `> 👤 **ชื่อเล่น :** ${nickname}`,
            `> 🏷️ **Discord :** <@${interaction.user.id}>`,
            `> 🎺 **ได้รับยศ :** <@&1364676158318182440>`
        ].join('\n'))
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({
            text: '🔐 verify system',
            iconURL: 'http://hub.it.kmitl.ac.th/hub/wp-content/uploads/2025/02/logo-white.png'
        });

    await interaction.deleteReply();
    await interaction.channel?.send({ embeds: [successEmbed] });
    console.log('ยืนยันตัวตนเรียบร้อยแล้ว');
    return;
}
