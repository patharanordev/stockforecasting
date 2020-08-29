mkdir -p pgdata && \
(docker network create stock-forecasting || :) && \
docker-compose -f docker-compose.yml stop && \
docker-compose -f docker-compose.yml down -v && \
docker-compose -f docker-compose.yml up --build -d && \
docker-compose logs -f