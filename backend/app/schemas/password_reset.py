from pydantic import BaseModel, EmailStr


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetVerify(BaseModel):
    token: str
    new_password: str


class PasswordResetResponse(BaseModel):
    message: str

