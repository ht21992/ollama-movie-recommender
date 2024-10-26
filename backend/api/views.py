import json
import requests
from django.http import StreamingHttpResponse
from django.views import View
from django.conf import settings


class MovieRecommendationView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return StreamingHttpResponse("Invalid JSON data", status=400)

        genre = data.get("genre")
        country = data.get("country")
        year = data.get("year")
        actor = data.get("actor")

        prompt = (
            f"Recommend a {genre} movie from {country} "
            f"starring {actor}, released in {year}."
            f"Answer as short as possible."
        )

        url = "http://localhost:11434/api/generate"
        headers = {"Content-Type": "application/json"}
        payload = {"model": settings.OLLAMA_MODEL, "prompt": prompt, "stream": True}

        try:
            response = requests.post(url, headers=headers, json=payload, stream=True)

            if response.status_code == 200:
                # Stream chunks back to the frontend
                return StreamingHttpResponse(
                    self.stream_response(response),
                    content_type="text/event-stream",
                )
            else:
                return StreamingHttpResponse(
                    f"Error from Ollama: {response.text}", status=response.status_code
                )
        except requests.exceptions.RequestException as e:
            return StreamingHttpResponse(f"Request failed: {str(e)}", status=500)

    def stream_response(self, response):
        """Generator to yield response chunks from Ollama."""
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                yield chunk.decode("utf-8")
