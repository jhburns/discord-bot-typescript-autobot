import { Message, RichEmbed } from 'discord.js';
import { CLIENT }             from '../Bot';
import { KarmaPoint }         from '../db/entity/KarmaPoint';
import { DB }                 from '../index';

export class KarmaPointHandler {

    public static handle(message: Message): any {

        const matches = message.content.match(/(thanks|thank you).*?<@(.*?)>/);

        if (matches && matches.length > 0) {

            CLIENT.fetchUser(matches[ 2 ]).then(member => {

                if (message.member.id === member.id) {

                    // @ts-ignore
                    CLIENT.guilds.first().channels.get(message.channel.id).send(`Sorry <@${ message.author.id }>, you can't give karma to yourself. :sob:`);

                } else {

                    let karmaPoint: KarmaPoint = new KarmaPoint();

                    karmaPoint.from_userid = message.author.id;
                    karmaPoint.from_discriminator = message.author.discriminator;
                    karmaPoint.from_username = message.author.username;

                    karmaPoint.to_userid = member.id;
                    karmaPoint.to_discriminator = member.discriminator;
                    karmaPoint.to_username = member.username;

                    DB.manager.save(karmaPoint);

                    const embed = new RichEmbed().setTitle(`Learn more about Karma Points..`)
                                                 .setDescription(`Congratulations <@${ member.id }>, you've received a Karma Point!`)
                                                 .setAuthor(`Karma From ${ member.username }`)
                                                 .setColor(0x00AE86)
                                                 .setURL("https://forum.bitmerge.org/t/karma");

                    // @ts-ignore
                    CLIENT.guilds.first().channels.get(message.channel.id).send({ embed });

                }

            });

        }

    }

}
