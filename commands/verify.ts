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
            .setDescription('sec ที่อยู่ปัจจุบัน')
            .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const discordId = interaction.user.id;
    const member = await interaction.guild?.members.fetch(discordId);

    const studentId = interaction.options.getString('student_id');
    const nickname = interaction.options.getString('nickname');
    const section = interaction.options.getNumber('section');

    await interaction.deferReply({ ephemeral: true });

    const allowedSections = [1, 2, 3];

    if (!studentId || !nickname || !section) {
        const failEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ ยืนยันตัวตนไม่สำเร็จ')
            .setDescription('กรุณาระบุข้อมูลให้ครบถ้วน')
            .setTimestamp()
            .setFooter({
                text: '🔐 verify system',
                iconURL: 'http://hub.it.kmitl.ac.th/hub/wp-content/uploads/2025/02/logo-white.png'
            });
        await interaction.deleteReply();
        await interaction.channel?.send({ embeds: [failEmbed] });
        return;
    }

    if (!allowedSections.includes(section)) {
        const invalidSecEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('⚠️ ข้อมูล section ไม่ถูกต้อง')
            .setDescription(`กรุณาเลือกห้องเรียนแค่ตาม Sec ที่มีจิง`)
            .setTimestamp()
            .setFooter({
                text: '🔐 verify system',
                iconURL: 'http://hub.it.kmitl.ac.th/hub/wp-content/uploads/2025/02/logo-white.png'
            });
        await interaction.deleteReply();
        await interaction.channel?.send({ embeds: [invalidSecEmbed] });
        return;
    }

    const sectionRoles = {
        1: '1390368345567662113',
        2: '1390368403377750088',
        3: '1390368446528618668' 
    };

    const it23RoleId = '1390368273320644639';
    const secRoleId = sectionRoles[section];
    
    await member?.roles.add([it23RoleId, secRoleId]);
    await member?.setNickname(`${nickname} Sec${section}`);

    // await member?.roles.add(interaction.guil
    // d?.roles.cache.find(role => role.name === 'IT23')!);
    // await member?.setNickname(nickname + ' Sec' + section)

    const successEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ ยืนยันตัวตนสำเร็จแล้ว')
        .setDescription([
            `> 👤 **StudentId :** ${studentId}`,
            `> 🧸 **ชื่อเล่น :** ${nickname}`,
            `> 🏷️ **SEC :** ${section}`,
            `> 🎺 **ได้รับยศ :** <@&${it23RoleId}> + <@&${secRoleId}>`
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
