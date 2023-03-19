import os
from typing import List

import openai

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel


app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# openai.api_key = OPENAI_API_KEY
openai.api_key = "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"

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})

@app.options("/")
async def options_root(request: Request):
    return {"message": "Hello World"}

class ChatGPTReq(BaseModel):
    messages: List
    max_tokens: int = 3800
    temperature: float = 0.7

@app.post("/chatgpt")
async def chatgpt(req: ChatGPTReq):
    """
    请求格式：
    {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "I need help."},
            {"role": "assistant", "content": "How can I help you?"},
            ...
        ]
    }
    """
    # if not OPENAI_API_KEY:
    #     return JSONResponse(status_code=500, content={"message": "OpenAI API Key is not set"})

    try:
        return openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=req.messages
        )
    except openai.error.APIError as e:
        return JSONResponse(status_code=500, content={"message": f"OpenAI API Error: {e}"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="127.0.0.1", port=8000, debug=True, reload=True)
