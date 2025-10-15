from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class UserCredit(Base):  # type: ignore[misc]
    __tablename__ = "user_credits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, nullable=False, index=True)  # Supabase UUID
    balance = Column(Integer, nullable=False, default=1000)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CreditTransaction(Base):  # type: ignore[misc]
    __tablename__ = "credit_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)  # Supabase UUID
    amount = Column(Integer, nullable=False)  # Negative for deductions, positive for additions
    balance_after = Column(Integer, nullable=False)  # Balance after this transaction
    transaction_type = Column(String, nullable=False)  # 'deduct', 'topup', 'initialize'
    description = Column(Text, nullable=True)  # Optional description of the operation
    created_at = Column(DateTime(timezone=True), server_default=func.now())