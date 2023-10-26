from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    data: dict

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/")
def highlight(list: Item):
    contents = list.data.get("content")
    new_list= []
    
    new_list.append(contents[0])
    new_list.append(contents[1])
    new_list.append(contents[2])
    return {"content": new_list}
