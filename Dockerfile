FROM python:3.13-slim

WORKDIR /src

RUN apt-get update && apt-get install -y --no-install-recommends \
       gcc \
       libpq-dev \
       python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "aviationwebapp.wsgi:application", "--bind", "0.0.0.0:8000"]