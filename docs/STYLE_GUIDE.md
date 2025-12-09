# Lumiere Style Guide

## FRONTEND (React + TypeScript)
- Use **functional components** with hooks (no class components)
- File naming: PascalCase for components, camelCase for functions
- Component props must be typed via interface
- API calls via `services/` layer
- Use React Query or SWR for async data fetching
- Avoid inline styles; use TailwindCSS or CSS Modules

Example:
```tsx
interface UserCardProps {
  username: string;
  email: string;
}

export const UserCard: React.FC<UserCardProps> = ({ username, email }) => {
  return (
    <div className="p-3 bg-white shadow rounded">
      <h3>{username}</h3>
      <p>{email}</p>
    </div>
  );
};
```

---

## BACKEND (FastAPI)
- Async routes (`async def`)
- Folder structure: `routers/`, `schemas/`, `models/`, `services/`
- Use Pydantic for schema validation
- Naming conventions: snake_case
- Use dependency injection via FastAPI `Depends`

Example:
```python
@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user(db, user_id)
```
