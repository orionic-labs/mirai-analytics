import os
import json
from flask import Flask, request, Response
from flask_sock import Sock
from openai import OpenAI
from twilio.rest import Client

# ----------------------------
# Config
# ----------------------------
PORT = int(os.getenv("PORT", 8080))
DOMAIN = os.getenv("NGROK_URL")  # e.g. "1234abcd.ngrok-free.app"
WS_URL = f"wss://{DOMAIN}/ws"

WELCOME_GREETING = "Hi! I am a voice assistant powered by Twilio and OpenAI. Ask me anything!"
SYSTEM_PROMPT = (
    "You are a helpful assistant. This conversation is being translated to voice, "
    "so answer carefully. When you respond, please spell out all numbers, for example twenty not 20. "
    "Do not include emojis in your responses. Do not include bullet points, asterisks, or special symbols."
)

# ----------------------------
# API Keys
# ----------------------------
OPENAI_API_KEY = "sk-0G3hqTxAsPu8zdnGjjlMOZRfd0jUTpEKiZ3mbw3dKPT3BlbkFJaU7hVpjGXdI4k0jPgIW23h6VagPrJnrn8tUhjRcSIA"
TWILIO_SID =  'ACe4d6dc4aa9755eaff66e52f7416bb291'
TWILIO_AUTH = "f9cb7683bd0aff39afa88ceabee0cc5b"


# Replace with your real numbers
TO_NUMBER = "+4915159002875"  # e.g. "+491701234567" (your phone)
FROM_NUMBER = "+12792391246"  # e.g. "+12792391246" (your Twilio number)

openai = OpenAI(api_key=OPENAI_API_KEY)
client = Client(TWILIO_SID, TWILIO_AUTH)

# ----------------------------
# Flask App
# ----------------------------
app = Flask(__name__)
sock = Sock(app)

sessions = {}

# ----------------------------
# AI response (OpenAI)
# ----------------------------
def ai_response(messages):
    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    return completion.choices[0].message.content

# ----------------------------
# Twilio Webhook (TwiML)
# ----------------------------
@app.route("/twiml", methods=["GET", "POST"])
def twiml():
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <ConversationRelay
          url="{WS_URL}"
          ttsProvider="ElevenLabs"
          voice="ZF6FPAbjXT4488VcRRnw-flash_v2_5-1.2_1.0_1.0"
          elevenlabsTextNormalization="on"
          welcomeGreeting="{WELCOME_GREETING}" />
      </Connect>
    </Response>"""
    return Response(xml, mimetype="text/xml")

# ----------------------------
# WebSocket Handler
# ----------------------------
@sock.route("/ws")
def ws_handler(ws):
    while True:
        try:
            data = ws.receive()
            if not data:
                break

            message = json.loads(data)

            if message["type"] == "setup":
                call_sid = message["callSid"]
                print("Setup for call:", call_sid)
                ws.call_sid = call_sid
                sessions[call_sid] = [{"role": "system", "content": SYSTEM_PROMPT}]

            elif message["type"] == "prompt":
                print("Prompt from caller:", message["voicePrompt"])
                conversation = sessions.get(ws.call_sid, [])
                conversation.append({"role": "user", "content": message["voicePrompt"]})

                # Get AI response
                response_text = ai_response(conversation)
                conversation.append({"role": "assistant", "content": response_text})
                sessions[ws.call_sid] = conversation

                # Send back to Twilio -> ElevenLabs will voice it
                ws.send(json.dumps({
                    "type": "text",
                    "token": response_text,
                    "last": True
                }))
                print("Sent response:", response_text)

            elif message["type"] == "interrupt":
                print("Interruption detected.")

        except Exception as e:
            print("WebSocket error:", e)
            break

    if hasattr(ws, "call_sid"):
        sessions.pop(ws.call_sid, None)
    print("WebSocket closed")

# ----------------------------
# Make a Call (startup)
# ----------------------------

def trigger_call():
    print("Starting outbound call...")
    call = client.calls.create(
        to=TO_NUMBER,
        from_=FROM_NUMBER,
        url=f"https://{DOMAIN}/twiml"  # Twilio fetches TwiML here
    )
    print("Call SID:", call.sid)

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    trigger_call()  # run immediately when app starts
    app.run(host="0.0.0.0", port=PORT)
