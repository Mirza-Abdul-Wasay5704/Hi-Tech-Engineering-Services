from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database — SQLite for local dev; set to the Supabase Postgres URL in prod
    database_url: str = "sqlite:///./hitech.db"

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 12

    # Initial admin (created on first startup if no admin exists)
    admin_email: str = "admin@hitechengineering.com"
    admin_password: str = "changeme123"

    # CORS — comma-separated origins
    cors_origins: str = "http://localhost:3000"

    # Next.js on-demand revalidation
    frontend_url: str = "http://localhost:3000"
    revalidate_secret: str = "change-me-revalidate"

    # Supabase storage (optional — falls back to local ./uploads when unset)
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_bucket: str = "media"

    # Resend email (optional — lead emails skipped when unset)
    resend_api_key: str = ""
    lead_notify_email: str = "hi.techengineering1971@gmail.com"
    # Resend's shared sender works with no domain verification. Once you verify
    # your own domain in Resend, override this env var with e.g. leads@yourdomain.com.
    lead_from_email: str = "onboarding@resend.dev"

    class Config:
        env_file = ".env"


settings = Settings()
