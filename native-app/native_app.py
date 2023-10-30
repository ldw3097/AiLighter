#!/usr/bin/python -u

import subprocess
import json
import sys

def get_message():
    message_length = sys.stdin.buffer.read(4)

    if not message_length:
        sys.exit(0)
    message_length = int.from_bytes(message_length, byteorder='little')
    message = sys.stdin.buffer.read(message_length).decode('utf-8')

    return json.loads(message)

def execute_npm_module(address):
    try:
        command = "readability " + address

        # npm 모듈을 실행하고 결과를 가져옴
        result = subprocess.check_output(command, shell=True)

    except subprocess.CalledProcessError as e:
        # 실행 중 오류가 발생한 경우 오류 메시지 반환
        result = e.output
        
    return result

while True:
    message = get_message()
    if 'Address' in message:
        address = message['Address']
        content = execute_npm_module(address)
        decoded_content = content.decode('utf-8')
        content_list = decoded_content.split('\n')
        new_list = []

        for i in range(len(content_list)-5):
            if content_list[i+4] and content_list[i+4].strip():
                content_list[i+4] = content_list[i+4].replace(u'\xa0',u' ')
                devided_content = content_list[i+4].split('. ')
                for j in range(len(devided_content)-1):
                    append_content = devided_content[j] + '.'
                    new_list.append(append_content)
                new_list.append(devided_content[len(devided_content)-1])
            else:
                continue

        response = {'result': new_list}
        response_message = json.dumps(response)
        response_length = len(response_message)
        sys.stdout.buffer.write(response_length.to_bytes(4, byteorder='little'))
        sys.stdout.buffer.write(response_message.encode('utf-8'))
        sys.stdout.buffer.flush()
