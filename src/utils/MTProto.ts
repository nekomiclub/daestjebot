import { Api } from 'telegram';
import { client } from '~/conf';
import { TParticipantUser } from '~/types/MTProto';



/** Get group participants list */
export async function getGroupParticipants(chatId: number): Promise<TParticipantUser[]> {
  const participants = await client.invoke(new Api.channels.GetParticipants({
    channel: chatId,
    filter: new Api.ChannelParticipantsRecent(),
    offset: 0,
    limit: 200
  }));

  return (participants as any).users as TParticipantUser[];
}