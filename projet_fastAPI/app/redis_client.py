import redis

r = redis.Redis(
    host="localhost",      # Si tu utilises Docker avec bridge, adapte le host
    port=6379,
    decode_responses=True  # Pour éviter de recevoir des bytes
)
