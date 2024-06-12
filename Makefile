build: 
  docker build -t gpt-image:1.0 .

run:
  docker run -d -p 3000:3000 --name gpt-bot gpt-image:1.0