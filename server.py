import os
from fastapi import FastAPI
import dotenv
import uvicorn
import pydantic
from supabase import create_client, Client

app = FastAPI()

dotenv.load_dotenv(dotenv_path='.env.local')

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/")
async def root():
    return supabase.table('Events').select('*').execute()

@app.get("/search/name/{name}")
async def search_by_name(name):
    return supabase.table('Events').select('*').text_search("name", name, options={"config": "english"}).execute()

@app.get("/search/food/{food}")
async def search_by_food(food):
    return supabase.table('Events').select('*').contains("food", [food]).execute()
