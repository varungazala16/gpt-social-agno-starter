from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class UserCreditBase(BaseModel):
    user_id: str
    balance: int


class UserCreditResponse(UserCreditBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreditTransactionBase(BaseModel):
    user_id: str
    amount: int
    balance_after: int
    transaction_type: Literal["deduct", "topup", "initialize"]
    description: str | None = None


class CreditTransactionResponse(CreditTransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CreditBalanceResponse(BaseModel):
    user_id: str
    balance: int


class CreditDeductionRequest(BaseModel):
    amount: int
    description: str | None = None
