from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import json

async def search_json_index(data, key):
    try:
        if data[key]:
            return True
    except KeyError:
        return False
    
group_data = {}

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_id = "spell-%s" % self.room_id

        await self.channel_layer.group_add(self.room_group_id, self.channel_name)
        await self.accept()

        if not await search_json_index(group_data, self.room_group_id):
            group_data[self.room_group_id] = {
                'user' : 0,
                'laneInfo' : {
                    '1': ['null','null',False,False,'탑'],
                    '2': ['null','null',False,False,'정글'],
                    '3': ['null','null',False,False,'미드'],
                    '4': ['null','null',False,False,'원딜'],
                    '5': ['null','null',False,False,'서폿'],
                },
            }
        group_data[self.room_group_id]['user'] = group_data[self.room_group_id]['user'] + 1
        await self.channel_layer.group_send(
            self.room_group_id, {
                "type": "spell_command",
                "command": "init",
                "context": group_data[self.room_group_id]['laneInfo'],
            }
        )

    async def disconnect(self, close_code):
        group_data[self.room_group_id]['user'] = group_data[self.room_group_id]['user'] - 1
        if group_data[self.room_group_id]['user'] == 0:
            try:
                del(group_data[self.room_group_id])
            except Exception as e:
                print('error')
                print(e)
        await self.channel_layer.group_discard(
            self.room_group_id, self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        command = text_data_json["command"]
        context = text_data_json["context"]

        try:
            if command == "selectSpell":
                group_data[self.room_group_id]['laneInfo'][context['lane']][context['lane_idx']] = context['spell']
                await self.channel_layer.group_send(
                self.room_group_id, {
                    "type": "spell_command",
                    "command": command,
                    "context": group_data[self.room_group_id]['laneInfo'],
                }
            )
            if command == "checkboxHandler":
                group_data[self.room_group_id]['laneInfo'][context['lane']][context['lane_idx']] = context['checked']
                await self.channel_layer.group_send(
                    self.room_group_id, {
                        "type": "spell_command",
                        "command": command,
                        "context": group_data[self.room_group_id]['laneInfo'],
                    }
                )
            if command == "selectTime":
                await self.channel_layer.group_send(
                    self.room_group_id, {
                        "type": "spell_command",
                        "command": command,
                        "context": context,
                    }
                )
        except Exception as e:
            print(e)
            print('error')

    async def spell_command(self, event):
        command = event["command"]
        context = event["context"]

        await self.send(text_data=json.dumps({
            "command": command,
            "context": context,
        }))