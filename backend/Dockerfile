# FastAPI backend — runs on Hugging Face Spaces (Docker), Koyeb, Fly, Render, etc.
# Hugging Face Spaces require the app to listen on port 7860 and run as UID 1000.
FROM python:3.11-slim

RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user . .
USER user

EXPOSE 7860
# Honor $PORT when the host sets one (Koyeb/Render); default to 7860 for HF Spaces.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
