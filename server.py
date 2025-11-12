import os
from fastapi import FastAPI, HTTPException, status
import dotenv
import uvicorn
from supabase import create_client, Client
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional
from datetime import datetime
from enum import Enum


class StockLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Event(BaseModel):
    id: int | None = None
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    organization: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    food: list[str] = Field(..., min_items=1)
    date: str = Field(..., regex=r"^\d{4}-\d{2}-\d{2}$")  # YYYY-MM-DD
    start_time: str = Field(..., regex=r"^\d{2}:\d{2}$")  # HH:MM
    end_time: str = Field(..., regex=r"^\d{2}:\d{2}$")    # HH:MM

    @field_validator("date")
    def valid_date(cls, v: str):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("date must be in YYYY-MM-DD format and a valid date")
        return v

    @field_validator("start_time", "end_time")
    def valid_time(cls, v: str):
        try:
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("time must be in HH:MM 24-hour format")
        return v

    @field_validator("end_time")
    def end_after_start(cls, v: str, info: ValidationInfo):
        # info.data contains other field values validated so far
        start = info.data.get("start_time")
        if start:
            try:
                s = datetime.strptime(start, "%H:%M")
                e = datetime.strptime(v, "%H:%M")
            except ValueError:
                # other validators will raise specific messages
                return v
            if e <= s:
                raise ValueError("end_time must be after start_time")
        return v


class Food(BaseModel):
    id: int | None = None
    name: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=0)
    stockLevel: StockLevel = StockLevel.MEDIUM
    dietaryTags: list[str] = Field(default_factory=list)
    description: Optional[str] = Field(default="")
    event_id: int = Field(..., ge=0)


class ReserveRequest(BaseModel):
    food_id: int
    quantity: int = Field(..., gt=0)
    
    
app = FastAPI()

dotenv.load_dotenv(dotenv_path='.env.local')

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/")
async def root():
    return supabase.table('Events').select('*').execute()

@app.get("/search/name/{name}")
async def search_by_name(name: str):
    return supabase.table('Events').select('*').text_search("name", name, options={"config": "english"}).execute()

@app.get("/search/food/{food}")
async def search_by_food(food: str):
    return supabase.table('Events').select('*').contains("food", [food]).execute()

@app.post("/event/")
async def add_event(event: Event):
    # Use the dict representation and exclude None values
    payload = event.model_dump(exclude_none=True)
    try:
        response = supabase.table('Events').insert(payload).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return response

@app.put("/reserve/")
async def reserve_item(reserve: ReserveRequest):
    # fetch current quantity
    try:
        q_resp = supabase.table('Food').select('quantity').eq("id", reserve.food_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # supabase client may return an object with .data or a dict with 'data'
    data = None
    if isinstance(q_resp, dict):
        data = q_resp.get('data')
    else:
        data = getattr(q_resp, 'data', None)

    if not data or len(data) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food item not found")

    # extract quantity value
    try:
        current_qty = data[0].get('quantity') if isinstance(data[0], dict) else data[0]['quantity']
    except Exception:
        # fallback - try indexing
        try:
            current_qty = data[0][0]
        except Exception:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to read current quantity")

    if current_qty is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Current quantity missing")

    new_qty = current_qty - reserve.quantity
    if new_qty < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock to reserve requested quantity")

    try:
        update_resp = supabase.table('Food').update({'quantity': new_qty}).eq("id", reserve.food_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    return update_resp
