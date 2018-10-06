from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers
from django.conf.urls import url

application = ProtocolTypeRouter({
	    'websocket': AuthMiddlewareStack(
        URLRouter(
        	[
        	url(r'^ws/TypeRacer/(?P<race_id>[^/]+)/$', consumers.TypeRacerConsumer),
			]
        )
    ),
})
