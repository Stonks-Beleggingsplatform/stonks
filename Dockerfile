ARG IMAGE='production'

# ---- BASE IMAGE ---- #
FROM ghcr.io/sitepilot/php-nginx:8.3-1.x AS base

USER root

ENV NGINX_PUBLIC_DIR='/public' \
    PHP_DATE_TIMEZONE='Europe/Amsterdam'

USER $RUNTIME_UID

# ---- DEVELOMENT IMAGE ---- #
FROM base AS development

USER root

RUN curl -fsSL https://nodejs.org/dist/v18.20.2/node-v18.20.2-linux-x64.tar.xz \
    | tar -xJ -C /usr/local --strip-components=1 \
    && ln -s /usr/local/bin/node /usr/bin/node \
    && ln -s /usr/local/bin/npm /usr/bin/npm

USER $RUNTIME_UID


# ---- PRODUCTION IMAGE ---- #
FROM base AS production

COPY --chown=$RUNTIME_UID:$RUNTIME_GID ./ $NGINX_FILES_DIR

RUN php artisan storage:link

# ---- FINAL IMAGE ---- #
FROM ${IMAGE} AS final
