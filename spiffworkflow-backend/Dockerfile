# Base image to share ENV vars that activate VENV.
FROM python:3.12.1-slim-bookworm AS base

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

######################## - DEPLOYMENT

# base plus packages needed for deployment. Could just install these in final, but then we can't cache as much.
# vim is just for debugging
FROM base AS deployment

# Update and install necessary packages
RUN apt-get update \
  && apt-get install -y -q --no-install-recommends libaio1 git-core curl procps gunicorn3 default-mysql-client vim-tiny jq libkrb5support0 libexpat1 apt-utils \
  && rm -rf /var/lib/apt/lists/*

# Update pip and install poetry
RUN pip install --upgrade pip \
  && pip install poetry==1.8.1

# Install PostgreSQL client library
RUN apt-get update \
  && apt-get install -y --no-install-recommends libpq5 \
  && rm -rf /var/lib/apt/lists/*

######################## - SETUP

# Setup image for installing Python dependencies
FROM base AS setup

# Install Poetry and other build dependencies
RUN pip install poetry==1.6.1 \
  && apt-get update \
  && apt-get install -y --no-install-recommends gcc libssl-dev libpq-dev default-libmysqlclient-dev pkg-config libffi-dev dos2unix git nano curl unzip \
  && rm -rf /var/lib/apt/lists/*

# Install additional Python dependencies
RUN pip install hdbcli pandas openpyxl postgres aes-everywhere pybase64 jinja2 xmltodict oracledb

# Copy project files for Poetry dependency installation
COPY pyproject.toml poetry.lock /app/

# Install dependencies using Poetry
RUN poetry install --without dev

# Clone and move connectordb library into site-packages
RUN git clone https://github.com/emersonlgregorio/connectordb.git \
  && mv connectordb /app/venv/lib/python3.12/site-packages/

# Update library path for Oracle InstantClient
ENV LD_LIBRARY_PATH="/app/oracle/instantclient_21_13:$LD_LIBRARY_PATH"

# Copy application code and adjust line endings
COPY . /app
RUN dos2unix /app/bin/boot_server_in_docker \
  && poetry install --without dev

######################## - FINAL

# Final image without setup dependencies.
FROM deployment AS final

LABEL source="https://github.com/sartography/spiff-arena/spiffworkflow-backend"
LABEL description="Backend component of SpiffWorkflow, a software development platform for building, running, and monitoring executable diagrams"

# Copy application from setup stage
COPY --from=setup /app /app

# Define the entrypoint command
CMD ["./bin/boot_server_in_docker"]
