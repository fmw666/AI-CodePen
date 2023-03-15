import asyncio
from typing import List

import openai

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel


app = FastAPI()
openai.api_key = "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"

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})

@app.options("/")
async def options_root(request: Request):
    return {"message": "Hello World"}


class ChatGPTReq(BaseModel):
    messages: List


async def run_chat_completion(req: ChatGPTReq):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=req.messages
    )
    return completion


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
    try:
        completion = await asyncio.wait_for(run_chat_completion(req), timeout=5)
        result = await asyncio.wait_for(completion, timeout=5)
        return result
    except asyncio.TimeoutError:
        return JSONResponse(status_code=408, content={"message": "Request Timeout"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="127.0.0.1", port=8000, debug=True, reload=True)
